#!/usr/bin/env node
// About above: https://docs.npmjs.com/cli/v7/configuring-npm/package-json#bin

// TODO add support for react & react-native flavors (args like --react or --native)
//   This isn't a template for react and react-native projects (at most templates for packages for them).
//   For react/native real project templates, will require another project, that may/will include this one.
// TODO add --jest arg to include jest testing
// TODO add ts-node-dev pkg?
// TODO add tools, for eg add badges to README.
//   Maybe an argument for interactive setup to add stuff like that.
//   ^ Having an option to repopulate info badges is good, as dev may change repo name etc.
// TODO license to README? (also change it in package.json) MIT as default?
// TODO add silent argument
// TODO way to check package name availability? Also must check the lower-case of the package name, as those online
//   name checkers won't validate it.
// TODO arg to just do a step, to fix/create a new file (like add eslint to existing project). Maybe git integration to tag it?
// TODO add -d --debug arg for more logs.
// TODO allow usage of specific version (npx prob allow this. see how and write on readme)
// TODO support "." as packageName, to use current dir instead of leaving it blank.
// TODO Github integration
// TODO https://www.npmjs.com/package/update-notifier
// TODO: CLI coloring https://www.npmjs.com/package/chalk
// TODO prettier tasks https://www.npmjs.com/package/listr
// TODO Maybe rename flavor to something else? Flavor could be like, I will have a Expo project,
//   with mobx flavor. It could have multiple flavors, like `npx gev expo [mobx] newProj`
// TODO npx flavor = TS, commander, chalk, listr
// TODO add time that took to generate
// TODO npm gev gev - Boilerplate so others can create their flavors etc. They would need to import Core.



import { Command } from 'commander';
import { flavorsArray, Flavor, currentDirectoryRegex } from './typesAndConsts';
import { Core } from './core';


const VERSION = (require('../package.json') as Record<string, unknown>).version as string;
const program = new Command();


// TODO add -v as alias to -V/--version.
program
  .name('gev') // So it appears in the usage help
  .version(VERSION)
  .option('-n, --no-install', 'Don\'t install the npm packages after setting the template.')
  .arguments('<flavor> [projectName]')
  .description('Effortlessly creates slightly opionated projects boilerplates within a single command', {
    flavor: `What kind of project it should be. Accepted: ${flavorsArray.join(', ')}`,
    projectName: 'The name of the new project. A new directory will be created and used only if it doesn\'t exists. If ommited or ".", will use the current directory and its name, if empty.',
  })
  .action(async () => {
    // Commander transforms --no-install into install, with default value of true to install.
    // https://github.com/tj/commander.js#other-option-types-negatable-boolean-and-booleanvalue
    const { install: installPackages } = program.opts() as {
      install: boolean
    };
    // Commander says all items of args are strings, but they may be undefined if ommited.
    const [flavorArg, projectNameArg = '.'] = program.args;


    if (!flavorsArray.includes(flavorArg as any)) { // as any because ts sucks with constArrays functions.
      throw (`Invalid flavor. Must be one of the following: ${flavorsArray.join(', ')}`);
    }
    const flavor = flavorArg as Flavor;

    // Converts '.' or './' to undefined. Undefined means to use the cwd as project name.
    const receivedProjectName: string | undefined =
      currentDirectoryRegex.test(projectNameArg) ? undefined : projectNameArg;


    const core = new Core({
      cwd: process.cwd(),
      flavor,
      receivedProjectName,
      installPackages,

    });

    await core.main.run();

  });


// Commander don't print the usage automatically if too few args
// https://stackoverflow.com/a/44419466/10247962
if (process.argv.length < 3)
  program.help();


program.parseAsync().catch(err => {
  // const msg = err.message;
  console.error(`An error happened! - [gev v${VERSION}]\n`);
  console.error(err); // TODO add package version
});
