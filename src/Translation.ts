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
//131,149,167,20,203,234,83,80,171,75,76,85,86,84,81,78,79,17,95,57,19,22,206,207,54,156,151,158,97,136,135,139,35,134,153,161,163,162,210,211,217,229,55,143,141,140,214,227,226,233,225,224,232,235,231,230,223,222,220,144,88,87,50,49,48,128,45,77,39,36,30,26,103,74,23,101,53,47,44,42,41,236,106,238,237,125,124,46,113,112,38,89,56,32,108,37,43,28,51,111,115,31,29,208,209,133,25,221,219,52,213,199,218,228,126,122,120,127,118,109,27,33,819,177,178,175,180,174,173,172,181,183,179,182,774,776,798,792,796,791,782,790,779,795,785,771,823,176
