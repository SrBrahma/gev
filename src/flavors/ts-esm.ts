import ora from 'ora';
import { editPackageJson } from '../core/utils/utils.js';
import type { FlavorFunction } from '../main/typesAndConsts.js';
import { getTypescriptCommonDevDeps } from './ts.js';




const flavorTypescript: FlavorFunction = async (core) => {

  core.verifications.projectNameMustBeNpmValid();
  await core.verifications.projectPathMustBeValid();

  ora().info(`Generating the Typescript ESM project '${core.consts.projectName}' at '${core.consts.projectPath}'`);

  await core.actions.applySemitemplate();

  core.add.license();
  core.add.changelog();
  core.add.readme({
    badges: { npm: true, prWelcome: true, typescript: true },
  });

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

  ora().succeed(`Typescript ESM project '${core.consts.projectName}' created at '${core.consts.projectPath}'!`);
};

export default flavorTypescript;
