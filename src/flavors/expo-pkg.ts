import editJsonFile from 'edit-json-file';
import ora from 'ora';
import type { FlavorFunction } from '../main/typesAndConsts.js';



const flavorExpoPkg: FlavorFunction = async (core) => {

  core.verifications.projectNameMustBeNpmValid();
  await core.verifications.projectPathMustBeValid();

  ora().info(`Generating the Expo Package project '${core.consts.projectName}' at '${core.consts.projectPath}'`);

  await core.actions.setProjectDirectory();
  await core.actions.applySemitemplate();

  core.add.license();
  core.add.changelog();
  core.add.readme({
    badges: {
      npm: true,
      prWelcome: true,
      typescript: true,
    },
  });


  await core.actions.addPackages({
    devDeps: [
      'typescript',
      'react-native',
      'react', // Without latest, let npm decide it.
      '@types/react-native', // Includes @types/react
      'eslint-config-gev',
    ],
  });



  // ora().info('Adding sandbox directory, via gev expo');
  // const sandboxCore = new Core({
  //   cwd: core.consts.projectPath,
  //   receivedProjectName: 'sandbox',
  //   flavor: 'expo',
  //   installPackages: core.consts.installPackages,
  //   cleanOnError: core.consts.cleanOnError,
  // });
  // await sandboxCore.run();

  // Remove the .git in the sandbox that expo created.
  // await fse.remove(sandboxCore.getPathInProjectDir('.git'));

  // Edit package.json. Note that the package.json was already set on semitemplate step.
  const packageJson = editJsonFile(core.getPathInProjectDir('package.json'));
  packageJson.save();

  ora().succeed(`Expo package project '${core.consts.projectName}' created at '${core.consts.projectPath}'!`);

};

export default flavorExpoPkg;