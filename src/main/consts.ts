// https://www.stefanjudis.com/snippets/how-to-import-json-files-in-es-modules-node-js/
import { createRequire } from 'module';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const pkgJson = require('../../package.json');

const paths = {
  /** Path of the src/ dir, or lib, if compiled. */
  src: (...p: string[]): string => path.resolve(__dirname, '..', ...p),
  flavors: (...p: string[]): string => paths.src('flavors', ...p),
  /** Path of the program root dir, where for example is the package.json. */
  root: (...p: string[]): string => paths.src('..', ...p),
  semitemplates: (...p: string[]): string => paths.root('semitemplates', ...p),
  content: (...p: string[]): string => paths.root('content', ...p),
  semitemplatesEmptyDirs: (): string => paths.content('semitemplatesEmptyDirs.json'),
};

/** General and commonly used info about this program. */
export const Program = {
  /** From package.json */
  name: pkgJson.name,
  version: pkgJson.version,
  /** Reflects process.cwd() */
  cwd: process.cwd(),
  /** Path of the src/ dir, or lib, if compiled. */
  srcPath: path.join(__dirname, '..'),
  paths,
};
