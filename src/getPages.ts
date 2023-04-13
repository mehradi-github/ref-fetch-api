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

const fetchSurah = async (index: number) => {
  const response = await axios.get(
    `https://api.quran.com/api/v4/verses/by_page/${index}?language=en&words=true&translations=131%2C149%2C167%2C20%2C203%2C234%2C83%2C80%2C171%2C75%2C76%2C85%2C86%2C84%2C81%2C78%2C79%2C17%2C95%2C57%2C19%2C22%2C206%2C207%2C54%2C156%2C151%2C158%2C97%2C136%2C135%2C139%2C35%2C134%2C153%2C161%2C163%2C162%2C210%2C211%2C217%2C229%2C55%2C143%2C141%2C140%2C214%2C227%2C226%2C233%2C225%2C224%2C232%2C235%2C231%2C230%2C223%2C222%2C220%2C144%2C88%2C87%2C50%2C49%2C48%2C128%2C45%2C77%2C39%2C36%2C30%2C26%2C103%2C74%2C23%2C101%2C53%2C47%2C44%2C42%2C41%2C236%2C106%2C238%2C237%2C125%2C124%2C46%2C113%2C112%2C38%2C89%2C56%2C32%2C108%2C37%2C43%2C28%2C51%2C111%2C115%2C31%2C29%2C208%2C209%2C133%2C25%2C221%2C219%2C52%2C213%2C199%2C218%2C228%2C126%2C122%2C120%2C127%2C118%2C109%2C27%2C33%2C819%2C177%2C178%2C175%2C180%2C174%2C173%2C172%2C181%2C183%2C179%2C182%2C774%2C776%2C798%2C792%2C796%2C791%2C782%2C790%2C779%2C795%2C785%2C771%2C823%2C176&page=1&per_page=9999`,
  );
  return await response.data['verses'];
};

const main = async () => {
  const resultArr: QuranOnline[] = [];
  const dir = path.join(__dirname, 'files');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  let verses;
  for (let i = 1; i < 605; i++) {
    // await genFile(i, dir);
    verses = await fetchSurah(i);
    fs.writeFileSync(path.join(dir, `${i}.json`), JSON.stringify(verses));
    //   verses.map((v: Verse) => {
    //     resultArr.push(getModel(v));
    //   });
  }
  // fs.writeFileSync(path.join(dir, 'All.json'), JSON.stringify(resultArr));
  return true;
};

(async () => {
  const result = await main();
  console.log(result);
})().catch((e) => {
  console.log(e);
});
