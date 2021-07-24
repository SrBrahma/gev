import type { FlavorFunction } from '../typesAndConsts';
import editJsonFile from 'edit-json-file';
import ora from 'ora';



export const typescriptDevDeps = [
  'typescript@latest',
  'ts-node-dev@latest',

  'eslint@latest',
  'eslint-config-gev@latest',
  '@typescript-eslint/eslint-plugin@latest',
  '@typescript-eslint/parser@latest',

  '@types/node',

  'jest',
  'ts-jest',
  '@types/jest',
];


const flavorTypescript: FlavorFunction = async (core) => {

  core.verifications.projectNameMustBeNpmValid();

  await core.verifications.projectPathMustBeValid();

  ora().info(`Generating the Typescript project '${core.consts.projectName}' at '${core.consts.projectPath}'`);

  await core.actions.setProjectDirectory();

  await core.actions.applySemitemplate();

  core.add.changelog();
  core.add.readme({
    badges: {
      npm: true,
      prWelcome: true,
      typescript: true,
    },
  });


  // Edit package.json
  const packageJson = editJsonFile(core.getPathInProjectDir('package.json'));
  packageJson.set('name', core.consts.projectName);
  packageJson.save();


  // To install the latest. The semitemplate deps don't matter too much,
  await core.actions.addPackages({
    devDeps: typescriptDevDeps,
  });

  ora().succeed(`Typescript project '${core.consts.projectName}' created at '${core.consts.projectPath}'!`);
};

export default flavorTypescript;
