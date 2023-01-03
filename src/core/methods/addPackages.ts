import base64 from 'base-64';
import fetch from 'cross-fetch';
import { execa } from 'execa';
import latestVersion from 'latest-version';
import { oraPromise } from 'ora';
import type { PackageManager } from '../../main/types.js';
import { ensurePackageManagerIsSetup } from './setupPackageManager.js';

export type AddPackages = {
  deps?: string[];
  devDeps?: string[];
  /** If true, will check and change the deps versions to fit expo compatible versions.
   *
   * E.g. for sdk-44: https://github.com/expo/expo/blob/sdk-44/packages/expo/bundledNativeModules.json */
  isExpo?: boolean;
  cwd: string;
  /** If should install after adding the packages to package.json */
  doInstall: boolean;
  packageManager: PackageManager;
};

export async function addPackages({
  deps = [],
  devDeps = [],
  isExpo,
  cwd,
  doInstall,
  packageManager,
}: AddPackages): Promise<void> {
  await ensurePackageManagerIsSetup({ packageManager, cwd });

  if (isExpo)
    await oraPromise(async () => {
      deps = await getPackagesVersionsForLatestExpo(deps);
    }, 'Getting dependencies versions compatible with Expo');

  await oraPromise(async () => {
    await Promise.all([
      deps.length &&
        (await execa('npx', ['add-dependencies', ...deps.map((d) => d.replace('@latest', ''))], {
          cwd,
        })),
      devDeps.length &&
        (await execa(
          'npx',
          ['add-dependencies', ...devDeps.map((d) => d.replace('@latest', '')), '-D'],
          { cwd },
        )),
    ]);
  }, 'Adding dependencies to package.json');

  if (doInstall)
    await oraPromise(async () => {
      // [--ignore-scripts] Don't run `prepare` etc scripts https://stackoverflow.com/a/61975270/10247962
      if (packageManager === 'npm') await execa('npm', ['install', '--ignore-scripts'], { cwd });
      else if (packageManager === 'yarn') await execa('yarn', ['install'], { cwd });
      else await execa('pnpm', ['install', '--ignore-scripts'], { cwd });
    }, `Installing dependencies using ${packageManager}`);
}

async function getPackagesVersionsForLatestExpo(deps: string[]) {
  const expoLatestMajor = (await latestVersion('expo')).split('.')[0]!;

  // This is the file from where the versions are found: https://github.com/expo/expo/blob/sdk-44/packages/expo/bundledNativeModules.json
  // const dictUrl = `https://github.com/expo/expo/blob/sdk-${expoLatestMajor}/packages/expo/bundledNativeModules.json`

  const endpoint = `//api.github.com/repos/expo/expo/contents/packages/expo/bundledNativeModules.json?ref=sdk-${expoLatestMajor}`;
  const data = (await (await fetch(endpoint)).json()).content;

  if (!data) throw new Error(`No data for '${endpoint}'`);

  const dict = JSON.parse(base64.decode(data)) as Record<string, string>;

  const transformedDeps = deps.map((d) => {
    const depName = d.split('@')[0]!;
    const version = dict[depName];
    return version ? `${depName}@${version}` : d;
  });

  return transformedDeps;
}
