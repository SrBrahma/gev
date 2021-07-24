import type { FlavorFunction } from '../typesAndConsts';
import editJsonFile from 'edit-json-file';
import { Core } from '../core/core';
import ora from 'ora';
import fse from 'fs-extra';



const flavorExpoPkg: FlavorFunction = async (core) => {

  core.verifications.projectNameMustBeNpmValid();
  await core.verifications.projectPathMustBeValid();

  ora().info(`Generating the Expo Package project '${core.consts.projectName}' at '${core.consts.projectPath}'`);

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
    devDeps: [
      'typescript@latest',
      'react-native@latest',
      'react', // Without latest, let npm decide it.
      '@types/react-native', // Includes @types/react
      'eslint@latest',
      'eslint-config-gev@latest',
      'eslint-plugin-react@latest',
      'eslint-plugin-react-hooks@latest',
      'eslint-plugin-react-native@latest',
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

  // Remove the .git in the sandbox that expo created.
  await fse.remove(sandboxCore.getPathInProjectDir('.git'));

  ora().succeed(`Expo package project '${core.consts.projectName}' created at '${core.consts.projectPath}'!`);

  // fse.symlink() // symlink to src inside src.
  // in expo, should add watch to the ../src.
};

export default flavorExpoPkg;