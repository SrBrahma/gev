// https://www.stefanjudis.com/snippets/how-to-import-json-files-in-es-modules-node-js/
import path from 'path';


const pkgJson = require('../../package.json');


const paths = {
  /** Path of the src/ dir, or lib, if compiled. */
  src: (...p: string[]): string => path.resolve(__dirname, '..', ...p),
  /** Path of the program root dir, where for example is the package.json. */
  root: (...p: string[]): string => paths.src('..', ...p),
};

/** General and commonly used info about this program. */
export const Program = {
  /** From package.json */
  name: pkgJson.name,
  version: pkgJson.version,
  /** Reflects process.cwd() */
  cwd: process.cwd(),
  paths,
};