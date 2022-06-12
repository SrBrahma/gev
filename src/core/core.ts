import Path from 'path';
import base64 from 'base-64';
import fetch from 'cross-fetch';
import { execa } from 'execa';
import fse from 'fs-extra';
import hasYarn from 'has-yarn';
import latestVersion from 'latest-version';
import { oraPromise } from 'ora';
import onExit from 'signal-exit';
import validatePackageName from 'validate-npm-package-name';
import { get_CHANGELOG } from '../common/get_CHANGELOG.js';
import { get_LICENSE } from '../common/get_LICENSE.js';
import type { get_README_Options } from '../common/get_README.js';
import { get_README } from '../common/get_README.js';
import { getFlavorWritePath as getFlavorSemitemplatePath } from '../main/typesAndConsts.js';
import { pathHasGit } from './utils/utils.js';
import { getFlavorFunction } from './flavors.js';



type Consts = {
  /** If should `npm i` */
  installPackages: boolean;
  flavor: string;
  /** Where we are running the command. */
  cwd: string;
  /** If the cwd will be used to store the project files. */
  currentDirectoryIsTarget: boolean;
  /** The project full path. */
  projectPath: string;
  /** The name of the new project. */
  projectName: string;
  /** The full path of the parent directory of the project. */
  parentDirPath: string;
  /** If will clean on errors. */
  cleanOnError: boolean;
  githubAuthor?: string;
};

type Vars = {
  /** If we had manually created anything that we should remove if we had an error. */
  shouldCleanOnError: boolean;
  /** So we can just remove the dir contents instead of removing it if it already existed. */
  createdDir: boolean;
  state: 'notStarted' | 'running' | 'finished';
};

/** It won't execute any action by itself. The flavor is responsible of calling the actions. */
export class Core {
  consts: Consts;
  vars: Vars = {
    createdDir: false,
    shouldCleanOnError: false,
    state: 'notStarted',
  };

  constructor({
    cwd = process.cwd(),
    flavor, projectRelativePath, installPackages, cleanOnError, githubAuthor,
  }: {
    flavor: string;
    /** Where the user is running the gev command.
     * @default process.cwd() */
    cwd?: string;
    /** Use '.' for cwd. */
    projectRelativePath: string;
    installPackages: boolean;
    cleanOnError: boolean;
    githubAuthor?: string;
  }) {

    const projectPath = Path.join(cwd, projectRelativePath);

    this.consts = {
      flavor,
      cwd,
      currentDirectoryIsTarget: projectPath === cwd,
      projectName: Path.basename(projectPath),
      projectPath,
      parentDirPath: Path.dirname(projectPath),
      installPackages,
      cleanOnError,
      githubAuthor,
    };
  }

  /** Adds segments to the project path. */
  getPathInProjectDir(...filename: string[]): string {
    return Path.join(this.consts.projectPath, ...filename);
  }

  add = {
    readme: (options?: get_README_Options): void => fse.writeFileSync(this.getPathInProjectDir('README.md'), get_README(this, options)),
    changelog: (): void => fse.writeFileSync(this.getPathInProjectDir('CHANGELOG.md'), get_CHANGELOG()),
    license: (): void => fse.writeFileSync(this.getPathInProjectDir('LICENSE'), get_LICENSE(this)),
  };


  /** Run the flavor.
     *
     * May throw errors. Will clean the files on errors or process premature exit. */
  async run(): Promise<void> {
    if (this.vars.state !== 'notStarted') return;

    // On error, clean if needed.
    const onError = async () => {
      // Only if the flavor doesn't delete the files by itself
      if (this.consts.cleanOnError && this.vars.shouldCleanOnError) {
        // debugLog('Erasing created files...');
        if (this.vars.createdDir) // Ran at child dir
          await fse.remove(this.consts.projectPath); // [*1]
        else // Run at same dir
          await fse.emptyDir(this.consts.projectPath);
      }
    };

    try {
      this.vars.state = 'running';

      // When adding custom flavors, will need to change this.
      const cancelOnExit = onExit(async () => { await onError(); });
      const flavorFunction = await getFlavorFunction(this.consts.flavor);
      await flavorFunction(this);
      cancelOnExit();
      this.vars.state = 'finished';
    } catch (err) {
      await onError();
      throw err; // Rethrow
    }
  }


