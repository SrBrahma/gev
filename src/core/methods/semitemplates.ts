import path from 'path';
import fse from 'fs-extra';
import { Program } from '../../main/consts.js';


export async function createEmptySemitemplatesDirs({ cwd, flavor }: {
  flavor: string;
  cwd: string;
}): Promise<void> {
  const allEmptyDirs: Record<string, string[]> = await fse
    .readJson(Program.paths.semitemplatesEmptyDirs());

  await Promise.all((allEmptyDirs[flavor] ?? [])
    .map((d) => fse.ensureDir(path.resolve(cwd, d))),
  );
}