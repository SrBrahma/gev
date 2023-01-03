/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Path from 'path';
import fse from 'fs-extra';
import onExit from 'signal-exit';
import type { SetOptional } from 'type-fest';
import validatePackageName from 'validate-npm-package-name';
import { get_CHANGELOG } from '../common/get_CHANGELOG.js';
import { get_LICENSE } from '../common/get_LICENSE.js';
import type { get_README_Options } from '../common/get_README.js';
import { get_README } from '../common/get_README.js';
import { Program } from '../main/consts.js';
import type { PackageManager } from '../main/types.js';
import type { AddPackagesProps } from './methods/addPackages.js';
import { addPackages } from './methods/addPackages.js';
import { createEmptySemitemplatesDirs } from './methods/semitemplates.js';
import type { SetupEslintrcProps } from './methods/setup/eslint.js';
import { setupEslintrc } from './methods/setup/eslint.js';
import { setupGit } from './methods/setup/git.js';
import { setupHusky } from './methods/setup/husky.js';
import { setupPrettier } from './methods/setup/prettier.js';
import { setProjectDirectory } from './methods/setup/projectDirectory.js';
import type { EditPackageJsonProps } from './utils/utils.js';
import { editPackageJson } from './utils/utils.js';
import { getFlavorFunction } from './flavors.js';

export type CoreConsts = {
  /** If should `npm i` etc */
  installPackages: boolean;
  flavor: string;
  /** If the cwd will be used to store the project files. */
  currentDirectoryIsTarget: boolean;
  /** The project full path. */
  projectPath: string;
  /** The name of the new project. */
  projectName: string;
  /** Where the command is being run. */
  cwd: string;
  /** The full path of the parent directory of the project. */
  parentDirPath: string;
  /** If will clean on errors. */
  cleanOnError: boolean;
  githubAuthor?: string;
  packageManager: 'yarn' | 'npm' | 'pnpm';
};

export type CoreVars = {
  /** If we had manually created anything that we should remove if we had an error. */
  shouldCleanOnError: boolean;
  /** So we can just remove the dir contents instead of removing it if it already existed. */
  createdDir: boolean;
};

/** It won't execute any action by itself. The flavor is responsible of calling the actions. */
export class CoreClass {
  consts: CoreConsts;
  // TODO remove this somehow, or at least make it private.
  vars: CoreVars = {
    createdDir: false,
    shouldCleanOnError: false,
  };

