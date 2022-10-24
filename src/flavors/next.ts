import ora from 'ora';
import { editPackageJson } from '../core/utils/utils.js';
import type { FlavorFunction } from '../main/types.js';


const humanName = 'Next.js';

const generator: FlavorFunction = async (core) => {

  await core.verifications.projectPathMustBeValid();

  ora().info(`Generating the ${humanName} project '${core.consts.projectName}' at '${core.consts.projectPath}'`);

  await core.actions.applySemitemplate();

  await core.actions.addPackages({
    deps: [
      'next',
      'react',
      'react-dom',
    ],
    devDeps: [
      '@types/node',
      '@types/react',
      'eslint-config-gev',
      'typescript', // Ensure latest
    ],
  });

  editPackageJson({
    projectPath: core.consts.projectPath,
    name: core.consts.projectName,
    githubAuthor: core.consts.githubAuthor,
  });

  await core.actions.setupGit();
  await core.actions.setupHusky();

  ora().succeed(`${humanName} project '${core.consts.projectName}' created at '${core.consts.projectPath}'!`);
};

export default generator;