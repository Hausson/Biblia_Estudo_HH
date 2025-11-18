
import { Language } from '../types';

export interface BookMeta {
    id: string;
    name: {
        en: string;
        pt: string;
    };
    chapters: number;
}

// Estrutura padrão dos 66 livros para navegação instantânea
export const BIBLE_STRUCTURE: BookMeta[] = [
    { id: "gen", name: { en: "Genesis", pt: "Gênesis" }, chapters: 50 },
    { id: "exod", name: { en: "Exodus", pt: "Êxodo" }, chapters: 40 },
    { id: "lev", name: { en: "Leviticus", pt: "Levítico" }, chapters: 27 },
    { id: "num", name: { en: "Numbers", pt: "Números" }, chapters: 36 },
    { id: "deut", name: { en: "Deuteronomy", pt: "Deuteronômio" }, chapters: 34 },
    { id: "josh", name: { en: "Joshua", pt: "Josué" }, chapters: 24 },
    { id: "judg", name: { en: "Judges", pt: "Juízes" }, chapters: 21 },
    { id: "ruth", name: { en: "Ruth", pt: "Rute" }, chapters: 4 },
    { id: "1sam", name: { en: "1 Samuel", pt: "1 Samuel" }, chapters: 31 },
    { id: "2sam", name: { en: "2 Samuel", pt: "2 Samuel" }, chapters: 24 },
    { id: "1kings", name: { en: "1 Kings", pt: "1 Reis" }, chapters: 22 },
    { id: "2kings", name: { en: "2 Kings", pt: "2 Reis" }, chapters: 25 },
    { id: "1chron", name: { en: "1 Chronicles", pt: "1 Crônicas" }, chapters: 29 },
    { id: "2chron", name: { en: "2 Chronicles", pt: "2 Crônicas" }, chapters: 36 },
    { id: "ezra", name: { en: "Ezra", pt: "Esdras" }, chapters: 10 },
    { id: "neh", name: { en: "Nehemiah", pt: "Neemias" }, chapters: 13 },
    { id: "esth", name: { en: "Esther", pt: "Ester" }, chapters: 10 },
    { id: "job", name: { en: "Job", pt: "Jó" }, chapters: 42 },
    { id: "ps", name: { en: "Psalms", pt: "Salmos" }, chapters: 150 },
    { id: "prov", name: { en: "Proverbs", pt: "Provérbios" }, chapters: 31 },
    { id: "eccl", name: { en: "Ecclesiastes", pt: "Eclesiastes" }, chapters: 12 },
    { id: "song", name: { en: "Song of Solomon", pt: "Cânticos" }, chapters: 8 },
    { id: "isa", name: { en: "Isaiah", pt: "Isaías" }, chapters: 66 },
    { id: "jer", name: { en: "Jeremiah", pt: "Jeremias" }, chapters: 52 },
    { id: "lam", name: { en: "Lamentations", pt: "Lamentações" }, chapters: 5 },
    { id: "ezek", name: { en: "Ezekiel", pt: "Ezequiel" }, chapters: 48 },
    { id: "dan", name: { en: "Daniel", pt: "Daniel" }, chapters: 12 },
    { id: "hos", name: { en: "Hosea", pt: "Oseias" }, chapters: 14 },
    { id: "joel", name: { en: "Joel", pt: "Joel" }, chapters: 3 },
    { id: "amos", name: { en: "Amos", pt: "Amós" }, chapters: 9 },
    { id: "obad", name: { en: "Obadiah", pt: "Obadias" }, chapters: 1 },
    { id: "jonah", name: { en: "Jonah", pt: "Jonas" }, chapters: 4 },
    { id: "mic", name: { en: "Micah", pt: "Miqueias" }, chapters: 7 },
    { id: "nah", name: { en: "Nahum", pt: "Naum" }, chapters: 3 },
    { id: "hab", name: { en: "Habakkuk", pt: "Habacuque" }, chapters: 3 },
    { id: "zeph", name: { en: "Zephaniah", pt: "Sofonias" }, chapters: 3 },
    { id: "hag", name: { en: "Haggai", pt: "Ageu" }, chapters: 2 },
    { id: "zech", name: { en: "Zechariah", pt: "Zacarias" }, chapters: 14 },
    { id: "mal", name: { en: "Malachi", pt: "Malaquias" }, chapters: 4 },
    { id: "matt", name: { en: "Matthew", pt: "Mateus" }, chapters: 28 },
    { id: "mark", name: { en: "Mark", pt: "Marcos" }, chapters: 16 },
    { id: "luke", name: { en: "Luke", pt: "Lucas" }, chapters: 24 },
    { id: "john", name: { en: "John", pt: "João" }, chapters: 21 },
    { id: "acts", name: { en: "Acts", pt: "Atos" }, chapters: 28 },
    { id: "rom", name: { en: "Romans", pt: "Romanos" }, chapters: 16 },
    { id: "1cor", name: { en: "1 Corinthians", pt: "1 Coríntios" }, chapters: 16 },
    { id: "2cor", name: { en: "2 Corinthians", pt: "2 Coríntios" }, chapters: 13 },
    { id: "gal", name: { en: "Galatians", pt: "Gálatas" }, chapters: 6 },
    { id: "eph", name: { en: "Ephesians", pt: "Efésios" }, chapters: 6 },
    { id: "phil", name: { en: "Philippians", pt: "Filipenses" }, chapters: 4 },
    { id: "col", name: { en: "Colossians", pt: "Colossenses" }, chapters: 4 },
    { id: "1thess", name: { en: "1 Thessalonians", pt: "1 Tessalonicenses" }, chapters: 5 },
    { id: "2thess", name: { en: "2 Thessalonians", pt: "2 Tessalonicenses" }, chapters: 3 },
    { id: "1tim", name: { en: "1 Timothy", pt: "1 Timóteo" }, chapters: 6 },
    { id: "2tim", name: { en: "2 Timothy", pt: "2 Timóteo" }, chapters: 4 },
    { id: "titus", name: { en: "Titus", pt: "Tito" }, chapters: 3 },
    { id: "phlm", name: { en: "Philemon", pt: "Filemom" }, chapters: 1 },
    { id: "heb", name: { en: "Hebrews", pt: "Hebreus" }, chapters: 13 },
    { id: "jas", name: { en: "James", pt: "Tiago" }, chapters: 5 },
    { id: "1pet", name: { en: "1 Peter", pt: "1 Pedro" }, chapters: 5 },
    { id: "2pet", name: { en: "2 Peter", pt: "2 Pedro" }, chapters: 3 },
    { id: "1john", name: { en: "1 John", pt: "1 João" }, chapters: 5 },
    { id: "2john", name: { en: "2 John", pt: "2 João" }, chapters: 1 },
    { id: "3john", name: { en: "3 John", pt: "3 João" }, chapters: 1 },
    { id: "jude", name: { en: "Jude", pt: "Judas" }, chapters: 1 },
    { id: "rev", name: { en: "Revelation", pt: "Apocalipse" }, chapters: 22 }
];

export const getBookName = (bookId: string, lang: Language): string => {
    const book = BIBLE_STRUCTURE.find(b => b.id === bookId);
    return book ? book.name[lang] : bookId;
};