  constructor({
    flavor,
    projectRelativePath,
    installPackages,
    cleanOnError,
    githubAuthor,
    packageManager,
  }: {
    flavor: string;
    /** Use '.' for cwd. */
    projectRelativePath: string;
    installPackages: boolean;
    cleanOnError: boolean;
    githubAuthor?: string;
    packageManager: PackageManager;
  }) {
    const cwd = process.cwd();
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
      packageManager,
    };
  }

  /** Adds segments to the project path. */
  getPathInProjectDir(...filename: string[]): string {
    return Path.join(this.consts.projectPath, ...filename);
  }

  add = {
    readme: (options?: get_README_Options): void =>
      fse.writeFileSync(this.getPathInProjectDir('README.md'), get_README(this.consts, options)),
    changelog: (): void =>
      fse.writeFileSync(this.getPathInProjectDir('CHANGELOG.md'), get_CHANGELOG()),
    license: (): void => fse.writeFileSync(this.getPathInProjectDir('LICENSE'), get_LICENSE()),
  };

  /** Run the flavor.
   *
   * May throw errors. Will clean the files on errors or process premature exit. */
  async run(): Promise<void> {
    // On error, clean if needed.
    const onError = async () => {
      // Only if the flavor doesn't delete the files by itself
      if (this.consts.cleanOnError && this.vars.shouldCleanOnError)
        if (this.vars.createdDir)
          // debugLog('Erasing created files...');
          // Ran at child dir
          await fse.remove(this.consts.projectPath); // [*1]
        // Run at same dir
        else await fse.emptyDir(this.consts.projectPath);
    };

    try {
      // When adding custom flavors, will need to change this.
      const cancelOnExit = onExit(async () => {
        await onError();
      });
      const flavorFunction = await getFlavorFunction(this.consts.flavor);
      await flavorFunction(this);
      cancelOnExit();
    } catch (err) {
      await onError();
      throw err; // Rethrow
    }
  }

  actions = {
    setProjectDirectory: () => setProjectDirectory(this),
    setupCommonStuff: async (props: {
      /** @default true */
      git?: boolean;
      /** @default true */
      husky?: boolean;
      /** @default true */
      prettier?: boolean;
      /** Must be defined in order to be set. */
      eslint?: Omit<SetupEslintrcProps, 'projectPath'>;
      /** @default `name` and `author`. Props here will be merged with them */
      packageJson?: Omit<EditPackageJsonProps, 'projectPath'>;
    }) => {
      editPackageJson({
        projectPath: this.consts.projectPath,
        name: this.consts.projectName,
        author: this.consts.githubAuthor,
        ...props.packageJson,
      });
      if (props.git ?? true) await this.actions.setupGit();
      if (props.husky ?? true) await this.actions.setupHusky();
      if (props.prettier ?? true) await this.actions.setupPrettier();
      if (props.eslint)
        await setupEslintrc({ projectPath: this.consts.projectPath, ...props.eslint });
    },
    setupGit: () => setupGit(this.consts),
    setupHusky: () => setupHusky(this),
    setupPrettier: () => setupPrettier(this.consts),

    addPackages: (
      props: SetOptional<AddPackagesProps, 'packageManager' | 'projectPath' | 'installPackages'>,
    ) =>
      addPackages({
        ...this.consts,
        ...props,
        // TODO Improve this, but works for now
        devDeps: [
          'eslint-config-gev',
          'typescript',
          'husky',
          'lint-staged',
          'prettier-config-gev',
          'prettier',
          ...(props.devDeps ?? []),
        ],
      }),

    /** Copies files from the template to the project path.
     *
     * It will automatically use the flavor.
     *
     * It will call setProjectDirectory().
     *
     * @param flavor set this to use another flavor semitemplate. */
    applySemitemplate: async (): Promise<void> => {
      const flavor = this.consts.flavor;
      // Ensure project path exists.
      this.actions.setProjectDirectory();

      // Before applying anything, as setting up the new files may take a while.
      this.vars.shouldCleanOnError = true;
      // `copy` copies all content from dir, if one is a src https://github.com/jprichardson/node-fs-extra/issues/537
      await fse.copy(Program.paths.semitemplates(flavor), this.consts.projectPath);

      // NPM and its team really sucks sometimes. https://github.com/npm/npm/issues/3763
      if (fse.pathExistsSync(this.getPathInProjectDir('gitignore')))
        fse.renameSync(
          this.getPathInProjectDir('gitignore'),
          this.getPathInProjectDir('.gitignore'),
        );

      createEmptySemitemplatesDirs({
        flavor,
        cwd: this.consts.projectPath,
      });
    },
  }; // End of actions

  verifications = {
    /** The project path must be empty or don't exist. Else, throw. */
    projectPathIsValid: async (): Promise<void> => {
      /** Even if those exists in projectPath, project will still count as empty. */
      const allowedFilesAndDirs = ['.git'];
      if (await fse.pathExists(this.consts.projectPath)) {
        const projectPathFiles = await fse.readdir(this.consts.projectPath);
        const projectPathFilesFiltered = projectPathFiles.filter(
          (f) => !allowedFilesAndDirs.includes(f),
        );
        if (projectPathFilesFiltered.length !== 0)
          // https://stackoverflow.com/a/60676464/10247962
          // improve error message.
          throw new Error(
            `The project path '${this.consts.projectPath}' already exists and it isn't empty!`,
          );
      }
    },

    /** Checks if the project name is npm-valid. Else, throw. */
    projectNameIsNpmValid: (): void => {
      // Validate package name.
      const pkgNameValidation = validatePackageName(this.consts.projectName);
      if (!pkgNameValidation.validForNewPackages) {
        const errors = [...(pkgNameValidation.errors ?? []), ...(pkgNameValidation.warnings ?? [])];
        let errorsString = '';
        errors.forEach((error, i) => {
          errorsString += ` - ${error}` + (i < errors.length - 1 ? '\n' : '');
        });

        throw new Error(
          `The package name '${this.consts.projectName}' is invalid!\n${errorsString}`,
        );
      }
    },
  };
}
