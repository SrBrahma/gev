import editJsonFile from 'edit-json-file';
import Path from 'path'
import fs from 'fs'

// https://www.staging-typescript.org/

export function changeTsconfig({pkgPath, isNpmPackage}: {pkgPath: string, isNpmPackage: boolean}) {

  const path = Path.join(pkgPath, 'tsconfig.json');

  let tsconfigData = fs.readFileSync(path).toString();


  const changeCompilerOptions = (key: string, value: any) => {
    const val = typeof value === 'string' ? `"${value}"` : value
    // Will just replace for now, as I know the changed keys are present (commented or not) in the initial tsconfig file
    tsconfigData = tsconfigData.replace(new RegExp(`(// )?"${key}": \\w+`), `"${key}": ${val}`)
  }

  changeCompilerOptions('declaration', true)
  changeCompilerOptions('declarationMap', true)
  changeCompilerOptions('sourceMap', true)
  changeCompilerOptions('outDir', 'dist')
  changeCompilerOptions('rootDir', 'src')
  // may use rootDirs for jest etc? aint sure if needed https://www.staging-typescript.org/tsconfig#rootDirs

  fs.writeFileSync(path, tsconfigData)

  const tsconfigJsonFile = editJsonFile(path)
  tsconfigJsonFile.set('include', ["src/**/*", "tests/**/*"])
  tsconfigJsonFile.save();
}