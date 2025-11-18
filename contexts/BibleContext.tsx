
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AVAILABLE_VERSIONS } from '../services/bibleService';

interface BibleContextType {
  currentVersionId: string;
  setVersion: (id: string) => void;
}

const BibleContext = createContext<BibleContextType | undefined>(undefined);

export const BibleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentVersionId, setCurrentVersionId] = useState<string>(AVAILABLE_VERSIONS[0].id);

  useEffect(() => {
    const savedVersion = localStorage.getItem('bible_version');
    if (savedVersion && AVAILABLE_VERSIONS.some(v => v.id === savedVersion)) {
        setCurrentVersionId(savedVersion);
    }
  }, []);

  const setVersion = (id: string) => {
    if (AVAILABLE_VERSIONS.some(v => v.id === id)) {
        setCurrentVersionId(id);
        localStorage.setItem('bible_version', id);
    }
  };

  return (
    <BibleContext.Provider value={{ currentVersionId, setVersion }}>
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
