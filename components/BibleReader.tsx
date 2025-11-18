
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getChapter } from '../services/bibleService';
import { Verse, Chapter, StudyNode } from '../types';
import InsightModal from './InsightModal';
import { SparklesIcon, BookOpenIcon, FileIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';

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
  const [chapterData, setChapterData] = useState<(Chapter & { bookName: string, bookNamePt: string }) | null>(null);
  const [verseForInsight, setVerseForInsight] = useState<Verse | null>(null);
  const [editableContent, setEditableContent] = useState<string>('');
  const { t, language } = useLanguage();
  
  // Refs for scrolling
  const verseRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (selectedChapter) {
      const data = getChapter(selectedChapter.bookId, selectedChapter.chapter);
      setChapterData(data);
    }
  }, [selectedChapter?.bookId, selectedChapter?.chapter]); // Only re-fetch if book or chapter changes
  
  // Scroll to verse when selectedChapter.verse changes
  useEffect(() => {
      if (selectedChapter?.verse && verseRefs.current[selectedChapter.verse]) {
          verseRefs.current[selectedChapter.verse]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
  }, [selectedChapter?.verse, chapterData]); // Run when verse changes or data loads

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

  if (!chapterData) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50">
        <BookOpenIcon />
        <p className="mt-4 text-lg">{t('selectChapter')}</p>
      </div>
    );
  }

  const displayBookName = language === 'pt' ? chapterData.bookNamePt : chapterData.bookName;

  return (
    <div className="p-6 md:p-8 h-full overflow-y-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">{displayBookName}</h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-600 dark:text-gray-400 mb-8">{t('chapters')} {chapterData.chapter}</h2>
      <div className="space-y-4">
        {chapterData.verses.map(verse => {
            const isSelected = selectedChapter?.verse === verse.verse;
            return (
                <div 
                    key={verse.verse} 
                    ref={el => { verseRefs.current[verse.verse] = el }}
                    className={`flex group items-start gap-4 p-2 rounded-lg transition-all duration-500 ${isSelected ? 'bg-yellow-100 dark:bg-yellow-900/30 ring-2 ring-yellow-400 dark:ring-yellow-600' : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'}`}
                >
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
            );
        })}
      </div>
      {verseForInsight && chapterData && (
        <InsightModal
          verse={verseForInsight}
          bookName={displayBookName}
          chapterNumber={chapterData.chapter}
          onClose={() => setVerseForInsight(null)}
        />
      )}
    </div>
  );
};

export default BibleReader;
