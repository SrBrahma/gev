import fs from 'fs'
import path from 'path'
import yargs from 'yargs/yargs'
import {getReadmeData as readmeData} from './resources/readme'
import { getGitIgnore as gitignoreData } from './resources/gitignore';
import execa from 'execa'
import { eslintignoreData } from './resources/eslintignore';
import { srcIndexData } from './resources/srcIndex';
import { eslintrcJsData } from './resources/eslintrc';
import { makeChangesOnPackageJsonFile } from './resources/packagejson';

// TODO add support for react & react-native flavors (args like --react or --native)
// This isn't a template for react and react-native projects (at most templates for packages for them).
// For react/native real project templates, will require another project, that may/will include this one.

// TODO add --jest arg to include jest testing
// TODO add ts-node-dev pkg?
// TODO add tools, for eg add badges to README.
// Maybe an argument for interactive setup to add stuff like that.
// ^ Having an option to repopulate info badges is good, as dev may change repo name etc.

// TODO license to README? MIT as default?


async function main() {
  const cwd = process.cwd();

  // const flavor: null | 'react' | 'react-native' = null;
  // /** If is react or react-native flavor */
  // const isReacty = (flavor === 'react' || flavor === 'react-native')

  /** For now, if should create declaration files etc. */
  const isNpmPackage = true

  // https://github.com/yargs/yargs/blob/HEAD/docs/examples.md#yargs-is-here-to-help-you
  const y = yargs(process.argv.slice(2))
  .usage('Usage: $0 [options] <package-name>')
  .options({

  })
  .demandCommand(0, 1)

  const receivedPackageName = y.argv._[0] ? String(y.argv._[0]) : undefined;

  // If not received, check if cwd is empty.
  if (!receivedPackageName) {
    const cwdIsEmpty = fs.readdirSync('./').length === 0 // https://stackoverflow.com/a/60676464/10247962
    if (!cwdIsEmpty) {
      // improve error message
      throw ('As no package name was passed, it was tried to use the cwd. However, the cwd is not empty!\n\n'
      + 'cwd=' + cwd)
    }
  }


  const pkgPath = receivedPackageName ? path.join(cwd, receivedPackageName) : cwd
  const getPath = (...filename: string[]) => (path.join(pkgPath, ...filename))

  const packageName = path.parse(pkgPath).name // the last part of the path

  const devPackages = [
    'typescript',
    'eslint@latest', '@typescript-eslint/parser@latest', '@typescript-eslint/eslint-plugin@latest',
    'rimraf'
  ]
  // npm init
  await execa('npm', ['init',  '-y'],); //.toString();

  // Install packages. Using @latest in eslint as eslint --init outputs.
  await execa('npm', ['i', '-D', ...devPackages])

  // Make some changes to the package.json
  makeChangesOnPackageJsonFile({pkgPath})

  // Generate the latest tsconfig.json file
  await execa('tsc', ['--init'])


  // Create README.md
  fs.writeFileSync(getPath('README.md'), readmeData(packageName))

  // Create CHANGELOG.md
  fs.writeFileSync(getPath('CHANGELOG.md'), '') // TODO add changelog template

  // Create .gitignore
  fs.writeFileSync(getPath('.gitignore'), gitignoreData())

  // Create .eslintignore
  fs.writeFileSync(getPath('.eslintignore'), eslintignoreData())

  // Create .eslintrc.js
  fs.writeFileSync(getPath('.eslintrc.js'), eslintrcJsData())

  // Create src/index.ts
  fs.writeFileSync(getPath('src', 'index.ts'), srcIndexData())


}

(async () => {
  try {
    await main()
  } catch (err) {
    console.error(err)
  }
})()