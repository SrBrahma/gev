import path from 'path';
import editJsonFile from 'edit-json-file';
import fse from 'fs-extra';
import { oraPromise } from 'ora';
import { Program } from '../../../main/consts.js';
import { addPackages } from '../addPackages.js';

/** Sets up husky and lint-staged. */
export async function setupHusky({
  consts: { installPackages, packageManager, projectPath },
}: {
  consts: {
    projectPath: string;
    packageManager: 'npm' | 'yarn' | 'pnpm';
    installPackages: boolean;
  };
}): Promise<void> {
  await oraPromise(async () => {
    const devDeps = ['husky', 'lint-staged'];
    const json = editJsonFile(path.join(projectPath, 'package.json'));

    if (packageManager === 'yarn') {
      json.set('postinstall', 'husky install');
      /** https://typicode.github.io/husky/#/?id=yarn-2 */
      const isPrivate = json.get('private') as boolean | undefined;
      if (isPrivate) {
        devDeps.push('pinst');
        json.set('scripts.prepack', 'pinst --disable');
        json.set('scripts.postpack', 'pinst --enable');
      }
    } else {
      json.set('scripts.prepare', 'husky install');
    }
    json.set('scripts.pre-commit', 'lint-staged');
    json.set('lint-staged.*\\.{js,jsx,ts,tsx}', ['eslint --fix', 'prettier --write']);

    json.save();

    await fse.copy(
      path.resolve(Program.paths.content('.husky')),
      path.resolve(projectPath, '.husky'),
    );

    await addPackages({
      devDeps,
      projectPath,
      installPackages,
      packageManager,
    });
  }, 'Setting up Husky');
}
