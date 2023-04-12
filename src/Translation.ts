import fs from 'fs';
import path, { join } from 'path';
import Trans from './data/translations.json';

const getIds = () => {
  let ids: number[] = [];
  Trans['translations'].map((t) => ids.push(t['id']));
  console.log(ids);

  const dir = path.join(__dirname, 'files');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(path.join(dir, 'TransIds.json'), JSON.stringify(ids));
};

export default getIds();
