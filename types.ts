
export type Language = 'en' | 'pt';

export type StudyFolder = {
  id: string;
  type: 'folder';
  name: string;
  children: StudyNode[];
};

export type StudyReference = {
  id: string;
  type: 'reference';
  name: string;
  content?: string;
};

export type StudyNode = StudyFolder | StudyReference;

export interface Verse {
  verse: number;
  text: string;
}

export interface Chapter {
  chapter: number;
  verses: Verse[];
}

export interface BibleBook {
  id: string;
  name: string;
  chapters: Chapter[];
}

export interface BibleVersion {
  id: string;
  name: string;
  language: Language;
  books: BibleBook[];
}

// Commentary Types
export interface CommentaryVerse {
    verse: number;
    text: string;
}

export interface CommentaryChapter {
    chapter: number;
    verses: CommentaryVerse[];
}

export interface CommentaryBook {
    id: string;
    chapters: CommentaryChapter[];
}

export interface Commentary {
    id: string;
    name: string;
    language: Language;
    books: CommentaryBook[];
}
