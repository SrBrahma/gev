import type { FlavorFunction } from '../../typesAndConsts';
import editJsonFile from 'edit-json-file';


// Add Heroku


export const flavorHapi: FlavorFunction = async (core) => {

  core.verifications.projectDirMustBeValid();

  console.log(`Generating the hapi project "${core.consts.projectName}" at "${core.consts.projectPath}"...`);

  core.actions.setProjectDirectory();

  core.actions.applyTemplate();

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

      'eslint@latest',
      'eslint-config-gev@latest',
      'eslint-plugin-react@latest',
      '@typescript-eslint/eslint-plugin@latest',
      '@typescript-eslint/parser@latest',

      '@types/hapi__hapi',
    ],
    deps: [
      '@hapi/hapi@latest',
    ],
  });

  console.log(`hapi project "${core.consts.projectName}" created at "${core.consts.projectPath}"!`);
};
