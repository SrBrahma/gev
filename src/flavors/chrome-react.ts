import ora from 'ora';
import { setupEslintrc } from '../core/methods/setupEslint.js';
import { editPackageJson } from '../core/utils/utils.js';
import type { FlavorFunction } from '../main/types.js';

const humanName = 'Chrome Extension';

const generator: FlavorFunction = async (core) => {
  await core.verifications.projectPathMustBeValid();

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
      '@types/jest',
      '@types/react',
      '@types/react-dom',
      'copy-webpack-plugin',
      'jest',
      'rimraf',
      'ts-jest',
      'ts-loader',
      'typescript',
      'webpack',
      'webpack-cli',
      'webpack-merge',
      '@types/react',
      'eslint-config-gev',
    ],
  });

  editPackageJson({
    projectPath: core.consts.projectPath,
    name: core.consts.projectName,
    githubAuthor: core.consts.githubAuthor,
  });

  await core.actions.setupGit();
  await core.actions.setupHusky();
  await setupEslintrc({ cwd: core.consts.projectPath, flavor: 'react-ts' });

  ora().succeed(
    `${humanName} project '${core.consts.projectName}' created at '${core.consts.projectPath}'!`,
  );
};

export default generator;
