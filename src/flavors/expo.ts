import { execa } from 'execa';
import fse from 'fs-extra';
import ora from 'ora';
import { setupEslintrc } from '../core/methods/setupEslint.js';
import { editPackageJson } from '../core/utils/utils.js';
import type { FlavorFunction } from '../main/types.js';
import { checkGlobalPackageUpdate } from '../main/utils.js';


// TODO expo wont remove the created dir on error. (no template on expo-cli did it.)
//   my cleaunup should handle this.

const humanName = 'Expo';

const generator: FlavorFunction = async (core) => {

  await core.verifications.projectPathMustBeValid();

  // Ensure expo-cli is installed at latest version. Will print some stuff.
  await checkGlobalPackageUpdate('expo-cli', { install: true });

  ora().info(`Generating the ${humanName} project '${core.consts.projectName}' at '${core.consts.projectPath}'`);

  // --no-install Don't install yet! We will install all later.
  // -t expo-template-blank-typescript, got the right name from here https://github.com/expo/expo-cli/blob/master/packages/expo-cli/src/commands/init.ts
  await execa('expo', ['init', core.consts.projectPath, '--no-install', '-t', 'expo-template-blank-typescript'], { cwd: core.consts.cwd });

  // Remove the default App.tsx. We will create another one in src/main/App.tsx.
  await fse.remove(core.getPathInProjectDir('App.tsx'));

  core.add.changelog();

  await core.actions.applySemitemplate();

  await core.actions.addPackages({
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
      'expo-splash-screen',
      'expo-constants',
      'expo-navigation-bar',
      'expo-status-bar',
      '@expo/vector-icons',

      // EAS
      'expo-dev-client',

      'jest', // Install expo-compatible version: https://docs.expo.dev/guides/testing-with-jest/
      'jest-expo',
    ],
    devDeps: [
      'typescript',
      'eslint-config-gev',

      // Jest configs must be on jest.config.js when possible, not on package.json.
      // Link the source when possible so we can track it down later.
      // https://docs.expo.dev/guides/testing-with-jest/
      // https://github.com/callstack/react-native-testing-library
      '@testing-library/react-native',
      '@testing-library/jest-native',
      'ts-jest',
      'react-test-renderer@17',
      '@types/jest',

      '@expo/config',
    ].filter((e) => e !== 'jest'), // remove jest from dev install, will be installed above.
  });

  editPackageJson({
    projectPath: core.consts.projectPath,
    name: core.consts.projectName,
    githubAuthor: core.consts.githubAuthor,
    data: {
      main: './src/main/index.js',
      'scripts.test': 'jest',
      'scripts.test:watch': 'jest --watchAll',
      'scripts.start': 'expo start',
      'scripts.start:clean': 'expo start -c',
      'scripts.b:dev': 'eas build --platform all --profile development',
      'scripts.b:dev:ios': 'eas build --platform ios --profile development',
      'scripts.b:dev:android': 'eas build --platform android --profile development',
      'scripts.b:prev': 'eas build --platform all --profile preview',
      'scripts.b:prev:ios': 'eas build --platform ios --profile preview',
      'scripts.b:prev:android': 'eas build --platform ios --profile preview',
      'scripts.b:prod': 'eas build --platform all --profile production',
      'scripts.b:prod:ios': 'eas build --platform ios --profile production',
      'scripts.b:prod:android': 'eas build --platform android --profile production',
      'scripts.s:prod': 'eas build --platform all --profile production --auto-submit',
      'scripts.s:prod:ios': 'eas build --platform ios --profile production --auto-submit',
      'scripts.s:prod:android': 'eas build --platform android --profile production --auto-submit',
      'scripts.lint': 'tsc --noemit && eslint --fix \\"src/**\\"',
    },
  });

  await core.actions.setupGit();
  await core.actions.setupHusky();
  // This will certainly throw as .eslintrc will exist. Check what expo uses before setting the force flag here.
  await setupEslintrc({ cwd: core.consts.projectPath, flavor: 'react-native-ts' });

  // Semitemplate will automatically remove the default App.tsx it creates on s
  // Done!
  ora().succeed(`${humanName} project '${core.consts.projectName}' created at '${core.consts.projectPath}'!`);

  // Copy/paste from what Expo prints at the end, without the cd to the new project.
  console.log(`\nTo run your project, navigate to the directory and run one of the following npm commands:
  - npm start # you can open iOS, Android, or web from here, or run them directly with the commands below.
  - npm run android
  - npm run ios # requires an iOS device or macOS for access to an iOS simulator
  - npm run web`);

};

export default generator;