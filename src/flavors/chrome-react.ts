import ora from 'ora';
import { commonTestDeps } from '../core/utils/utils.js';
import type { FlavorFunction } from '../main/types.js';

const humanName = 'Chrome Extension';

const generator: FlavorFunction = async (core) => {
  await core.verifications.projectPathIsValid();

  ora().info(
    `Generating the ${humanName} project '${core.consts.projectName}' at '${core.consts.projectPath}'`,
  );

  core.actions.setProjectDirectory();

  core.add.license();
  core.add.changelog();

  await core.actions.applySemitemplate();

  await core.actions.addPackages({
    deps: ['react', 'react-dom'],
    devDeps: [
      '@types/chrome',
      '@types/react',
      '@types/react-dom',
      'copy-webpack-plugin',
      'rimraf',
      'ts-loader',
      'webpack',
      'webpack-cli',
      'webpack-merge',
      '@types/react',
      ...commonTestDeps,
    ],
  });

  await core.actions.setupCommonStuff({
    eslint: { eslintFlavor: 'react-ts' },
  });

  ora().succeed(
    `${humanName} project '${core.consts.projectName}' created at '${core.consts.projectPath}'!`,
  );
};

export default generator;
