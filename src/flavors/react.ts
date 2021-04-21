import editJsonFile from 'edit-json-file';
import path from 'path'


export function reactPostInstall({pkgPath}: {
  pkgPath: string
}) {

  const tsconfigFile = editJsonFile(path.join(pkgPath, 'tsconfig.json'), {autosave: true})
  tsconfigFile.set('compilerOptions.jsx', 'react')
}