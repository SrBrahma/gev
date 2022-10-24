import path from 'path';
import { execa } from 'execa';
import fse from 'fs-extra';
import { globby } from 'globby';
import { oraPromise } from 'ora';


/**
 * Run after applying the semitemplate and before addPackages. Won't install
 * after this, as addPackage already does it.
 *
 * addPackages() will automatically call this if required to use yarn and
 * yarn is not yet set.
 */
export async function ensurePackageManagerIsSetup({ packageManager, cwd }: {
  packageManager: 'yarn' | 'npm';
  cwd: string;
}): Promise<void> {
  await oraPromise(async () => {
    switch (packageManager) {
      case 'yarn': {
        // First create yarn.lock if it doesn't already exist. We do this as else it may complain if inside another project
        // (like if we try to run `yarn gev -- ts tests/a` during gev development).
        await fse.ensureFile(path.join(cwd, 'yarn.lock'));

        // Ensure yarn is installed and on latest version (it's fast)
        await execa('npm', ['install', '-g', 'yarn'], { cwd });
        // Add the yarn.js file
        await execa('yarn', ['set', 'version', 'berry'], { cwd });

        const yarnPath = (await globby('.yarn/releases/yarn-*', { cwd }))[0];
        if (!yarnPath)
          throw new Error("Yarn path couldn't be found.");

        // If gev is run inside another project, .yarnrc.yml wouldn't be generated. We do this to ensure it's created.
        await fse.writeFile(path.join(cwd, '.yarnrc.yml'), `nodeLinker: node-modules\n\nyarnPath: ${yarnPath}`);
        // https://yarnpkg.com/getting-started/qa#which-files-should-be-gitignored
        await fse.appendFile(path.join(cwd, '.gitignore'), `\n\n# Yarn\n.pnp.*\n.yarn/*\n!.yarn/patches\n!.yarn/plugins\n!.yarn/releases\n!.yarn/sdks\n!.yarn/versions\n`);
        // For `yarn upgrade-interactive`
        await execa('yarn', ['plugin', 'import', 'interactive-tools'], { cwd });
      } break;
    }
  }, `Setting up ${packageManager}`);
}