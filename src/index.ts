import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { Verse } from './Models/models';
import Translation from './data/Translation.json';

interface Quran {
  id: number;
  verse: number;
  chapter: number;
  key: string;
  hizb: number;
  rub: number;
  ruku: number;
  manzil: number;
  sajdah: number | null;
  page: number;
  juz: number;
  text: string;
  translation: {
    text: string;
    iso_code: string;
  };
}

const fetchLegacyTranslation = (chapter: number, id: string) => {
  let t: any = Translation;
  let data = t[chapter - 1][id]['ayah']['text'];
  return data;
};

const getModel = (v: Verse) => {
  let result: Quran = {
    id: v.id,
    key: v.verse_key,
    verse: v.verse_number,
    chapter: parseInt(v.verse_key.split(':')[0]),
    hizb: v.hizb_number,
    rub: v.rub_el_hizb_number,
    ruku: v.ruku_number,
    manzil: v.manzil_number,
    sajdah: v.sajdah_number,
    page: v.page_number,
    juz: v.juz_number,
    text: v.words.map((w) => w.text).join(''),
    translation: {
      iso_code: 'fa',
      text: fetchLegacyTranslation(
        parseInt(v.verse_key.split(':')[0]),
        v.id.toString(),
      ),
    },
  };

  return result;
};

const fetchSurah = async (index: number) => {
  const response = await axios.get(
    `https://api.quran.com/api/v4/verses/by_chapter/${index}?language=en&words=true&page=1&per_page=9999`,
  );
  return await response.data['verses'];
};
// const genFile = async (index: number, dir: string) => {
//   fs.writeFileSync(path.join(dir, `${index}.json`), await fetchSurah(index));
// };

const main = async () => {
  const resultArr: Quran[] = [];
  const dir = path.join(__dirname, 'files');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  for (let i = 113; i < 115; i++) {
    // await genFile(i, dir);
    (await fetchSurah(i)).map((v: Verse) => {
      resultArr.push(getModel(v));
    });
  }
  fs.writeFileSync(path.join(dir, 'All.json'), JSON.stringify(resultArr));
  return true;
};

(async () => {
  const result = await main();
  console.log(result);
})().catch((e) => {
  console.log(e);
});
