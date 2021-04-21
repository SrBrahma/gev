import editJsonFile from 'edit-json-file';
import Path from 'path'

export function makeChangesOnPackageJsonFile({pkgPath}: {pkgPath: string}) {
  const packageJsonFile = editJsonFile(Path.join(pkgPath, 'package.json'))

  packageJsonFile.set('main', './dist/index.js');
  packageJsonFile.set('types', './dist/index.d.ts'); // https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html#including-declarations-in-your-npm-package

  packageJsonFile.set('files', ["/dist"]); // https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html#including-declarations-in-your-npm-package

  packageJsonFile.set('scripts.test', 'echo \"No test specified.\"'); // Error isn't throw.
  packageJsonFile.set('scripts.clean', 'rimraf dist');
  packageJsonFile.set('scripts.build', 'npm run clean && tsc');
  packageJsonFile.set('scripts.prepare', 'npm run build'); // To allow the use of the package via git url.
  packageJsonFile.set('scripts.testAndBuild', 'npm run test && npm run build');
  packageJsonFile.set('scripts.deploy', 'npm run testAndBuild && npm publish');

  packageJsonFile.save();
}