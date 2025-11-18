
import { Commentary } from '../types';
import { pt_tske } from './commentaries/pt_tske';
import { en_mh } from './commentaries/en_mh';

// Registro de comentários disponíveis
export const AVAILABLE_COMMENTARIES: Commentary[] = [
    pt_tske,
    en_mh
];

export const getCommentary = (commentaryId: string): Commentary | null => {
    return AVAILABLE_COMMENTARIES.find(c => c.id === commentaryId) || null;
};

export const getCommentaryForChapter = (commentaryId: string | null, bookId: string, chapterNumber: number): { [verse: number]: string } => {
    if (!commentaryId) return {};
    
    const commentary = getCommentary(commentaryId);
    if (!commentary) return {};

    const book = commentary.books.find(b => b.id === bookId);
    if (!book) return {};

    const chapter = book.chapters.find(c => c.chapter === chapterNumber);
    if (!chapter) return {};

    // Converte array de versos em um mapa (Objeto) para acesso rápido O(1)
    const verseMap: { [verse: number]: string } = {};
    chapter.verses.forEach(v => {
        verseMap[v.verse] = v.text;
    });

    return verseMap;
};
