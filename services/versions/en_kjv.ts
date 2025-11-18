
import { BibleVersion } from '../../types';

export const en_kjv: BibleVersion = {
  id: 'en_kjv',
  name: 'King James Version (KJV)',
  language: 'en',
  books: [
    {
      id: "gen",
      name: "Genesis",
      chapters: [
        {
          chapter: 1,
          verses: [
            { verse: 1, text: "In the beginning God created the heavens and the earth." },
            { verse: 2, text: "Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters." },
            { verse: 3, text: "And God said, “Let there be light,” and there was light." }
          ]
        },
        {
            chapter: 2,
            verses: [
              { verse: 1, text: "Thus the heavens and the earth were completed in all their vast array." }
            ]
        }
      ]
    },
    {
      id: "exod",
      name: "Exodus",
      chapters: [
        {
          chapter: 1,
          verses: [
            { verse: 1, text: "These are the names of the sons of Israel who went to Egypt with Jacob, each with his family:" }
          ]
        }
      ]
    }
  ]
};
