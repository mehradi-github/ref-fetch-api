import fs from "fs";
import path from "path";
import axios from "axios";

const fetchSurah = async (index: number) => {
  const response = await axios.get(
    `https://api.quran.com/api/v4/verses/by_chapter/${index}?language=en&words=true&page=1&per_page=9999`
  );
  return JSON.stringify(response.data);
};
const genFile = async (index: number, dir: string) => {
  fs.writeFileSync(path.join(dir, `${index}.json`), await fetchSurah(index));
};

const main = async () => {
  const dir = path.join(__dirname, "files");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  for (let i = 1; i < 115; i++) {
    await genFile(i, dir);
  }
  return true;
};

(async () => {
  const result = await main();
  console.log(result);
})().catch((e) => {
  console.log(e);
});
