import Path from 'path';
import fse from 'fs-extra';
import { getFlavorWritePath as getFlavorSemitemplatePath } from '../typesAndConsts';
import validatePackageName from 'validate-npm-package-name';
import execa from 'execa';
import { get_README, get_README_Options } from '../common/get_README';
import { get_CHANGELOG } from '../common/get_CHANGELOG';
import onExit from 'signal-exit';
import ora from 'ora';
import { getFlavorFunction } from './flavors';



/** It won't execute any action by itself. The flavor is responsible of calling the actions. */
export class Core {
  consts: {
    /** If should `npm i` */
    installPackages: boolean;
    flavor: string;
    /** Where we are running the command. */
    cwd: string;
    receivedProjectName: string | undefined;
    /** The last segment of the cwd. */
    currentDirName: string;
    /** If the current directory should be used to store the project files.
     * The inverse of `childDirectoryIsTarget` */
    currentDirectoryIsTarget: boolean;
    /** If will create / has created a new directory for the project.
     * The inverse of `currentDirectoryAsTarget` */
    childDirectoryIsTarget: boolean;
    /** The project full path. */
    projectPath: string;
    /** The name of the new project. */
    projectName: string;
    /** The full path of the parent directory of the project. */
    parentDirPath: string;
    /** The name of the directory containing the project. */
    projectDirName: string;
    /** If will clean on errors. */
    cleanOnError: boolean;
  };

  vars = {
    /** If we had manually created anything that we should remove if we had an error. */
    shouldCleanOnError: false,
    /** So we can just remove the dir contents instead of removing it if it already existed. */
    createdDir: false,
    state: 'notStarted' as 'notStarted' | 'running' | 'finished',
  };

  constructor({
    cwd = process.cwd(),
    flavor, receivedProjectName, installPackages, cleanOnError,
  }: {
    flavor: string;
    /** Where the user is running the gev command.
     * @default process.cwd() */
    cwd?: string;
    receivedProjectName?: string | undefined;
    installPackages: boolean;
    cleanOnError: boolean;
  }) {

    const currentDirectoryIsTarget = (receivedProjectName === undefined || receivedProjectName === '.');
    const currentDirName = Path.basename(cwd);
    const projectName = currentDirectoryIsTarget ? currentDirName : receivedProjectName!;
    // The `replace` removes the scope part, if present.
    const projectDirName = currentDirectoryIsTarget ? currentDirName : projectName.replace(/.*\//, '');
    const projectPath = currentDirectoryIsTarget ? cwd : Path.join(cwd, projectDirName);

    this.consts = {
      flavor,
      cwd,
      receivedProjectName: receivedProjectName,
      currentDirectoryIsTarget,
      childDirectoryIsTarget: !currentDirectoryIsTarget,
      currentDirName,
      projectName,
      projectDirName,
      projectPath,
      parentDirPath: Path.dirname(projectPath),
      installPackages,
      cleanOnError,
    };
  }

  /** Adds segments to the project path. */
  getPathInProjectDir(...filename: string[]): string {
    return Path.join(this.consts.projectPath, ...filename);
  }

  add = {
    readme: (options?: get_README_Options): void => fse.writeFileSync(this.getPathInProjectDir('README.md'), get_README(this, options)),
    changelog: (): void => fse.writeFileSync(this.getPathInProjectDir('CHANGELOG.md'), get_CHANGELOG()),
  };


  /** Run the flavor.
     *
     * May throw errors. Will clean the files on errors or process premature exit. */
  async run(): Promise<void> {
    if (this.vars.state === 'notStarted') {
      try {
        this.vars.state = 'running';
        // When adding custom flavors, will need to change this.
        const cancelOnExit = onExit(async () => {
          await this.actions.errorHappenedCleanIfNeeded();
        });
        await (await getFlavorFunction(this.consts.flavor))(this);
        cancelOnExit();
        this.vars.state = 'finished';
      } catch (err) {
        await this.actions.errorHappenedCleanIfNeeded();
        throw err; // Rethrow
      }
    }
  }


  actions = {

    errorHappenedCleanIfNeeded: async (): Promise<void> => {
      // Only if the flavor doesn't delete the files by itself
      if (this.consts.cleanOnError && this.vars.shouldCleanOnError) {
        // debugLog('Erasing created files...');
        if (this.vars.createdDir) // Ran at child dir
          await fse.remove(this.consts.projectPath); // [*1]
        else // Run at same dir
          await fse.emptyDir(this.consts.projectPath);
      }
    },

    // TODO support for specific versions. Check if contains @, if so, won't include the @latest. Can just use regex in the replace.
    /** `npm i`. Will print that they are being installed. You may pass additional dependencies.
     *
     * Will only install if this.consts.installPackages is true
    */
    addPackages: async ({ deps = [], devDeps = [], cwd = this.consts.projectPath, install = this.consts.installPackages }: {
      deps?: string[];
      devDeps?: string[];
      /** @default this.consts.projectPath */
      cwd?: string;
      /** @default this.consts.installPackages */
      install?: boolean;
      // peerDeps?: string[],
    } = {}): Promise<void> => {
      if (install) {
        await ora.promise(async () => {
          if (devDeps.length)
            await execa('npm', ['i', '-D', ...devDeps], { cwd });

          // If hasn't executed the above, will execute this. Will also execute if there are deps to install.
          if (!devDeps.length || deps.length)
            await execa('npm', ['i', ...deps], { cwd });
        }, 'Installing dependencies');

      } else {
        await ora.promise(async () => {
          await Promise.all([
            deps.length && await execa('npx', [
              'add-dependencies',
              ...deps.map(d => d.replace('@latest', '')),
            ],
            { cwd }),
            devDeps.length && await execa('npx', [
              'add-dependencies',
              ...devDeps.map(d => d.replace('@latest', '')), '-D',
            ],
            { cwd }),
          ]);
        }, 'Adding dependencies without installing them');
      }
    }, // End of addPackages

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
     * Should only be called after setProjectDirectory(), so it may set the creation vars.
     *
     * @param flavorOverwrite set this to use another flavor semitemplate. */
    applySemitemplate: async (flavorOverwrite?: string): Promise<void> => {
      // Before applying anything, as setting up the new files may take a while.
      this.vars.shouldCleanOnError = true;
      // `copy` copies all content from dir, if one is a src https://github.com/jprichardson/node-fs-extra/issues/537
      await fse.copy(getFlavorSemitemplatePath(flavorOverwrite ?? this.consts.flavor), this.consts.projectPath);

      // NPM and its team really sucks sometimes. https://github.com/npm/npm/issues/3763
      if (await fse.pathExists(this.getPathInProjectDir('gitignore')))
        await fse.rename(this.getPathInProjectDir('gitignore'), this.getPathInProjectDir('.gitignore'));
    },
  }; // End of actions

  verifications = {
    /** The project path must be empty or don't exist. Else, will throw an error. */
    projectPathMustBeValid: async (): Promise<void> => {
      /** Even if those exists in projectPath, project will still count as empty. */
      const allowedFilesAndDirs = ['.git'];
      if (await fse.pathExists(this.consts.projectPath)) {
        const projectPathFiles = await fse.readdir(this.consts.projectPath);
        const projectPathFilesFiltered = projectPathFiles.filter(f => !allowedFilesAndDirs.includes(f));
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