import ora from 'ora';
import { setupEslintrc } from '../core/methods/setupEslint.js';
import { editPackageJson } from '../core/utils/utils.js';
import type { FlavorFunction } from '../main/types.js';
import { getTypescriptCommonDevDeps } from './ts.js';


const humanName = 'Typescript ESM';

const generator: FlavorFunction = async (core) => {

  core.verifications.projectNameMustBeNpmValid();
  await core.verifications.projectPathMustBeValid();

  ora().info(`Generating the ${humanName} project '${core.consts.projectName}' at '${core.consts.projectPath}'`);

  core.actions.setProjectDirectory();

  core.add.license();
  core.add.changelog();
  core.add.readme({
    badges: { npm: true, prWelcome: true, typescript: true },
  });

  await core.actions.applySemitemplate();

  editPackageJson({
    name: core.consts.projectName,
    githubAuthor: core.consts.githubAuthor,
    projectPath: core.consts.projectPath,
  });

  // To install the latest. The semitemplate deps don't matter too much,
  await core.actions.addPackages({
    devDeps: [
      ...getTypescriptCommonDevDeps(),
      'rimraf',
      'ts-node', // For node --loader
      'nodemon', // For watch
    ],
  });

  await core.actions.setupGit();
  await core.actions.setupHusky();
  await setupEslintrc({ cwd: core.consts.projectPath, flavor: 'ts', cjs: true });


  ora().succeed(`${humanName} project '${core.consts.projectName}' created at '${core.consts.projectPath}'!`);
};

export default generator;
