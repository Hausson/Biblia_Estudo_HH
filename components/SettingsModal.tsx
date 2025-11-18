
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useBible } from '../contexts/BibleContext';
import { AVAILABLE_VERSIONS } from '../services/bibleService';
import { XIcon } from './Icons';

interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { language, setLanguage, t } = useLanguage();
  const { currentVersionId, setVersion } = useBible();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('settings')}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <XIcon />
          </button>
        </div>

        {/* Version Selector */}
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bible Version
            </label>
            <div className="flex flex-col gap-2">
                {AVAILABLE_VERSIONS.map(v => (
                    <button 
                        key={v.id}
                        onClick={() => setVersion(v.id)}
                        className={`p-3 rounded-md border text-left transition-colors ${currentVersionId === v.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'}`}
                    >
                        {v.name}
                    </button>
                ))}
            </div>
        </div>

        {/* Language Selector */}
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('language')}
            </label>
            <div className="flex flex-col gap-2">
                <button 
                    onClick={() => setLanguage('pt')}
                    className={`p-3 rounded-md border text-left ${language === 'pt' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'}`}
                >
                    🇧🇷 Português
                </button>
                <button 
                    onClick={() => setLanguage('en')}
                    className={`p-3 rounded-md border text-left ${language === 'en' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'}`}
                >
                    🇺🇸 English
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
