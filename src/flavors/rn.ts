import path from 'path';
import editJsonFile from 'edit-json-file';
import { execa } from 'execa';
import fse from 'fs-extra';
import ora from 'ora';
import { editPackageJson } from '../core/utils/utils.js';
import type { FlavorFunction } from '../main/typesAndConsts.js';


// TODO expo wont remove the created dir on error. (no template on expo-cli did it.)
//   my cleaunup should handle this.


const flavorReactNative: FlavorFunction = async (core) => {

  await core.verifications.projectPathMustBeValid();

  ora().info(`Generating the React Native project '${core.consts.projectName}' at '${core.consts.projectPath}'`);

  // --skip-install Don't install yet! We will install all later.
  await execa('npx', ['react-native', 'init', core.consts.projectName, '--template', 'react-native-template-typescript', '--skip-install'], { cwd: core.consts.parentDirPath });

  // Remove the default App.tsx. We will create another one in src/main/App.tsx.
  await fse.remove(core.getPathInProjectDir('App.tsx'));

  // Remove the prettier file created by the template. We don't use it.
  await fse.remove(core.getPathInProjectDir('.prettierrc.js'));


  await core.actions.applySemitemplate();

  core.add.changelog();

  // Remove unused dev dependencies that were added by the template.
  // The eslint ones are already added by our eslint config package.
  const pkgJson = editJsonFile(path.join(core.consts.projectPath, 'package.json'));
  [
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint/parser',
    '@react-native-community/eslint-config',
  ].forEach((devDep) => pkgJson.unset(`devDependencies.${devDep}`));
  pkgJson.save();


  await core.actions.addPackages({
    packageManager: 'yarn',
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

      // Etc
      'react-native-size-matters',
    ],
    devDeps: [
      'eslint-config-gev',
      'typescript', // Ensure latest
    ],
  });

  editPackageJson({
    projectPath: core.consts.projectPath,
    name: core.consts.projectName,
    githubAuthor: core.consts.githubAuthor,
    data: {
      'scripts.test:watch': 'jest --watchAll',
    },
  });

  await core.actions.setupGit();

  ora().succeed(`React Native project '${core.consts.projectName}' created at '${core.consts.projectPath}'!`);

  // Copy/paste from what React Native prints at the end.
  console.log(`\nRun instructions for iOS:
  ??? cd "/home/hb/Dev/TestRN" && npx react-native run-ios
  - or -
  ??? Open TestRN/ios/TestRN.xcodeproj in Xcode or run "xed -b ios"
  ??? Hit the Run button

Run instructions for Android:
  ??? Have an Android emulator running (quickest way to get started), or a device connected.
  ??? cd "/home/hb/Dev/TestRN" && npx react-native run-android

Run instructions for Windows and macOS:
  ??? See https://aka.ms/ReactNative for the latest up-to-date instructions.
`);

};

export default flavorReactNative;