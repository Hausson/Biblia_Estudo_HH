
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
            { verse: 1, text: "No principio criou Deus o ceu e a terra." },
            { verse: 2, text: "E a terra era sem forma e vazia; e havia trevas sobre a face do abismo. E o Espirito de Deus se movia sobre a face das aguas." },
            { verse: 3, text: "E disse Deus: Haja luz; e houve luz." },
            { verse: 4, text: "E viu Deus a luz, que isto era bom; e Deus separou a luz das trevas." },
            { verse: 5, text: "E chamou Deus a luz Dia, e as trevas ele chamou Noite. E houve a tarde e a manha, o primeiro dia."}
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
