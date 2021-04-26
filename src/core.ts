import Path from 'path';
import fs from 'fs-extra';
import { Flavor, FlavorFunction, getFlavorWritePath as getFlavorSemitemplatePath } from './typesAndConsts';
import validatePackageName from 'validate-npm-package-name';
import execa from 'execa';
import { sync as rimrafSync } from 'rimraf';
import { get_README } from './common/get_README';
import { get_CHANGELOG } from './common/get_CHANGELOG';
import { flavorExpo } from './flavors/expo/expo';
import { flavorTypescript } from './flavors/ts/ts';
import onExit from 'signal-exit';

const flavorExecuters: Record<Flavor, FlavorFunction> = {
  ts: flavorTypescript,
  expo: flavorExpo,
};


/** It won't execute any action by itself. The flavor is responsible of calling the actions. */
export class Core {
  consts: {
    /** If should `npm i` */
    installPackages: boolean;
    flavor: Flavor;
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
  }

  vars = {
    /** If we had created a dir for the project. */
    createdDir: false,

    /** If we had manually created anything that we should remove if we had an error. */
    shouldCleanOnError: false,

    state: 'notStarted' as 'notStarted' | 'running' | 'finished',
  }


  constructor({ cwd, flavor, receivedProjectName, installPackages }: {
    flavor: Flavor;
    cwd: string;
    receivedProjectName: string | undefined;
    installPackages: boolean;
  }) {

    const currentDirectoryIsTarget = (receivedProjectName === undefined || receivedProjectName === '.');
    const currentDirName = Path.basename(cwd);
    const projectName = currentDirectoryIsTarget ? currentDirName : receivedProjectName!;
    // The `replace` removes the scope part, if present.
    const projectDirName = currentDirectoryIsTarget ? currentDirName : projectName.replace(/.*\//, '');
    const projectPath = currentDirectoryIsTarget ? cwd : Path.join(cwd, projectDirName);

    this.consts = {
      flavor: flavor,
      cwd: cwd,
      receivedProjectName: receivedProjectName,
      currentDirectoryIsTarget,
      childDirectoryIsTarget: !currentDirectoryIsTarget,
      currentDirName,
      projectName,
      projectDirName,
      projectPath,
      parentDirPath: Path.dirname(projectPath),
      installPackages: installPackages,
    };
  }

  /** Adds segments to the project path. */
  getPath(...filename: string[]): string {
    return Path.join(this.consts.projectPath, ...filename);
  }

  add = {
    readme: (): void => fs.writeFileSync(this.getPath('README.md'), get_README(this)),
    changelog: (): void => fs.writeFileSync(this.getPath('CHANGELOG.md'),  get_CHANGELOG()),
  }



  main = {
    /** Run the flavor.
     *
     * May throw errors. Will clean the files on errors or process premature exit. */
    run: async (): Promise<void> => {
      try {
        // When adding custom flavors, will need to change this.
        const fun = flavorExecuters[this.consts.flavor];

        // Should use alwaysLast option?
        if (this.vars.state === 'notStarted') {
          const remove = onExit(() => {
            this.actions.errorHappenedEraseIfNeeded();
          });
          this.vars.state = 'running';
          await fun(this);
          remove();
          this.vars.state = 'finished';
        }
      } catch (err) {
        this.actions.errorHappenedEraseIfNeeded();
        throw err; // Rethrow
      }
    },
  }



  actions = {

    errorHappenedEraseIfNeeded: (): void => {
      // Only if the flavor doesn't delete the files by itself
      if (this.vars.shouldCleanOnError) {
        // debugLog('Erasing created files...');
        if (this.vars.createdDir) // Ran at child dir
          rimrafSync(this.consts.projectPath);
        else // Ran at same dir
          rimrafSync('./{*,.*}', {}); // https://github.com/isaacs/rimraf/issues/167#issuecomment-371288470
      }
    },

    /** `npm i`. Will print that they are being installed. You may pass additional dependencies. */
    installPackages: async ({ deps = [], devDeps = [] }: {
      devDeps?: string[],
      deps?: string[]
    } = {}): Promise<void> => {
      console.log('Installing packages...');

      if (devDeps.length)
        await execa('npm', ['i', '-D', ...devDeps], { cwd: this.consts.projectPath });

      // If hasn't executed the above, will execute this. Will also execute if there are deps to install.
      if (!devDeps.length || deps.length)
        await execa('npm', ['i', ...deps], { cwd: this.consts.projectPath });
    },

    /** Creates the project directory, if not using the cwd as the path.
     *
     * As it uses createProjectDir action, createdDir and shouldCleanOnError may be set.
     * You should run projectDirMustBeValid before. */
    setProjectDirectory: (): void => {
      if (this.consts.childDirectoryIsTarget)
        this.actions.createProjectDir();
    },

    /** Creates a new directory named ${this.projectDirName}. */
    createProjectDir: (): void => {
    // Already checked the dir existence above.
      fs.mkdirSync(this.consts.projectDirName);
      this.vars.createdDir = true;
      this.vars.shouldCleanOnError = true;
    },

    /** Copies files from the template to the project path.
     *
     * Should only be called after setProjectDirectory(), so it may set the creation vars. */
    applyTemplate: (): void => {
      // copySync copies all content from dir, if one is a src https://github.com/jprichardson/node-fs-extra/issues/537
      fs.copySync(getFlavorSemitemplatePath(this.consts.flavor), this.consts.projectPath);
      this.vars.shouldCleanOnError = true;
    },
  }


  /** */
  verifications = {

    /** If will use the current directory as the project root, will check if it's empty.
     *
     * If creating a new one, will check if it doesn't already exists. */
    projectDirMustBeValid: (): void => {
      if (this.consts.currentDirectoryIsTarget) {
        this.verifications.currentDirectoryMustBeEmpty();
      } else {
        this.verifications.noFileNamedAsProject();
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

        throw (`The package name "${this.consts.projectName}" is invalid!\n${errorsString}`);
      }
    },

    /** Check if there is no file/dir with the project name in the current directory. If it does, throws error. */
    noFileNamedAsProject: (): void => {
      if (fs.existsSync(this.consts.projectPath))
        throw (`There is already a directory or file named "${this.consts.projectDirName}" at "${this.consts.parentDirPath}"`);
    },

    /** Check if current dir is empty to use it as root for the project. If it does, throws error. */
    currentDirectoryMustBeEmpty: (): void => {
      const cwdIsEmpty = fs.readdirSync('./').length === 0; // https://stackoverflow.com/a/60676464/10247962
      if (!cwdIsEmpty) {
      // improve error message
        throw ('As no package name was passed, it was attempted to use the current working directory. However, the cwd is not empty!\n\n'
        + 'cwd=' + this.consts.cwd);
      }
    },
  }
}

