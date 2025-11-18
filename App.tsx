
import React, { useState, useCallback } from 'react';
import { BookOpenIcon, EditIcon, SunIcon, MoonIcon, PanelLeftIcon, SettingsIcon } from './components/Icons';
import BibleNav from './components/BibleNav';
import StudyNav from './components/StudyNav';
import BibleReader from './components/BibleReader';
import SettingsModal from './components/SettingsModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTheme } from './hooks/useTheme';
import { StudyNode } from './types';
import { useLanguage } from './contexts/LanguageContext';

type ActiveView = 'bible' | 'studies';

interface CurrentLocation {
    bookId: string;
    chapter: number;
    verse?: number;
}

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>('bible');
  const [currentLocation, setCurrentLocation] = useState<CurrentLocation | null>({ bookId: 'gen', chapter: 1 });
  const [studyData, setStudyData] = useLocalStorage<StudyNode[]>('bible-study-data', []);
  const [selectedStudyNode, setSelectedStudyNode] = useState<StudyNode | null>(null);
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  const handleSelectChapter = useCallback((bookId: string, chapter: number) => {
    // Selecting a chapter updates the view but DOES NOT close the sidebar
    // It also clears the selected verse highlight
    setCurrentLocation({ bookId, chapter });
    setSelectedStudyNode(null);
    if (activeView !== 'bible') {
        setActiveView('bible');
    }
  }, [activeView]);

  const handleSelectVerse = useCallback((bookId: string, chapter: number, verse: number) => {
      // Selecting a verse updates location AND closes the sidebar
      setCurrentLocation({ bookId, chapter, verse });
      setSelectedStudyNode(null);
      if (activeView !== 'bible') {
        setActiveView('bible');
      }
      setIsNavOpen(false);
  }, [activeView]);
  
  const handleSelectStudyNode = useCallback((node: StudyNode | null) => {
    setSelectedStudyNode(node);
    if (activeView !== 'studies') {
        setActiveView('studies');
    }
    // Optional: You can uncomment the line below if you want studies to also auto-close the sidebar
    // setIsNavOpen(false);
  }, [activeView]);


  return (
    <div className="flex flex-col h-screen font-sans bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Top Navigation Bar */}
      <header className="flex-shrink-0 h-16 flex items-center justify-between px-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm z-20">
        <div className="flex items-center gap-3">
           <button 
             onClick={() => setIsNavOpen(!isNavOpen)}
             className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
             title={isNavOpen ? "Close Sidebar" : "Open Sidebar"}
           >
             <PanelLeftIcon />
           </button>
           <div className="flex items-center gap-2 border-l border-gray-200 dark:border-gray-700 pl-3">
              <div className="text-blue-600 dark:text-blue-400">
                <BookOpenIcon /> 
              </div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 hidden md:block">{t('appTitle')}</h1>
           </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
          {/* Main Sidebar - Tab Selector */}
          <nav className="flex flex-col items-center justify-between p-2 bg-gray-100 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 w-16 z-10 py-4">
            <div className="flex flex-col gap-4 w-full items-center">
                <button
                  onClick={() => { setActiveView('bible'); setIsNavOpen(true); }}
                  className={`p-3 rounded-lg transition-all duration-200 ${activeView === 'bible' ? 'bg-blue-600 text-white shadow-md scale-105' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
                  title={t('bible')}
                >
                  <BookOpenIcon />
                </button>
                <button
                  onClick={() => { setActiveView('studies'); setIsNavOpen(true); }}
                  className={`p-3 rounded-lg transition-all duration-200 ${activeView === 'studies' ? 'bg-blue-600 text-white shadow-md scale-105' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
                  title={t('studies')}
                >
                  <EditIcon />
                </button>
            </div>

            <div className="flex flex-col gap-4 w-full items-center mt-auto">
                 <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-3 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title={t('settings')}
                >
                  <SettingsIcon />
                </button>
                <button
                  onClick={toggleTheme}
                  className="p-3 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                </button>
            </div>
          </nav>

          {/* Navigation Panel (Expandable/Collapsible) */}
          <aside className={`${isNavOpen ? 'w-64 md:w-80 border-r' : 'w-0 border-none'} flex-shrink-0 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-300 ease-in-out overflow-hidden`}>
            <div className="w-64 md:w-80 h-full">
                {activeView === 'bible' ? (
                <BibleNav 
                    onSelectChapter={handleSelectChapter} 
                    onSelectVerse={handleSelectVerse}
                    selectedChapter={selectedStudyNode ? null : currentLocation} 
                />
                ) : (
                <StudyNav studyData={studyData} setStudyData={setStudyData} setSelectedStudyNode={handleSelectStudyNode}/>
                )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-grow bg-gray-50 dark:bg-gray-900/50 relative overflow-hidden">
            <BibleReader 
                selectedChapter={currentLocation} 
                selectedStudyNode={selectedStudyNode}
                setStudyData={setStudyData}
            />
          </main>
      </div>

      {isSettingsOpen && (
        <SettingsModal onClose={() => setIsSettingsOpen(false)} />
      )}
    </div>
  );
};

export default App;