  actions = {
    /** Run after applying the semitemplate and before addPackages. Won't install after this, as addPackage already does it.
     *
     * addPackages() will automatically call this if required to use yarn and yarn is not yet set. */
    setupPackageManager: async ({
      packageManager,
      cwd = this.consts.projectPath,
    }: {
      packageManager: 'yarn';
      cwd?: string;
    }): Promise<void> => {
      await oraPromise(async () => {
        // https://yarnpkg.com/getting-started/migration, not using PnP.
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (packageManager === 'yarn') {
        // Ensure yarn is latest version
          await execa('npm', ['install', '-g', 'yarn'], { cwd });
          await execa('yarn', ['set', 'version', 'berry'], { cwd });
          await fse.appendFile(Path.join(cwd, '.yarnrc.yml'), 'nodeLinker: node-modules\n');
          // https://yarnpkg.com/getting-started/qa#which-files-should-be-gitignored
          await fse.appendFile(Path.join(cwd, '.gitignore'), `\n\n# Yarn\n.pnp.*\n.yarn/*\n!.yarn/patches\n!.yarn/plugins\n!.yarn/releases\n!.yarn/sdks\n!.yarn/versions\n`);
          // For `yarn upgrade-interactive`
          await execa('yarn', ['plugin', 'import', 'interactive-tools'], { cwd });
        }
      }, `Setting up ${packageManager}`);
    },
    // TODO support for specific versions. Check if contains @, if so, won't include the @latest. Can just use regex in the replace.
    /** `npm i`. Will print that they are being installed. You may pass additional dependencies.
     *
     * Will only install if this.consts.installPackages is true
    */
    addPackages: async ({
      deps = [], devDeps = [], isExpo,
      cwd = this.consts.projectPath, install = this.consts.installPackages,
      packageManager = 'npm',
    }: {
      deps?: string[];
      devDeps?: string[];
      /** If true, will check and change the deps versions to fit expo compatible versions.
       *
       * E.g. for sdk-44: https://github.com/expo/expo/blob/sdk-44/packages/expo/bundledNativeModules.json */
      isExpo?: boolean;
      /** @default this.consts.projectPath */
      cwd?: string;
      /** @default this.consts.installPackages */
      install?: boolean;
      // peerDeps?: string[],
      /** @default 'npm' */
      packageManager?: 'yarn' | 'npm';
    } = {}): Promise<void> => {
      if (isExpo) {
        await oraPromise(async () => {
          deps = await getPackagesVersionsForLatestExpo(deps);
        }, 'Getting dependencies versions compatible with Expo');
      }

      await oraPromise(async () => {
        await Promise.all([
          deps.length && await execa('npx', [
            'add-dependencies',
            ...deps.map((d) => d.replace('@latest', '')),
          ], { cwd }),
          devDeps.length && await execa('npx', [
            'add-dependencies',
            ...devDeps.map((d) => d.replace('@latest', '')), '-D',
          ], { cwd }),
        ]);
      }, 'Adding dependencies to package.json');

      if (install) {
        await oraPromise(async () => {
          if (packageManager === 'npm')
          // [--ignore-scripts] Don't run `prepare` etc scripts https://stackoverflow.com/a/61975270/10247962
            await execa('npm', ['install', '--ignore-scripts'], { cwd });
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          else if (packageManager === 'yarn') {
            if (!hasYarn(cwd))
              await this.actions.setupPackageManager({ packageManager: 'yarn', cwd });
            await execa('yarn', ['install'], { cwd });
          }
        }, `Installing dependencies using ${packageManager}`);
      }
    },

    /** Creates the project directory, if not using the cwd as the path.
     *
     * As it uses createProjectDir action, createdDir and shouldCleanOnError may be set.
     * You should run projectDirMustBeValid before. */
    setProjectDirectory: async (): Promise<void> => {
      // TODO [*1] get the higher level dir created to remove it.
      const dirExists = await fse.pathExists(this.consts.projectPath);
      if (!dirExists) {
        await fse.ensureDir(this.consts.projectPath);
        this.vars.shouldCleanOnError = true;
        this.vars.createdDir = true;
      }
    },

    /** Copies files from the template to the project path.
     *
     * It will automatically use the flavor.
     *
     * It will call setProjectDirectory().
     *
     * @param flavor set this to use another flavor semitemplate. */
    applySemitemplate: async (flavor?: string): Promise<void> => {
      // Ensure project path exists.
      await this.actions.setProjectDirectory();

      // Before applying anything, as setting up the new files may take a while.
      this.vars.shouldCleanOnError = true;
      // `copy` copies all content from dir, if one is a src https://github.com/jprichardson/node-fs-extra/issues/537
      await fse.copy(getFlavorSemitemplatePath(flavor ?? this.consts.flavor), this.consts.projectPath);

      // NPM and its team really sucks sometimes. https://github.com/npm/npm/issues/3763
      if (await fse.pathExists(this.getPathInProjectDir('gitignore')))
        await fse.rename(this.getPathInProjectDir('gitignore'), this.getPathInProjectDir('.gitignore'));
    },

    setupGit: async (): Promise<void> => {
      if (!await pathHasGit(this.consts.projectPath))
        await execa('git', ['init']);

      await execa('git', ['branch', '-m', 'master', 'main'])
        .catch(() => null); // It may error if there is no master / there is already a main.
    },
  }; // End of actions

