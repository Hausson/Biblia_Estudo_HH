
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { fetchChapter } from '../services/bibleService';
import { getCommentaryForChapter } from '../services/commentaryService';
import { Verse, Chapter, StudyNode } from '../types';
import InsightModal from './InsightModal';
import { SparklesIcon, BookOpenIcon, FileIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';
import { useBible } from '../contexts/BibleContext';

interface BibleReaderProps {
  selectedChapter: { bookId: string, chapter: number, verse?: number } | null;
  selectedStudyNode: StudyNode | null;
  setStudyData: React.Dispatch<React.SetStateAction<StudyNode[]>>;
}

// Helper to update a node immutably in the tree
const updateNodeContent = (nodes: StudyNode[], nodeId: string, newContent: string): StudyNode[] => {
    if (!Array.isArray(nodes)) return [];
    return nodes.map(node => {
        if (!node) return node;
        if (node.id === nodeId) {
            if (node.type === 'reference') {
                return { ...node, content: newContent };
            }
            return node;
        }
        if (node.type === 'folder') {
            return { ...node, children: updateNodeContent(node.children || [], nodeId, newContent) };
        }
        return node;
    });
};

const BibleReader: React.FC<BibleReaderProps> = ({ selectedChapter, selectedStudyNode, setStudyData }) => {
  const [chapterData, setChapterData] = useState<(Chapter & { bookName: string }) | null>(null);
  const [commentaryData, setCommentaryData] = useState<{ [verse: number]: string }>({});
  const [verseForInsight, setVerseForInsight] = useState<Verse | null>(null);
  const [editableContent, setEditableContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const { t } = useLanguage();
  const { currentVersionId, currentCommentaryId } = useBible();
  
  // Refs for scrolling
  const verseRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // Load Bible Text (Async)
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
        if (selectedChapter) {
            setIsLoading(true);
            setError(null);
            try {
                const data = await fetchChapter(currentVersionId, selectedChapter.bookId, selectedChapter.chapter);
                if (isMounted) {
                    if (data) {
                        setChapterData(data);
                    } else {
                        setError("Chapter not found or data file missing in /public/bibles/");
                    }
                }
            } catch (err) {
                if (isMounted) setError("Failed to load chapter.");
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }
    };

    loadData();
    
    return () => { isMounted = false; };
  }, [selectedChapter?.bookId, selectedChapter?.chapter, currentVersionId]); 

  // Load Commentary Text
  useEffect(() => {
      if (selectedChapter) {
          // If commentaries also move to JSON later, make this async too
          const data = getCommentaryForChapter(currentCommentaryId, selectedChapter.bookId, selectedChapter.chapter);
          setCommentaryData(data);
      } else {
          setCommentaryData({});
      }
  }, [selectedChapter?.bookId, selectedChapter?.chapter, currentCommentaryId]);
  
  // Scroll to verse when selectedChapter.verse changes
  useEffect(() => {
      if (selectedChapter?.verse && verseRefs.current[selectedChapter.verse] && !isLoading) {
          verseRefs.current[selectedChapter.verse]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
  }, [selectedChapter?.verse, chapterData, isLoading]); 

  useEffect(() => {
    if (selectedStudyNode && selectedStudyNode.type === 'reference') {
        setEditableContent(selectedStudyNode.content || '');
    } else if (!selectedStudyNode) {
        setEditableContent('');
    }
  }, [selectedStudyNode]);

  const handleSaveStudyNote = () => {
      if (selectedStudyNode) {
          setStudyData(prevData => updateNodeContent(prevData, selectedStudyNode.id, editableContent));
          alert(t('noteSaved'));
      }
  };
  
  const handleGetInsight = useCallback((verse: Verse) => {
    setVerseForInsight(verse);
  }, []);

  if (selectedStudyNode && selectedStudyNode.type === 'reference') {
      return (
        <div className="p-6 md:p-8 h-full overflow-y-auto bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center gap-2 mb-4">
                <FileIcon />
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">{selectedStudyNode.name}</h1>
            </div>
            <textarea
                value={editableContent}
                onChange={(e) => setEditableContent(e.target.value)}
                className="w-full h-3/4 p-4 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder={t('writeNotePlaceholder')}
            />
            <div className="mt-4 flex justify-end">
                <button 
                    onClick={handleSaveStudyNote}
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
                >
                    {t('saveNote')}
                </button>
            </div>
        </div>
      );
  }

  if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p>{t('loading')}</p>
        </div>
      );
  }

  if (error) {
      return (
          <div className="flex flex-col items-center justify-center h-full text-center text-red-500 p-4">
            <p className="text-lg font-bold mb-2">Error</p>
            <p>{error}</p>
            <p className="text-sm text-gray-500 mt-4">Make sure the file exists in: public/bibles/</p>
          </div>
      );
  }

  if (!chapterData) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50">
        <BookOpenIcon />
        <p className="mt-4 text-lg">{t('selectChapter')}</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 h-full overflow-y-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">{chapterData.bookName}</h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-600 dark:text-gray-400 mb-8">{t('chapters')} {chapterData.chapter}</h2>
      <div className="space-y-4">
        {chapterData.verses.map(verse => {
            const isSelected = selectedChapter?.verse === verse.verse;
            const commentary = commentaryData[verse.verse];

            return (
                <div 
                    key={verse.verse} 
                    ref={el => { verseRefs.current[verse.verse] = el }}
                    className={`flex flex-col gap-2 p-2 rounded-lg transition-all duration-500 ${isSelected ? 'bg-yellow-100 dark:bg-yellow-900/30 ring-2 ring-yellow-400 dark:ring-yellow-600' : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'}`}
                >
                    <div className="flex group items-start gap-4">
                        <sup className={`w-8 text-right font-bold mt-1 ${isSelected ? 'text-yellow-700 dark:text-yellow-500' : 'text-gray-500 dark:text-gray-400'}`}>{verse.verse}</sup>
                        <p className={`flex-1 text-base md:text-lg leading-relaxed ${isSelected ? 'text-gray-900 dark:text-gray-100 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
                        {verse.text}
                        </p>
                        <button
                        onClick={() => handleGetInsight(verse)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800"
                        title="Get AI Insight"
                        >
                        <SparklesIcon />
                        </button>
                    </div>
                    
                    {commentary && (
                         <div className="ml-12 p-3 rounded bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-600 text-sm text-gray-700 dark:text-gray-300 italic">
                            <span className="font-bold text-blue-600 dark:text-blue-400 text-xs uppercase block mb-1">{t('commentary')}</span>
                            {commentary}
                         </div>
                    )}
                </div>
            );
        })}
      </div>
      {verseForInsight && chapterData && (
        <InsightModal
          verse={verseForInsight}
          bookName={chapterData.bookName}
          chapterNumber={chapterData.chapter}
          onClose={() => setVerseForInsight(null)}
        />
      )}
    </div>
  );
};

export default BibleReader;
