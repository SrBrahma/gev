import ora from 'ora';
import { editPackageJson } from '../core/utils/utils.js';
import type { FlavorFunction } from '../main/types.js';
import { getTypescriptCommonDevDeps } from './ts.js';


const humanName = 'Expo Package';

const generator: FlavorFunction = async (core) => {

  core.verifications.projectNameMustBeNpmValid();
  await core.verifications.projectPathMustBeValid();

  ora().info(`Generating the ${humanName} project '${core.consts.projectName}' at '${core.consts.projectPath}'`);

  await core.actions.applySemitemplate();

  core.add.license();
  core.add.changelog();
  core.add.readme({
    badges: { npm: true, prWelcome: true, typescript: true },
  });

  await core.actions.addPackages({
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
  await core.actions.setupHusky();


  ora().succeed(`${humanName} project '${core.consts.projectName}' created at '${core.consts.projectPath}'!`);
};

export default generator;