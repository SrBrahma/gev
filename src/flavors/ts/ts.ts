import type { FlavorFunction } from '../../typesAndConsts';
import editJsonFile from 'edit-json-file';
import ora from 'ora';

export const flavorTypescript: FlavorFunction = async (core) => {

  core.verifications.projectNameMustBeNpmValid();

  await core.verifications.projectPathMustBeValid();

  ora().info(`Generating the Typescript package "${core.consts.projectName}" at "${core.consts.projectPath}"...`);

  await core.actions.setProjectDirectory();

  await core.actions.applyTemplate();

  core.add.changelog();
  core.add.readme();


  // Edit package.json
  const packageJson = editJsonFile(core.getPathInProjectDir('package.json'));
  packageJson.set('name', core.consts.projectName);
  packageJson.save();


  // To install the latest. The semitemplate deps don't matter too much,
  await core.actions.addPackages({
    devDeps: [
      'typescript@latest',
      'ts-node-dev@latest',
      'eslint@latest',
      'eslint-config-gev@latest',
      '@typescript-eslint/eslint-plugin@latest',
      '@typescript-eslint/parser@latest',
      // 'ts-node@latest', // Add it for `once` script or wait https://github.com/wclr/ts-node-dev/issues/263
    ],
  });

  ora().succeed(`Package "${core.consts.projectName}" created at "${core.consts.projectPath}"!`);
};