  verifications = {
    /** The project path must be empty or don't exist. Else, will throw an error. */
    projectPathMustBeValid: async (): Promise<void> => {
      /** Even if those exists in projectPath, project will still count as empty. */
      const allowedFilesAndDirs = ['.git'];
      if (await fse.pathExists(this.consts.projectPath)) {
        const projectPathFiles = await fse.readdir(this.consts.projectPath);
        const projectPathFilesFiltered = projectPathFiles.filter((f) => !allowedFilesAndDirs.includes(f));
        if (projectPathFilesFiltered.length !== 0) { // https://stackoverflow.com/a/60676464/10247962
          // improve error message.
          throw (`The project path '${this.consts.projectPath}' already exists and it isn't empty!`);
        }
      }
    },

    /** Checks if the project name is npm-valid. If not, throws error. */
    projectNameMustBeNpmValid: (): void => {
      // Validate package name.
      const pkgNameValidation = validatePackageName(this.consts.projectName);
      if (!pkgNameValidation.validForNewPackages) {
        const errors = [...pkgNameValidation.errors ?? [], ...pkgNameValidation.warnings ?? []];
        let errorsString = '';
        errors.forEach((error, i) => {
          errorsString += ` - ${error}` + (i < (errors.length - 1) ? '\n' : '');
        });

        throw (`The package name '${this.consts.projectName}' is invalid!\n${errorsString}`);
      }
    },

  }; // End of verifications
}



async function getPackagesVersionsForLatestExpo(deps: string[]) {
  const expoLatestMajor = (await latestVersion('expo')).split('.')[0]!;

  // This is the file from where the versions are found: https://github.com/expo/expo/blob/sdk-44/packages/expo/bundledNativeModules.json
  // const dictUrl = `https://github.com/expo/expo/blob/sdk-${expoLatestMajor}/packages/expo/bundledNativeModules.json`

  const endpoint = `//api.github.com/repos/expo/expo/contents/packages/expo/bundledNativeModules.json?ref=sdk-${expoLatestMajor}`;
  const data = (await (await fetch(endpoint)).json()).content;

  if (!data)
    throw new Error (`No data for '${endpoint}'`);

  const dict = JSON.parse(base64.decode(data)) as Record<string, string>;

  const transformedDeps = deps.map((d) => {
    const depName = d.split('@')[0]!;
    const version = dict[depName];
    return version ? `${depName}@${version}` : d;
  });

  return transformedDeps;
}