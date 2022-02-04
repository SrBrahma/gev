import path, { dirname } from 'path';
import { fileURLToPath } from 'url';



const __dirname = dirname(fileURLToPath(import.meta.url));

// https://www.stefanjudis.com/snippets/how-to-import-json-files-in-es-modules-node-js/
// eslint-disable-next-line import/newline-after-import
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pkgJson = require('../../package.json');


/** General and commonly used info about this program. */
export const Program = {
  /** From package.json */
  name: pkgJson.name,
  version: pkgJson.version,
  /** Reflects process.cwd() */
  cwd: process.cwd(),
  /** Path of the src/ dir, or lib, if compiled. */
  srcPath: path.join(__dirname, '..'),
  /** Path of the program root dir, where for example is the package.json. */
  rootPath: path.join(__dirname, '..', '..'),
};