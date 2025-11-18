
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
  namePt: string;
  chapters: Chapter[];
}
