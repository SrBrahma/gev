#! /usr/bin/env node

import { programName, programVersion } from './main/consts.js';
import chalk from 'chalk';

// Move below to exe/cli flavor.
async function run() {
  console.log('Howdy World!');
}

void run().catch(err => {
  let msg;
  if (typeof err === 'object' && err !== null)
    msg = err.message;
  else
    msg = err;
  console.error(`\n${chalk.redBright('An error happened!')} ${chalk.white('-')} ${chalk.yellow(`[${programName} v${programVersion}]`)}\n`);
  console.error(msg);
  process.exit(1); // Good for external tools.
});
