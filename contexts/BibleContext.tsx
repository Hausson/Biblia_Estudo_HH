
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AVAILABLE_VERSIONS } from '../services/bibleService';

interface BibleContextType {
  currentVersionId: string;
  setVersion: (id: string) => void;
  currentCommentaryId: string | null;
  setCommentary: (id: string | null) => void;
}

const BibleContext = createContext<BibleContextType | undefined>(undefined);

export const BibleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentVersionId, setCurrentVersionId] = useState<string>(AVAILABLE_VERSIONS[0].id);
  const [currentCommentaryId, setCurrentCommentaryId] = useState<string | null>(null);

  useEffect(() => {
    const savedVersion = localStorage.getItem('bible_version');
    if (savedVersion && AVAILABLE_VERSIONS.some(v => v.id === savedVersion)) {
        setCurrentVersionId(savedVersion);
    }
    
    const savedCommentary = localStorage.getItem('bible_commentary');
    if (savedCommentary) {
        setCurrentCommentaryId(savedCommentary);
    }
  }, []);

  const setVersion = (id: string) => {
    if (AVAILABLE_VERSIONS.some(v => v.id === id)) {
        setCurrentVersionId(id);
        localStorage.setItem('bible_version', id);
    }
  };

  const setCommentary = (id: string | null) => {
      setCurrentCommentaryId(id);
      if (id) {
        localStorage.setItem('bible_commentary', id);
      } else {
        localStorage.removeItem('bible_commentary');
      }
  };

  return (
    <BibleContext.Provider value={{ currentVersionId, setVersion, currentCommentaryId, setCommentary }}>
      {children}
    </BibleContext.Provider>
  );
};

export const useBible = () => {
  const context = useContext(BibleContext);
  if (!context) {
    throw new Error('useBible must be used within a BibleProvider');
  }
  return context;
};
