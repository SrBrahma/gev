import ora from 'ora';
import type { FlavorFunction } from '../main/types.js';

const humanName = 'Expo Package';

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

  await core.actions.addPackages({
    devDeps: ['@types/node', '@types/react-native', 'react-native', 'rimraf', 'react'],
  });

  await core.actions.setupCommonStuff({
    eslint: { eslintFlavor: 'react-native-ts' },
  });

  ora().succeed(
    `${humanName} project '${core.consts.projectName}' created at '${core.consts.projectPath}'!`,
  );
};

export default generator;
