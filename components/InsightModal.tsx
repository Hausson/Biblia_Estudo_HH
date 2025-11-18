
import React, { useEffect, useState } from 'react';
import { getVerseInsight } from '../services/geminiService';
import { Verse } from '../types';
import { XIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';

interface InsightModalProps {
  verse: Verse;
  bookName: string;
  chapterNumber: number;
  onClose: () => void;
}

const InsightModal: React.FC<InsightModalProps> = ({ verse, bookName, chapterNumber, onClose }) => {
  const [insight, setInsight] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { t, language } = useLanguage();

  useEffect(() => {
    const fetchInsight = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getVerseInsight(verse, bookName, chapterNumber, language);
        setInsight(result);
      } catch (err) {
        setError(t('failedToFetch'));
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsight();
  }, [verse, bookName, chapterNumber, language, t]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto relative"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
            <XIcon />
        </button>
        <h2 className="text-2xl font-bold mb-2 text-blue-600 dark:text-blue-400">{t('verseInsight')}</h2>
        <p className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
          {bookName} {chapterNumber}:{verse.verse}
        </p>
        <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic mb-6 text-gray-600 dark:text-gray-400">
          "{verse.text}"
        </blockquote>

        <div className="prose prose-sm dark:prose-invert max-w-none">
          {isLoading && <p>{t('loading')}</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!isLoading && !error && <div dangerouslySetInnerHTML={{ __html: insight.replace(/\n/g, '<br />') }} />}
        </div>
      </div>
    </div>
  );
};

export default InsightModal;
