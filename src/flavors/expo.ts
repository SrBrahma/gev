import editJsonFile from 'edit-json-file';
import { execa } from 'execa';
import fse from 'fs-extra';
import ora from 'ora';
import type { FlavorFunction } from '../main/typesAndConsts.js';
import { checkGlobalPackageUpdate } from '../main/utils.js';
import { typescriptCommonDevDeps } from './ts.js';


// TODO expo wont remove the created dir on error. (no template on expo-cli did it.)
//   my cleaunup should handle this.


const flavorExpo: FlavorFunction = async (core) => {

  await core.verifications.projectPathMustBeValid();

  // Ensure expo-cli is installed at latest version. Will print some stuff.
  await checkGlobalPackageUpdate('expo-cli', { install: true });

  ora().info(`Generating the Expo project '${core.consts.projectName}' at '${core.consts.projectPath}'`);

  // --no-install Don't install yet! We will install all later.
  // -t expo-template-blank-typescript, got the right name from here https://github.com/expo/expo-cli/blob/master/packages/expo-cli/src/commands/init.ts
  await execa('expo', ['init', core.consts.projectPath, '--no-install', '-t', 'expo-template-blank-typescript'], { cwd: core.consts.cwd });

  // Remove the default App.tsx. We will create another one in src/App.tsx.
  await fse.remove(core.getPathInProjectDir('App.tsx'));


  await core.actions.applySemitemplate();

  core.add.changelog();
  core.add.readme({
    badges: {
      typescript: true,
    },
  });

  await core.actions.addPackages({
    packageManager: 'yarn',
    isExpo: true,
    deps: [
      // Navigation
      '@react-navigation/native',
      '@react-navigation/bottom-tabs',
      'react-native-screens',
      'react-native-safe-area-context',
      '@react-navigation/stack',
      'react-native-gesture-handler', // For stack

      // Visual
      'react-native-svg',
      'react-native-shadow-2',

      // Stuff
      'react-native-gev',

      // Expo
      'expo-font',
      'expo-app-loading',
      'expo-constants',
      'expo-navigation-bar',

      // Etc
      'react-native-size-matters',

      // Common
      '@expo/vector-icons',
      '@expo-google-fonts/roboto',

      'jest', // Install expo-compatible version: https://docs.expo.dev/guides/testing-with-jest/
      'jest-expo',
    ],
    devDeps: [
      ...typescriptCommonDevDeps,
      // Jest configs must be on jest.config.js when possible, not on package.json.
      // Link the source when possible so we can track it down later.
      // https://docs.expo.dev/guides/testing-with-jest/
      // https://github.com/callstack/react-native-testing-library
      '@testing-library/react-native',
      'react-test-renderer',
      '@testing-library/jest-native',
    ].filter((e) => e !== 'jest'), // remove jest from dev install, will be installed above.
  });

  // Edit package.json
  const packageJson = editJsonFile(core.getPathInProjectDir('package.json'));
  packageJson.set('scripts.lint', 'tsc --noemit && eslint --fix "src/**"');
  packageJson.set('scripts.test', 'jest --watchAll');
  packageJson.set('main', './src/main/index.js');
  packageJson.save();

  // Edit app.json
  const appJson = editJsonFile(core.getPathInProjectDir('app.json'));
  appJson.set('expo.splash.resizeMode', 'cover');
  appJson.save();

  await core.actions.setupGit();

  // Semitemplate will automatically remove the default App.tsx it creates on s
  // Done!
  ora().succeed(`Expo project '${core.consts.projectName}' created at '${core.consts.projectPath}'!`);

  // Copy/paste from what Expo prints at the end, without the cd to the new project.
  console.log(`\nTo run your project, navigate to the directory and run one of the following npm commands:
  - npm start # you can open iOS, Android, or web from here, or run them directly with the commands below.
  - npm run android
  - npm run ios # requires an iOS device or macOS for access to an iOS simulator
  - npm run web`);

};

export default flavorExpo;