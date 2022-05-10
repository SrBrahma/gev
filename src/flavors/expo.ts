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

  // Remove the default App.tsx. We will create another one in src/main/App.tsx.
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
      'react-native-svg-transformer', // To import svgs
      'react-native-shadow-2',

      // Expo
      'expo-font',
      'expo-app-loading',
      'expo-constants',
      'expo-navigation-bar',

      // Etc
      'react-native-size-matters',

      // Common
      'lodash', // Not really needed. In index we use this to clone console.
      'react-native-reanimated', // Usually there are libs using this
      '@expo-google-fonts/roboto', // TODO remove this

      // Gev
      'react-native-gev',
      'expo-image-picker', // TODO remove this
      '@expo/vector-icons',
      'expo-status-bar',

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

  // Edit package.json.
  // Those functions were regex'ed by entering the desired package.json scripts with the follow replace:
  // "(.*?)": "(.*)" and packageJson.set('scripts.$1', '$2'). Could be better!
  const packageJson = editJsonFile(core.getPathInProjectDir('package.json'));
  packageJson.set('main', './index.js');
  packageJson.set('scripts.test', 'jest --watchAll'),
  packageJson.set('scripts.start', 'expo start'),
  packageJson.set('scripts.start:clean', 'expo start -c'),
  packageJson.set('scripts.b:dev', 'eas build --platform android --profile development'),
  packageJson.set('scripts.b:prev', 'eas build --platform all --profile preview'),
  packageJson.set('scripts.b:prev:ios', 'eas build --platform ios --profile preview'),
  packageJson.set('scripts.b:prev:android', 'eas build --platform ios --profile preview'),
  packageJson.set('scripts.b:prod', 'eas build --platform all --profile production'),
  packageJson.set('scripts.b:prod:ios', 'eas build --platform ios --profile production'),
  packageJson.set('scripts.b:prod:android', 'eas build --platform android --profile production'),
  packageJson.set('scripts.bs:prod', 'eas build --platform all --profile production --auto-submit'),
  packageJson.set('scripts.bs:prod:ios', 'eas build --platform ios --profile production --auto-submit'),
  packageJson.set('scripts.bs:prod:android', 'eas build --platform android --profile production --auto-submit'),
  packageJson.set('scripts.lint', 'tsc --noemit && eslint --fix \\"src/**\\"');

  packageJson.save();

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