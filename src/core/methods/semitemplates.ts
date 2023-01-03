import path from 'path';
import fse from 'fs-extra';
import { Program } from '../../main/consts.js';

export function createEmptySemitemplatesDirs({
  cwd,
  flavor,
}: {
  flavor: string;
  cwd: string;
}): void {
  const allEmptyDirs: Record<string, string[]> = fse.readJsonSync(
    Program.paths.semitemplatesEmptyDirs(),
  );

  (allEmptyDirs[flavor] ?? []).forEach((d) => fse.ensureDirSync(path.resolve(cwd, d)));
}
