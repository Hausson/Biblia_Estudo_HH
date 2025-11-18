
import React, { useState, useEffect, useMemo } from 'react';
import { getBooks, getVerseCount } from '../services/bibleService';
import { ChevronRightIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';
import { useBible } from '../contexts/BibleContext';

interface BibleNavProps {
  onSelectChapter: (bookId: string, chapter: number) => void;
  onSelectVerse: (bookId: string, chapter: number, verse: number) => void;
  selectedChapter: { bookId: string; chapter: number; verse?: number } | null;
}

const BibleNav: React.FC<BibleNavProps> = ({ onSelectChapter, onSelectVerse, selectedChapter }) => {
  const { currentVersionId } = useBible();
  const { t } = useLanguage();
  
  const books = useMemo(() => getBooks(currentVersionId), [currentVersionId]);

  const [openBook, setOpenBook] = useState<string | null>(selectedChapter?.bookId || books[0]?.id || null);
  const [expandedChapter, setExpandedChapter] = useState<number | null>(selectedChapter?.chapter || null);

  useEffect(() => {
    if (selectedChapter) {
        setOpenBook(selectedChapter.bookId);
        setExpandedChapter(selectedChapter.chapter);
    }
  }, [selectedChapter?.bookId, selectedChapter?.chapter]);

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
    <div className="w-full h-full bg-white dark:bg-gray-800 p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{t('bible')}</h2>
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
                
                {expandedChapter && (
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-2 animate-fade-in">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase font-bold">{t('verses')}</p>
                        <div className="grid grid-cols-5 gap-1">
                            {Array.from({ length: getVerseCount(currentVersionId, book.id, expandedChapter) }, (_, i) => i + 1).map(verse => (
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
  );
};

export default BibleNav;
