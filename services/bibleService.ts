
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
const versionCache: { [key: string]: any[] } = {};

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
            
            let data = await response.json();
            
            // Normalize data: handle if it's an array of books OR a BibleVersion object
            if (!Array.isArray(data) && data.books) {
                data = data.books;
            } else if (!Array.isArray(data)) {
                // If it's an object but not in expected format, try to use it if it looks like a book array
                // or throw to trigger fallback
                 throw new Error('Invalid JSON format');
            }

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

    // Assuming the JSON structure matches the internal BibleBook type
    const book = bibleData.find((b: any) => b.id === bookId);
    
    if (!book) return null;
    
    const chapter = book.chapters.find((c: any) => c.chapter === chapterNumber);
    
    // Fallback for bookname if not in JSON, use structure
    const bookName = book.name || getBookName(bookId, versionMeta.language);

    return chapter ? { bookName: bookName, ...chapter } : null;
};

export const getVerseCount = (bookId: string, chapterNumber: number): number => {
    return 0; 
};
