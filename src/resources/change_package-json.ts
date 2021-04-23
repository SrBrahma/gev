// TODO add funding field? https://docs.npmjs.com/cli/v7/configuring-npm/package-json#funding
// TODO add lint script
// TODO test. jest?
// TODO versioning fast mngmt

import editJsonFile from 'edit-json-file';
import Path from 'path';

export function changePackageJson({ pkgPath }: {pkgPath: string}): void {
  const packageJsonFile = editJsonFile(Path.join(pkgPath, 'package.json'));

  packageJsonFile.set('version', '0.1.0');
  packageJsonFile.set('main', './dist/index.js');
  packageJsonFile.set('types', './dist/index.d.ts'); // https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html#including-declarations-in-your-npm-package

  packageJsonFile.set('files', ['/dist']); // https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html#including-declarations-in-your-npm-package

  packageJsonFile.set('scripts.test', 'echo "No test specified."'); // Error isn't throw.
  packageJsonFile.set('scripts.clean', 'rimraf dist');
  packageJsonFile.set('scripts.build', 'npm run clean && tsc');

  // Those below will increase the corresponding semvar (major.minor.patch) version in the package.json.
  // Won't deal with git, as default `npm version <x>` does.
  packageJsonFile.set('scripts.major', 'npm version major --no-git-tag-version');
  packageJsonFile.set('scripts.minor', 'npm version minor --no-git-tag-version');
  packageJsonFile.set('scripts.patch', 'npm version patch --no-git-tag-version');

  packageJsonFile.set('scripts.testAndBuild', 'npm run test && npm run build');
  packageJsonFile.set('scripts.deploy', 'npm run test && npm publish');

  packageJsonFile.save();
}