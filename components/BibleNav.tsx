
import React, { useState, useEffect, useMemo } from 'react';
import { getBooksStructure, AVAILABLE_VERSIONS, fetchChapter } from '../services/bibleService';
import { AVAILABLE_COMMENTARIES } from '../services/commentaryService';
import { ChevronRightIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';
import { useBible } from '../contexts/BibleContext';

interface BibleNavProps {
  onSelectChapter: (bookId: string, chapter: number) => void;
  onSelectVerse: (bookId: string, chapter: number, verse: number) => void;
  selectedChapter: { bookId: string; chapter: number; verse?: number } | null;
}

const BibleNav: React.FC<BibleNavProps> = ({ onSelectChapter, onSelectVerse, selectedChapter }) => {
  const { currentVersionId, setVersion, currentCommentaryId, setCommentary } = useBible();
  const { t, language } = useLanguage();
  
  // Use static structure for instant loading
  const books = useMemo(() => getBooksStructure(language), [language]);

  const [openBook, setOpenBook] = useState<string | null>(selectedChapter?.bookId || books[0]?.id || null);
  const [expandedChapter, setExpandedChapter] = useState<number | null>(selectedChapter?.chapter || null);
  
  // We need to fetch verse count dynamically or just list a reasonable amount.
  // To avoid complex async logic in the Nav just for verse buttons, 
  // we will render chapter buttons, and when expanded, we can perhaps 
  // show verses if data is available, or just let the user click the chapter.
  // For this UI, let's simplify: Clicking a chapter opens the reader. 
  // Verse selection inside Nav is a bit heavy if we don't have data loaded.
  // Let's try to load the chapter data *if* expanded to show verse buttons.
  const [verseCount, setVerseCount] = useState<number>(0);

  useEffect(() => {
    if (selectedChapter) {
        setOpenBook(selectedChapter.bookId);
        setExpandedChapter(selectedChapter.chapter);
    }
  }, [selectedChapter?.bookId, selectedChapter?.chapter]);

  // Effect to get verse count when a chapter is expanded in nav
  useEffect(() => {
      let isMounted = true;
      if (openBook && expandedChapter) {
          fetchChapter(currentVersionId, openBook, expandedChapter).then(data => {
              if (isMounted && data) {
                  setVerseCount(data.verses.length);
              }
          });
      } else {
          setVerseCount(0);
      }
      return () => { isMounted = false; };
  }, [currentVersionId, openBook, expandedChapter]);

  const toggleBook = (bookId: string) => {
    if (openBook === bookId) {
        setOpenBook(null);
    } else {
        setOpenBook(bookId);
        setExpandedChapter(null);
    }
  };

  const handleChapterClick = (bookId: string, chapter: number) => {
      setExpandedChapter(chapter);
      onSelectChapter(bookId, chapter);
  };

  return (
    <div className="w-full h-full bg-white dark:bg-gray-800 flex flex-col">
      
      {/* Selectors Area */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 space-y-3">
          <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('version')}</label>
              <select 
                  value={currentVersionId} 
                  onChange={(e) => setVersion(e.target.value)}
                  className="w-full p-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                  {AVAILABLE_VERSIONS.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
              </select>
          </div>
          
          <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('commentary')}</label>
              <select 
                  value={currentCommentaryId || ''} 
                  onChange={(e) => setCommentary(e.target.value || null)}
                  className="w-full p-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                  <option value="">{t('noCommentary')}</option>
                  {AVAILABLE_COMMENTARIES.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
              </select>
          </div>
      </div>

      {/* Books List */}
      <div className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
            {books.map(book => (
            <li key={book.id}>
                <button
                onClick={() => toggleBook(book.id)}
                className="w-full flex justify-between items-center text-left p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                <span className="font-semibold">{book.name}</span>
                <ChevronRightIcon isRotated={openBook === book.id} />
                </button>
                {openBook === book.id && (
                <div className="p-2 mt-1 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase font-bold">{t('chapters')}</p>
                    <div className="grid grid-cols-5 gap-1 mb-4">
                        {Array.from({ length: book.chapterCount }, (_, i) => i + 1).map(chapter => (
                        <button
                            key={chapter}
                            onClick={() => handleChapterClick(book.id, chapter)}
                            className={`flex items-center justify-center h-9 w-9 rounded-md text-sm transition-colors ${
                            expandedChapter === chapter
                                ? 'bg-blue-600 text-white font-bold shadow-md'
                                : 'bg-white dark:bg-gray-600 hover:bg-blue-100 dark:hover:bg-blue-500/50'
                            }`}
                        >
                            {chapter}
                        </button>
                        ))}
                    </div>
                    
                    {expandedChapter && verseCount > 0 && (
                        <div className="border-t border-gray-200 dark:border-gray-600 pt-2 animate-fade-in">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase font-bold">{t('verses')}</p>
                            <div className="grid grid-cols-5 gap-1">
                                {Array.from({ length: verseCount }, (_, i) => i + 1).map(verse => (
                                    <button
                                        key={verse}
                                        onClick={() => onSelectVerse(book.id, expandedChapter, verse)}
                                        className={`flex items-center justify-center h-8 w-8 rounded-full text-xs transition-colors ${
                                            selectedChapter?.verse === verse && selectedChapter?.chapter === expandedChapter
                                                ? 'bg-green-600 text-white font-bold'
                                                : 'bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 hover:bg-green-100 dark:hover:bg-green-900'
                                        }`}
                                    >
                                        {verse}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                )}
            </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default BibleNav;
