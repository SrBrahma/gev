import editJsonFile from 'edit-json-file';
import ora from 'ora';
import type { FlavorFunction } from '../main/typesAndConsts.js';



// To be reused
export const typescriptCommonDevDeps = [
  'typescript',
  'eslint-config-gev',
  '@types/node',
  'jest',
  'ts-jest',
  '@types/jest',
];


const flavorTypescript: FlavorFunction = async (core) => {

  core.verifications.projectNameMustBeNpmValid();
  await core.verifications.projectPathMustBeValid();

  ora().info(`Generating the Typescript project '${core.consts.projectName}' at '${core.consts.projectPath}'`);

  await core.actions.applySemitemplate();

  core.add.license();
  core.add.changelog();
  core.add.readme({
    badges: { npm: true, prWelcome: true, typescript: true },
  });

  // Edit package.json. Note that the package.json was already set on semitemplate step.
  const packageJson = editJsonFile(core.getPathInProjectDir('package.json'));
  packageJson.set('name', core.consts.projectName);
  packageJson.save();

  // To install the latest. The semitemplate deps don't matter too much,
  await core.actions.addPackages({
    devDeps: [
      ...typescriptCommonDevDeps,
      'ts-node-dev',
      'rimraf',
    ],
  });

  await core.actions.setupGit();

  ora().succeed(`Typescript project '${core.consts.projectName}' created at '${core.consts.projectPath}'!`);
};

export default flavorTypescript;
