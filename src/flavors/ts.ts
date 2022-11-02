import ora from 'ora';
import { setupEslintrc } from '../core/methods/setupEslint.js';
import { editPackageJson } from '../core/utils/utils.js';
import type { FlavorFunction } from '../main/types.js';


const humanName = 'Typescript';

// To be reused
export function getTypescriptCommonDevDeps({ tests }: {
  /** If shall add testing packages.
   * @default true */
  tests?: boolean;
} = {}): string[] {
  return [
    'typescript',
    'eslint-config-gev',
    '@types/node',
    ...(tests ? [
      'jest',
      'ts-jest',
      '@types/jest',
    ] : []),
  ];
}


const generator: FlavorFunction = async (core) => {

  core.verifications.projectNameMustBeNpmValid();
  await core.verifications.projectPathMustBeValid();

  ora().info(`Generating the ${humanName} project '${core.consts.projectName}' at '${core.consts.projectPath}'`);

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
      'ts-node-dev',
      'rimraf',
    ],
  });

  await core.actions.setupGit();
  await core.actions.setupHusky();
  await setupEslintrc({ cwd: core.consts.projectPath, flavor: 'ts' });


  ora().succeed(`${humanName} project '${core.consts.projectName}' created at '${core.consts.projectPath}'!`);
};

export default generator;
