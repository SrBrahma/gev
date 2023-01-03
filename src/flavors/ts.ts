import path from 'path';
import editJsonFile from 'edit-json-file';
import ora from 'ora';
import { commonTestDeps } from '../core/utils/utils.js';
import type { FlavorFunction } from '../main/types.js';

const humanName = 'Typescript ESM';

const generator: FlavorFunction = async (core) => {
  core.verifications.projectNameIsNpmValid();
  await core.verifications.projectPathIsValid();

  ora().info(
    `Generating the ${humanName} project '${core.consts.projectName}' at '${core.consts.projectPath}'`,
  );

  core.actions.setProjectDirectory();

  core.add.license();
  core.add.changelog();
  core.add.readme({
    badges: { npm: true, prWelcome: true, typescript: true },
  });

  await core.actions.applySemitemplate();

  // To install the latest. The semitemplate deps don't matter too much,
  await core.actions.addPackages({
    devDeps: ['@types/node', 'rimraf', 'ts-node', 'ts-node-dev', '@swc/core', ...commonTestDeps],
  });

  editJsonFile(path.join(core.consts.projectPath, 'tsconfig.json'))
    .set('ts-node', {
      swc: true,
      esm: true,
    })
    .save();

  await core.actions.setupCommonStuff({
    eslint: { flavor: 'ts', cjs: true },
  });

  ora().succeed(
    `${humanName} project '${core.consts.projectName}' created at '${core.consts.projectPath}'!`,
  );
};

export default generator;
