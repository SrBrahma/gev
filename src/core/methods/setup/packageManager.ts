import path from 'path';
import { execaCommand } from 'execa';
import fse from 'fs-extra';
import { globby } from 'globby';
import { oraPromise } from 'ora';
import type { PackageManager } from '../../../main/types.js';

/**
 * Run after applying the semitemplate and before addPackages. Won't install
 * after this, as addPackage already does it.
 *
 * addPackages() will automatically call this if required to use yarn and
 * yarn is not yet set.
 */
export async function ensurePackageManagerIsSetup({
  packageManager,
  projectPath,
}: {
  packageManager: PackageManager;
  projectPath: string;
}): Promise<void> {
  await oraPromise(async () => {
    switch (packageManager) {
      case 'pnpm': {
        await execaCommand('npm install -g pnpm', { cwd: projectPath });
        break;
      }
      case 'yarn':
        {
          // First create yarn.lock if it doesn't already exist. We do this as else it may complain if inside another project
          // (like if we try to run `yarn gev -- ts tests/a` during gev development).
          await fse.ensureFile(path.join(projectPath, 'yarn.lock'));

          // Ensure yarn is installed and on latest version (it's fast)
          await execaCommand('npm install -g yarn', { cwd: projectPath });
          // Add the yarn.js file
          await execaCommand('yarn set version berry', { cwd: projectPath });

          const yarnPath = (await globby('.yarn/releases/yarn-*', { cwd: projectPath }))[0];
          if (!yarnPath) throw new Error("Yarn path couldn't be found.");

          // If gev is run inside another project, .yarnrc.yml wouldn't be generated. We do this to ensure it's created.
          await fse.writeFile(
            path.join(projectPath, '.yarnrc.yml'),
            `nodeLinker: node-modules\n\nyarnPath: ${yarnPath}`,
          );
          // https://yarnpkg.com/getting-started/qa#which-files-should-be-gitignored
          await fse.appendFile(
            path.join(projectPath, '.gitignore'),
            `\n\n# Yarn\n.pnp.*\n.yarn/*\n!.yarn/patches\n!.yarn/plugins\n!.yarn/releases\n!.yarn/sdks\n!.yarn/versions\n`,
          );
          // For `yarn upgrade-interactive`
          await execaCommand('yarn plugin import interactive-tools', { cwd: projectPath });
        }
        break;
    }
  }, `Setting up ${packageManager}`);
}
