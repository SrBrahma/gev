import fse from 'fs-extra';
import { globby } from 'globby';
import { Program } from '../src/main/consts.js';


async function makeEmptyDirsFile(): Promise<void> {
  const emptyDirs = await getSemitemplatesEmptyDirs();
  await fse.writeJson(Program.paths.semitemplatesEmptyDirs(), emptyDirs, {
    spaces: 2,
  });
}

/** Returns an array of all empty dirs in the semitemplates dir. */
async function getSemitemplatesEmptyDirs(): Promise<Record<string, string[]>> {
  const allDirs = await globby('semitemplates/**', {
    onlyDirectories: true,
  });
  const emptyDirsObj: Record<string, string[]> = {};

  const emptyDirs: string[] = allDirs
    .filter(isDirEmpty);

  emptyDirs.forEach((d) => {
    const splitted = d.split('/');
    const flavor = splitted[1]!;
    const relativePath = splitted.slice(2).join('/');
    (emptyDirsObj[flavor] ??= []).push(relativePath);
  });

  return emptyDirsObj;
}

function isDirEmpty(path: string): boolean {
  return !(fse.readdirSync(path)).length;
}

void makeEmptyDirsFile();