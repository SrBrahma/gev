import editJsonFile from 'edit-json-file';
import { execa } from 'execa';
import fse from 'fs-extra';
import ora from 'ora';
import { FlavorFunction } from '../main/typesAndConsts.js';
import { checkGlobalPackageUpdate } from '../main/utils.js';





// TODO expo wont remove the created dir on error. (no template on expo-cli did it.)
//   my cleaunup should handle this.



const flavorExpo: FlavorFunction = async (core) => {

  await core.verifications.projectPathMustBeValid();

  // Ensure expo-cli is installed at latest version. Will print some stuff.
  await checkGlobalPackageUpdate('expo-cli', { install: true });

  ora().info(`Generating the Expo project '${core.consts.projectName}' at '${core.consts.projectPath}'`);

  // --no-install Don't install yet! We will install all later.
  // -t expo-template-blank-typescript, got the right name from here https://github.com/expo/expo-cli/blob/master/packages/expo-cli/src/commands/init.ts
  await execa('expo', ['init', core.consts.projectPath, '--yarn', '--no-install', '-t', 'expo-template-blank-typescript'], { cwd: core.consts.cwd });

  // Remove the default App.tsx. We will create another one in src/App.tsx.
  await fse.remove(core.getPathInProjectDir('App.tsx'));


  await core.actions.applySemitemplate();

  core.add.changelog();
  core.add.readme({
    badges: {
      typescript: true,
    },
  });

  // Change App.tsx location: https://stackoverflow.com/a/54887872/10247962

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
      'react-native-shadow-2',
      'pagescrollview',

      // Expo
      'expo-font',
      'expo-app-loading',
      'expo-constants',
      'expo-navigation-bar',

      // Etc
      '@callstack/react-theme-provider',
      'react-native-size-matters',

      // Common
      '@expo/vector-icons',
      '@expo-google-fonts/roboto',

      // JS Utils
      'lodash',
    ],
    devDeps: [
      'typescript', // Expo template is currently using v4.0.0 instead of v4.2.4 >:(
      'eslint-config-gev',
    ],
  });

  // Edit package.json
  const packageJson = editJsonFile(core.getPathInProjectDir('package.json'));
  packageJson.set('scripts.lint', 'eslint --fix "src/**"');
  packageJson.set('main', './lib/main/index.js');
  packageJson.save();

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