#!/usr/bin/env bun
import path from 'path';
import chalk from 'chalk';
import { Argument, Command } from 'commander';
import inquirer from 'inquirer';
import compareSemver from 'semver-compare';
import {
  configData,
  getAvailableFlavors,
  loadConfigs,
  pathFromRoot,
  setConfigs,
  version,
} from './utils.js';

const program = new Command();

program
  .name('gev') // So it appears in the usage help
  .description(
    'Effortlessly creates slightly opionated projects boilerplates within a single command.',
  )
  .version(version, '-v, --version', 'Output the version number.') // Just capitalize the first letter of description.
  .helpOption('-h, --help', 'Display help for command.') // Just capitalize the first letter of description.
  .showHelpAfterError()
  .option('-c, --no-check-latest', "Won't check if is using the latest version of gev.")
  .option('--config', 'Prompt for configs even if they were already set.')
  // https://github.com/tj/commander.js/issues/518#issuecomment-872769249
  .addArgument(new Argument('<template>', `The project template.`).choices(getAvailableFlavors())) // Will also print in the usage the possible options
  .argument('[projectName]', 'The name of the new project.')
  .action(async () => {
    // Commander transforms --no-install into install, with default value of true to install.
    // https://github.com/tj/commander.js#other-option-types-negatable-boolean-and-booleanvalue
    const opts = program.opts<{
      install: boolean;
      checkLatest: boolean;
      config: boolean;
    }>();
    const [template, projectName = '.'] = program.args as [string, string | undefined];

    const projectPath = path.resolve(projectName);

    if (opts.checkLatest) {
      console.log('Ensuring latest version');
      // Can't use latest-version pkg as bun doesn't support its internal `got` packaget yet. Using CLI instead.
      const latestVer = Bun.spawnSync(['bunx', 'latest-version-cli', 'gev']).stdout.toString();

      if (compareSemver(version, latestVer) === -1) {
        console.log(
          `The current version of gev [${chalk.grey(
            version,
          )}] is lower than the latest one [${chalk.yellow(
            latestVer,
          )}]. Recalling gev with @latest.\n`,
        );

        Bun.spawn(['bunx', `gev@${latestVer}`, '--no-check-latest', ...process.argv.slice(2)], {
          stdio: ['inherit', 'inherit', 'inherit'],
          cwd: pathFromRoot(),
        });

        return;
      }
    }

    // These are no longer being used atm. TODO use it.
    loadConfigs();

    const areConfigsSet = !!configData.githubAuthor;

    if ((opts.config || !areConfigsSet) && process.stdin.isTTY) {
      const input = await inquirer.prompt<{ githubAuthor: string }>([
        {
          name: 'githubAuthor',
          type: 'input',
          default: configData.githubAuthor,
          message: 'Who is the GitHub Author of this project?',
        },
      ]);

      setConfigs(input);
    }

    console.log('Setting up template');

    Bun.spawnSync(['bun', 'create', template, projectPath], {
      stdio: ['ignore', 'inherit', 'inherit'],
      cwd: pathFromRoot(),
    });
  });

program.parseAsync().catch((err: Error) => {
  console.error(
    `\n${chalk.redBright('An error happened!')} ${chalk.white('-')} ${chalk.yellow(
      `[gev v${version}]`,
    )}\n`,
  );

  throw err;
});
