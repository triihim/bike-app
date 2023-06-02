import dotenv from 'dotenv';
import path from 'path';

export default function () {
  const envFilePath = path.resolve(__dirname, '../environments/test.env');
  dotenv.config({ path: envFilePath });
}
