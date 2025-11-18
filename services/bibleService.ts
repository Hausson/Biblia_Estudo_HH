
import { BibleVersion, BibleBook } from '../types';
import { en_kjv } from './versions/en_kjv';
import { pt_aa } from './versions/pt_aa';

// Registro de versões disponíveis
export const AVAILABLE_VERSIONS: BibleVersion[] = [
    pt_aa,
    en_kjv
];

// Função auxiliar para pegar a versão ativa
export const getBibleVersion = (versionId: string): BibleVersion => {
    return AVAILABLE_VERSIONS.find(v => v.id === versionId) || AVAILABLE_VERSIONS[0];
};

export const getBooks = (versionId: string): { id: string, name: string, chapterCount: number }[] => {
  const version = getBibleVersion(versionId);
  return version.books.map(book => ({
    id: book.id,
    name: book.name,
    chapterCount: book.chapters.length,
  }));
};

export const getChapter = (versionId: string, bookId: string, chapterNumber: number) => {
  const version = getBibleVersion(versionId);
  const book = version.books.find(b => b.id === bookId);
  if (!book) return null;
  
  const chapter = book.chapters.find(c => c.chapter === chapterNumber);
  return chapter ? { bookName: book.name, ...chapter } : null;
};

export const getVerseCount = (versionId: string, bookId: string, chapterNumber: number): number => {
    const version = getBibleVersion(versionId);
    const book = version.books.find(b => b.id === bookId);
    if (!book) return 0;
    const chapter = book.chapters.find(c => c.chapter === chapterNumber);
    return chapter ? chapter.verses.length : 0;
};
