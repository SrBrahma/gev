import type { FlavorFunction } from '../../typesAndConsts';
import editJsonFile from 'edit-json-file';

export const flavorTypescript: FlavorFunction = async (core) => {

  core.verifications.projectNameMustBeNpmValid();

  core.verifications.projectDirMustBeValid();

  console.log(`Generating the Typescript package "${core.consts.projectName}" at "${core.consts.projectPath}"...`);

  core.actions.setProjectDirectory();

  await core.actions.applyTemplate();

  core.add.changelog();
  core.add.readme();


  // Edit package.json
  const packageJson = editJsonFile(core.getPath('package.json'));
  packageJson.set('name', core.consts.projectName);
  packageJson.save();


  // To install the latest. The semitemplate deps don't matter too much,
  await core.actions.addPackages({
    devDeps: [
      'typescript@latest',
      'ts-node-dev@latest',
      // 'ts-node@latest', // Add it for `once` script or wait https://github.com/wclr/ts-node-dev/issues/263

      'eslint@latest',
      'eslint-config-gev@latest',
      'eslint-plugin-react@latest',
      '@typescript-eslint/eslint-plugin@latest',
      '@typescript-eslint/parser@latest',
    ],
  });

  console.log(`Package "${core.consts.projectName}" created at "${core.consts.projectPath}"!`);
};
