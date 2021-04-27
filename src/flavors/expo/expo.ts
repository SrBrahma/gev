import execa from 'execa';
import { FlavorFunction } from '../../typesAndConsts';
import { checkPackageUpdate } from '../../utils';
import fs from 'fs';


// TODO expo wont remove the created dir on error. (no template on expo-cli did it.)
//   my cleaunup should handle this.



export const flavorExpo: FlavorFunction = async (core) => {

  // Ensure expo-cli is installed at latest version. Will print some stuff.
  await checkPackageUpdate('expo-cli', { install: true });

  core.verifications.projectDirMustBeValid();

  console.log(`Generating the expo project "${core.consts.projectName}" at "${core.consts.projectPath}"...`);

  const target = core.consts.currentDirectoryIsTarget ? '.' : core.consts.projectName;

  // --no-install Don't install yet!
  // -t expo-template-blank-typescript, got the right name from here https://github.com/expo/expo-cli/blob/master/packages/expo-cli/src/commands/init.ts
  await execa('expo', ['init', target, '--npm', '--no-install', '-t', 'expo-template-blank-typescript']);

  // Remove the default App.tsx. We will create another one in src/App.tsx.
  fs.unlinkSync(core.getPath('App.tsx'));


  core.actions.applyTemplate();

  core.add.changelog();
  core.add.readme();

  // Change App.tsx location: https://stackoverflow.com/a/54887872/10247962

  await core.actions.addPackages({
    devDeps: [
      'typescript@latest', // Expo template is currently using v4.0.0 instead of v4.2.4 >:(
      'eslint@latest',
      'eslint-config-gev@latest',
      'eslint-plugin-react@latest',
      'eslint-plugin-react-hooks@latest',
      'eslint-plugin-react-native@latest',
      '@typescript-eslint/eslint-plugin@latest',
      '@typescript-eslint/parser@latest',
    ],
  });

  // const packageJson = editJsonFile(core.getPath('package.json'));


  // Done!
  console.log(`Expo project "${core.consts.projectName}" created at "${core.consts.projectPath}"!`);

  // Copy/paste from what Expo prints at the end, without the cd to the new project.
  console.log(`To run your project, navigate to the directory and run one of the following npm commands:
  - npm start # you can open iOS, Android, or web from here, or run them directly with the commands below.
  - npm run android
  - npm run ios # requires an iOS device or macOS for access to an iOS simulator
  - npm run web`);

};