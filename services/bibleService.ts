
import { BibleVersion, Chapter, Language } from '../types';
import { BIBLE_STRUCTURE, getBookName } from './bibleStructure';
import { pt_aa } from './versions/pt_aa';
import { en_kjv } from './versions/en_kjv';

// Define where the JSON files are located. 
// Ensure you have valid JSON files in your public folder, e.g., /bibles/pt_aa.json
const BIBLE_PATH_PREFIX = '/bibles'; 

export interface AvailableVersion {
    id: string;
    name: string;
    file: string; // Filename in public/bibles/
    language: Language;
}

// Registro de versões disponíveis (Metadata)
export const AVAILABLE_VERSIONS: AvailableVersion[] = [
    { id: 'pt_aa', name: 'Almeida Atualizada (PT)', file: 'pt_aa.json', language: 'pt' },
    { id: 'en_kjv', name: 'King James Version (EN)', file: 'en_kjv.json', language: 'en' },
    // Add more versions here matching your JSON files
];

// Fallback data map
const STATIC_VERSIONS: { [key: string]: BibleVersion } = {
    'pt_aa': pt_aa,
    'en_kjv': en_kjv
};

// Cache in-memory to prevent constant re-fetching
const versionCache: { [key: string]: any } = {};

export const getBibleVersionMeta = (versionId: string): AvailableVersion => {
    return AVAILABLE_VERSIONS.find(v => v.id === versionId) || AVAILABLE_VERSIONS[0];
};

// Get list of books (using static structure for performance)
export const getBooksStructure = (language: Language) => {
  return BIBLE_STRUCTURE.map(book => ({
    id: book.id,
    name: book.name[language],
    chapterCount: book.chapters,
  }));
};

// Async function to fetch specific chapter data
export const fetchChapter = async (versionId: string, bookId: string, chapterNumber: number): Promise<(Chapter & { bookName: string }) | null> => {
    const versionMeta = getBibleVersionMeta(versionId);
    
    // Check cache first
    if (!versionCache[versionId]) {
        try {
            // Try to fetch the JSON file
            const response = await fetch(`${BIBLE_PATH_PREFIX}/${versionMeta.file}`);
            
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            
            const data = await response.json();
            versionCache[versionId] = data;
        } catch (error) {
            console.warn(`Could not load remote JSON for ${versionId} (${error}). Falling back to static data.`);
            
            // Fallback mechanism: Use imported TS files if JSON fetch fails
            if (STATIC_VERSIONS[versionId]) {
                versionCache[versionId] = STATIC_VERSIONS[versionId].books;
            } else {
                console.error(`No static fallback data available for ${versionId}`);
                return null;
            }
        }
    }

    const bibleData = versionCache[versionId];
    if (!bibleData) return null;

    // --- DETECT FORMAT AND PARSE ---

    // 1. Check for User's specific JSON format: Array of objects with 'abbrev', 'chapters' as string[][]
    // Example: [{"abbrev":"Gn", "chapters":[["In the beginning..."], ...]}, ...]
    if (Array.isArray(bibleData) && bibleData.length > 0 && 'abbrev' in bibleData[0] && Array.isArray(bibleData[0].chapters)) {
        // Map internal bookId (e.g., 'gen') to index in the JSON array based on standard order
        const bookIndex = BIBLE_STRUCTURE.findIndex(b => b.id === bookId);
        
        if (bookIndex === -1 || bookIndex >= bibleData.length) {
            console.error(`Book ${bookId} not found in JSON at index ${bookIndex}`);
            return null;
        }

        const bookRaw = bibleData[bookIndex];
        
        // Safety check if raw chapters exist
        if (!bookRaw.chapters || !Array.isArray(bookRaw.chapters)) return null;

        // JSON chapters are 0-indexed array of arrays. chapterNumber is 1-based.
        if (chapterNumber <= 0 || chapterNumber > bookRaw.chapters.length) return null;

        const versesRaw = bookRaw.chapters[chapterNumber - 1]; // This is an array of strings ["Verse 1 text", "Verse 2 text"]

        if (!Array.isArray(versesRaw)) return null;

        const verses = versesRaw.map((text: string, index: number) => ({
            verse: index + 1,
            text: text
        }));

        return {
            chapter: chapterNumber,
            verses: verses,
            bookName: bookRaw.name || getBookName(bookId, versionMeta.language)
        };
    }

    // 2. Default/Internal Format: Array of BibleBook objects with 'id' and 'chapters' as objects
    // Example: [{ id: "gen", chapters: [{ chapter: 1, verses: [...] }] }]
    if (Array.isArray(bibleData)) {
        const book = bibleData.find((b: any) => b.id === bookId);
        if (!book) return null;
        
        const chapter = book.chapters.find((c: any) => c.chapter === chapterNumber);
        const bookName = book.name || getBookName(bookId, versionMeta.language);
    
        return chapter ? { bookName: bookName, ...chapter } : null;
    }
    
    // 3. Object Format: { books: [...] }
    if (bibleData.books && Array.isArray(bibleData.books)) {
         const book = bibleData.books.find((b: any) => b.id === bookId);
         if (!book) return null;
         
         const chapter = book.chapters.find((c: any) => c.chapter === chapterNumber);
         const bookName = book.name || getBookName(bookId, versionMeta.language);
         
         return chapter ? { bookName: bookName, ...chapter } : null;
    }

    return null;
};

export const getVerseCount = (bookId: string, chapterNumber: number): number => {
    return 0; 
};
