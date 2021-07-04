import type { FlavorFunction } from '../../typesAndConsts';
import editJsonFile from 'edit-json-file';
import { Core } from '../../core';
import ora from 'ora';

export const flavorExpoPkg: FlavorFunction = async (core) => {

  core.verifications.projectNameMustBeNpmValid();
  await core.verifications.projectPathMustBeValid();

  ora().info(`Generating the Expo Library package "${core.consts.projectName}" at "${core.consts.projectPath}"`);

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
      'react@latest',
      'react-native@latest',
      'typescript@latest',
      'eslint@latest',
      'eslint-config-gev@latest',
      'eslint-plugin-react@latest',
      '@typescript-eslint/eslint-plugin@latest',
      '@typescript-eslint/parser@latest',
    ],
  });

  ora().info('Adding sandbox directory, via gev expo');


  const sandboxCore = new Core({
    cwd: core.consts.projectPath,
    receivedProjectName: 'sandbox',
    flavor: 'expo',
    installPackages: core.consts.installPackages,
    cleanOnError: core.consts.cleanOnError,
  });
  await sandboxCore.run();

  ora().succeed(`expo-pkg package "${core.consts.projectName}" created at "${core.consts.projectPath}"!`);

  // fse.symlink() // symlink to src inside src.
  // in expo, should add watch to the ../src.
};

