// Add to src/index.ts first line after applying ts template:
// writeFile()
// Add "bin": "./lib/index.js", from
// https://dev.to/9zemian5/basic-npx-command-line-tool-45k4


import type { FlavorFunction } from '../../src/typesAndConsts';
import editJsonFile from 'edit-json-file';
import ora from 'ora';
import { typescriptDevDeps } from '../../src/flavors/ts';





export const flavorTypescript: FlavorFunction = async (core) => {

  core.verifications.projectNameMustBeNpmValid();

  await core.verifications.projectPathMustBeValid();

  ora().info(`Generating the Typescript package '${core.consts.projectName}' at '${core.consts.projectPath}'...`);

  await core.actions.setProjectDirectory();

  await core.actions.applySemitemplate('ts'); // Use ts semitemplate and do the minor changes after.

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
  packageJson.set('bin', './lib/index.js'); // https://docs.npmjs.com/cli/v7/configuring-npm/package-json#bin
  packageJson.save();


  // To install the latest. The semitemplate deps don't matter too much,
  await core.actions.addPackages({
    deps: [
      'ora@latest', // Make them optional someday.
      'commander@latest',
      'prompts@latest',
    ],
    devDeps: [
      ...typescriptDevDeps,
      '@types/prompts',
    ],
  });

  ora().succeed(`Package '${core.consts.projectName}' created at '${core.consts.projectPath}'!`);
};
