import fs from 'fs';
import path, { join } from 'path';
import axios from 'axios';
import { ApiData, Verse } from './Models/models';
import Translation from './data/Translation.json';
interface Trans {
  id: number;
  text: string;
}
interface QuranOnline {
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
  translations: Trans[];
}

const fetchLegacyTranslation = (chapter: number, id: string) => {
  let t: any = Translation;
  let data = t[chapter - 1][id]['ayah']['text'];
  return data;
};

const getModel = (v: Verse) => {
  let result: QuranOnline = {
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
    translations: v.translations.map<Trans>(
      (v) => <Trans>{ id: v.resource_id, text: v.text },
    ),
  };

  return result;
};

const fetchVersesFromFile = (index: number) => {
  const pathLocal = path.join(process.env.PWD!, `src/data/pages/${index}.json`);
  console.log(pathLocal);
  let verses: Verse[] = JSON.parse(fs.readFileSync(pathLocal, 'utf8'));
  return verses;
};

const main = async () => {
  const resultArr: QuranOnline[] = [];
  const dir = path.join(__dirname, 'files');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  for (let i = 1; i < 605; i++) {
    fetchVersesFromFile(i).map((v: Verse) => {
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
