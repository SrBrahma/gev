// tsconfig references:
// https://github.com/TypeStrong/ts-node/blob/main/tsconfig.json
// jest? https://github.com/kulshekhar/ts-jest/issues/618


import Path from 'path';
import fs from 'fs';

// https://www.staging-typescript.org/

export function change_tsconfig({ pkgPath }: {pkgPath: string, isNpmPackage?: boolean}): void {

  const path = Path.join(pkgPath, 'tsconfig.json');

  let tsconfigData = fs.readFileSync(path).toString();


  const changeCompilerOptions = (key: string, value: any) => {
    const val = typeof value === 'string' ? `"${value}"` : String(value);

    // If the key doesn't exists, add to the begin, so we won't have to deal with commas between value and comment.
    if (tsconfigData.search(`"${key}"`) === -1) {
      tsconfigData = tsconfigData.replace(/(?<="compilerOptions": \{\n)/, `    "${key}": ${val},\n`);
    }

    // Will just replace for now, as I know the changed keys are present (commented or not) in the initial tsconfig file
    tsconfigData = tsconfigData.replace(new RegExp(`(// )?"${key}":\\s*"?\\w+"?`), `"${key}": ${val}`);
    // TODO add/remove spaces after the value, to keep the comments horizontally aligned
  };

  // may use rootDirs for jest etc? aint sure if needed https://www.staging-typescript.org/tsconfig#rootDirs
  changeCompilerOptions('declaration', true);
  changeCompilerOptions('declarationMap', true);
  changeCompilerOptions('sourceMap', true);
  changeCompilerOptions('outDir', 'dist');
  changeCompilerOptions('rootDir', 'src');
  changeCompilerOptions('incremental', true);
  changeCompilerOptions('allowJs', true);
  changeCompilerOptions('types', ['node']); // Removes the need to import node types.
  changeCompilerOptions('incremental', true);
  changeCompilerOptions('resolveJsonModule', true);
  changeCompilerOptions('noUncheckedIndexedAccess', true);



  // Not using editJsonFile here, as it won't accept JSON5 (tsconfig.json). https://github.com/IonicaBizau/edit-json-file/issues/39
  // const tsconfigJsonFile = editJsonFile(path, {});
  // tsconfigJsonFile.
  // tsconfigJsonFile.set('include', ['src/**/*', 'tests/**/*']);
  // tsconfigJsonFile.save();


  // Not using include/exclude now. Requires further research for best solution.
  // As workaround, will use the last curly brackets to add other info.
  tsconfigData = tsconfigData.replace(/(?<=\})(?=\n\}\n)/,
    `,

  "include": ["src/**/*", "tests/**/*"],
  "exclude": ["node_modules"]`);

  fs.writeFileSync(path, tsconfigData);
}