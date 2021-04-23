import fs from 'fs';
import Path from 'path';
import yargs from 'yargs/yargs';
import { get_readme } from './resources/get_README';
import { get_gitignore } from './resources/get_gitignore';
import { get_CHANGELOG } from './resources/get_CHANGELOG';
import { get_eslintignore } from './resources/get_eslintignore';
import { get_eslintrc } from './resources/get_eslintrc';
import { change_tsconfig } from './resources/change_tsconfig';
import { get_index } from './resources/get_index';

import execa from 'execa';

import { changePackageJson } from './resources/change_package-json';
import validatePackageName from 'validate-npm-package-name';
import { sync as rimrafSync } from 'rimraf';


const VERSION = (require('../package.json') as Record<string, unknown>).version as string;

// const VERSION = import('../package.json')

// TODO add support for react & react-native flavors (args like --react or --native)
// This isn't a template for react and react-native projects (at most templates for packages for them).
// For react/native real project templates, will require another project, that may/will include this one.

// TODO add --jest arg to include jest testing
// TODO add ts-node-dev pkg?
// TODO add tools, for eg add badges to README.
// Maybe an argument for interactive setup to add stuff like that.
// ^ Having an option to repopulate info badges is good, as dev may change repo name etc.
// TODO license to README? (also change it in package.json) MIT as default?
// TODO add silent argument
// TODO way to check package name availability? Also must check the lower-case of the package name, as those online
// name checkers won't validate it.
// TODO arg to just do a step, to fix/create a new file (like add eslint to existing project). Maybe git integration to tag it?
// TODO add -d --debug arg for more logs.
// TODO add -v --version for current version.
// TODO allow usage of specific version (npx prob allow this. see how and write on readme)


const debug = false;

function debugLog(string: string) {
  if (debug)
    console.log(string);
}


let createdDir: boolean;
let createdAnyFile: boolean = false;
let pkgPath: string;

async function main() {

  const cwd = process.cwd();

  // const flavor: null | 'react' | 'react-native' = null;
  // /** If is react or react-native flavor */
  // const isReacty = (flavor === 'react' || flavor === 'react-native')

  /** For now, if should create declaration files etc. */
  // const isNpmPackage = true;

  // https://github.com/yargs/yargs/blob/HEAD/docs/examples.md#yargs-is-here-to-help-you
  const y = yargs(process.argv.slice(2))
    .usage('Usage: $0 [options] <package-name>')
    .options({
    })
    .demandCommand(0, 1);

  const receivedPackageName = y.argv._[0] ? String(y.argv._[0]) : undefined;

  // If not received, check if cwd is empty.
  if (!receivedPackageName) {
    const cwdIsEmpty = fs.readdirSync('./').length === 0; // https://stackoverflow.com/a/60676464/10247962
    if (!cwdIsEmpty) {
      // improve error message
      throw ('As no package name was passed, it was attempted to use the current working directory. However, the cwd is not empty!\n\n'
      + 'cwd=' + cwd);
    }
  }

  /** The last segment of cwd */
  const currentDirName = Path.basename(cwd);
  const pkgName = receivedPackageName ?? currentDirName; // the last part of the Path


  // Validate package name.
  const pkgNameValidation = validatePackageName(pkgName);
  if (!pkgNameValidation.validForNewPackages) {
    const errors = [...pkgNameValidation.errors ?? [], ...pkgNameValidation.warnings ?? []];
    let errorsString = '';
    errors.forEach((error, i) => {
      errorsString += ` - ${error}` + (i < (errors.length - 1) ? '\n' : '');
    });

    throw (`The package name "${pkgName}" is invalid!\n${errorsString}`);
  }


  /** The name of directory that will contain the package. */
  // The replace removes the scope part, if present.
  const pkgDirName = receivedPackageName ? pkgName.replace(/.*\//, '') : currentDirName;
  pkgPath = receivedPackageName ? Path.join(cwd, pkgDirName) : cwd;
  const parentDirPath = Path.dirname(pkgPath);
  const getPath = (...filename: string[]) => (Path.join(pkgPath, ...filename));



  // If will create a new dir, check if it already exists.
  if (receivedPackageName) {
    if (fs.existsSync(pkgPath))
      throw (`There is already a directory or file named "${pkgDirName}" at "${parentDirPath}"`);
  }


  // After basic validations, print that we have started to do generate the package.
  console.log(`Generating the package "${pkgName}" at "${pkgPath}"...`);


  // Already checked the dir existence above.
  if (receivedPackageName) {
    fs.mkdirSync(pkgPath);
    createdDir = true;
    createdAnyFile = true;
  }


  // npm init
  await execa('npm', ['init',  '-y'], { cwd: pkgPath }); //.toString();
  createdAnyFile = true;

  // Install packages. Using @latest in eslint as eslint --init outputs.
  console.log('Installing packages...');

  const devPackages = [
    'typescript',
    'eslint@latest', '@typescript-eslint/parser@latest', '@typescript-eslint/eslint-plugin@latest',
    'rimraf',
  ];
  await execa('npm', ['i', '-D', ...devPackages], { cwd: pkgPath });

  console.log('Generating files...');
  // Make some changes to the package.json
  changePackageJson({ pkgPath });

  // Generate the latest tsconfig.json file
  await execa('tsc', ['--init'], { cwd: pkgPath });
  change_tsconfig({ pkgPath });


  // Create README.md
  fs.writeFileSync(getPath('README.md'), get_readme(pkgName));

  // Create CHANGELOG.md
  fs.writeFileSync(getPath('CHANGELOG.md'), get_CHANGELOG()); // TODO add changelog template

  // Create .gitignore
  fs.writeFileSync(getPath('.gitignore'), get_gitignore());

  // Create .eslintignore
  fs.writeFileSync(getPath('.eslintignore'), get_eslintignore());

  // Create .eslintrc.js
  fs.writeFileSync(getPath('.eslintrc.js'), get_eslintrc());

  // Create src/index.ts
  fs.mkdirSync(getPath('src'));
  fs.writeFileSync(getPath('src', 'index.ts'), get_index());

  console.log(`Package "${pkgName}" created at "${pkgPath}"!`);
}






main().catch(err => {
  // const msg = err.message;
  console.error(`An error happened! - [gev v${VERSION}]`);
  console.error(err); // TODO add package version
  if (createdAnyFile) {
    debugLog('Erasing created files...');
    if (createdDir) // Ran at child dir
      rimrafSync(pkgPath);
    else // ran at same dir
      rimrafSync('./*');
    // rimraf.sync('', {})
  }
});