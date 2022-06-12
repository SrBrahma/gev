import ora from 'ora';
import { editPackageJson } from '../core/utils/utils.js';
import type { FlavorFunction } from '../main/typesAndConsts.js';
import { getTypescriptCommonDevDeps } from './ts.js';



const flavorExpoPkg: FlavorFunction = async (core) => {

  core.verifications.projectNameMustBeNpmValid();
  await core.verifications.projectPathMustBeValid();

  ora().info(`Generating the Expo Package project '${core.consts.projectName}' at '${core.consts.projectPath}'`);

  await core.actions.applySemitemplate();

  core.add.license();
  core.add.changelog();
  core.add.readme({
    badges: { npm: true, prWelcome: true, typescript: true },
  });

  await core.actions.addPackages({
    packageManager: 'yarn',
    devDeps: [
      ...getTypescriptCommonDevDeps({ tests: false }),
      'react-native',
      'rimraf',
      'react',
      '@types/react-native',
    ],
  });

  editPackageJson({
    name: core.consts.projectName,
    githubAuthor: core.consts.githubAuthor,
    projectPath: core.consts.projectPath,
  });

  await core.actions.setupGit();

  ora().succeed(`Expo package project '${core.consts.projectName}' created at '${core.consts.projectPath}'!`);
};

export default flavorExpoPkg;