#!/usr/bin/env node
// About above: https://docs.npmjs.com/cli/v7/configuring-npm/package-json#bin

// TODO add --jest arg to include jest testing
// TODO add ts-node-dev pkg?
// TODO add tools, for eg add badges to README.
//   Maybe an argument for interactive setup to add stuff like that.
//   ^ Having an option to repopulate info badges is good, as dev may change repo name etc.
// TODO way to check package name availability?
// TODO license to README? (also change it in package.json) MIT as default?
// TODO arg to just do a step, to fix/create a new file (like add eslint to existing project). Maybe git integration to tag it?
// TODO Github integration
// TODO prettier tasks https://www.npmjs.com/package/listr
// TODO add -d --debug arg for more logs.
// TODO add silent argument
// TODO Maybe rename flavor to something else? Flavor could be like, I will have a Expo project,
//   with mobx flavor. It could have multiple flavors, like `npx gev expo [mobx] newProj`
// TODO add time that took to generate
// TODO npm gev gev - Boilerplate so others can create their flavors etc. They would need to import Core.

import { Argument, Command } from 'commander';
import { currentDirectoryRegex } from './typesAndConsts';
import { Core } from './core/core';
import latestVersion from 'latest-version';
import execa from 'execa';
import chalk from 'chalk';
import ora from 'ora';
import compareSemver from 'semver-compare';
import { availableFlavors } from './core/flavors';

const VERSION = (require('../package.json') as Record<string, unknown>).version as string;
const program = new Command();


// TODO add -v as alias to -V/--version.
program
  .name('gev') // So it appears in the usage help
  .version(VERSION, '-v, --version', 'Output the version number.') // Just capitalize the first letter of description.
  .helpOption('-h, --help', 'Display help for command.') // Just capitalize the first letter of description.
  .option('-n, --no-install', 'Don\'t install the npm packages after setting the template.')
  .option('-c, --no-check-latest', 'Won\'t check if is using the latest version of gev.')
  .option('-C, --no-clean-on-error', 'Won\'t clean the project being generated if an error happened.')
  // https://github.com/tj/commander.js/issues/518#issuecomment-872769249
  .addArgument(new Argument('<flavor>', `The project kind.`)
    .choices(availableFlavors)) // Will also print in the usage the possible options
  .argument('[projectName]', "The name of the new project. A new directory will be created and used only if it doesn't exists. If ommited or '.', will use the current directory and its name, if empty.")
  .description('Effortlessly creates slightly opionated projects boilerplates within a single command.')
  .showHelpAfterError()
  .action(async () => {
    // Commander transforms --no-install into install, with default value of true to install.
    // https://github.com/tj/commander.js#other-option-types-negatable-boolean-and-booleanvalue
    const {
      install: installPackages,
      checkLatest, cleanOnError,
    } = program.opts<{
      install: boolean; checkLatest: boolean; cleanOnError: boolean;
    }>();
    const [flavor, projectNameArg = '.'] = program.args as [string, string | undefined];

    if (checkLatest) {
      // Ensure latest version
      const spinner = ora().start('Ensuring latest version');
      const latestVer = await latestVersion('gev');
      if (compareSemver(VERSION, latestVer) === -1) {
        spinner.info(`The current version of gev [${chalk.keyword('brown')(VERSION)}] is lower than the latest available version [${chalk.yellow(latestVer)}]. Recalling gev with @latest.\n`); // additional \n

        const rawProgramArgs = process.argv.slice(2);
        await execa('npx', ['gev@latest', '--no-check-latest', ...rawProgramArgs], {
          stdio: 'inherit',
          env: {
            npm_config_yes: 'true', // https://github.com/npm/cli/issues/2226#issuecomment-732475247
          },
        }).catch(null); // ignore throw here. It will already be treated in the @latest.
        return;
      } else { // Same version. We are running the latest one!
        spinner.succeed();
      }
    }

    // Converts '.' or './' to undefined. Undefined means to use the cwd as project name.
    const receivedProjectName: string | undefined =
      currentDirectoryRegex.test(projectNameArg) ? undefined : projectNameArg;

    const core = new Core({
      flavor,
      receivedProjectName,
      installPackages,
      cleanOnError,
    });

    await core.run();
  })
;


program.parseAsync().catch(err => {
  let msg;
  if (typeof err === 'object' && err !== null)
    msg = err.message;
  else
    msg = err;
  console.error(`\n${chalk.redBright('An error happened!')} ${chalk.white('-')} ${chalk.yellow(`[gev v${VERSION}]`)}\n`);
  console.error(msg);
  process.exit(1); // Good for external tools.
});
