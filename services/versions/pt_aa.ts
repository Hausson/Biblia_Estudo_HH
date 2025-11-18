
import { BibleVersion } from '../../types';

export const pt_aa: BibleVersion = {
  id: 'pt_aa',
  name: 'Almeida Atualizada (ARA)',
  language: 'pt',
  books: [
    {
      id: "gen",
      name: "Gênesis",
      chapters: [
        {
          chapter: 1,
          verses: [
            { verse: 1, text: "No princípio criou Deus os céus e a terra." },
            { verse: 2, text: "A terra, porém, estava sem forma e vazia; havia trevas sobre a face do abismo, e o Espírito de Deus pairava sobre as águas." },
            { verse: 3, text: "Disse Deus: Haja luz; e houve luz." }
          ]
        },
        {
            chapter: 2,
            verses: [
              { verse: 1, text: "Assim os céus e a terra foram acabados, e todo o seu exército." }
            ]
        }
      ]
    },
    {
      id: "exod",
      name: "Êxodo",
      chapters: [
        {
          chapter: 1,
          verses: [
            { verse: 1, text: "Estes pois são os nomes dos filhos de Israel, que entraram no Egito com Jacó; cada um entrou com sua casa:" }
          ]
        }
      ]
    }
  ]
};
