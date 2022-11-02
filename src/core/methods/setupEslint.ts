import path from 'path';
import { execaCommand } from 'execa';
import fse from 'fs-extra';
import { oraPromise } from 'ora';


export async function setupEslintrc({
  cwd, cjs, flavor,
}: {
  cwd: string;
  /** If should create '.eslintrc.cjs' instead of '.eslintrc.js' */
  cjs?: boolean;
  /** Run `npx eslint-config-gev -h` for updated flavors */
  flavor: 'ts' | 'js' | 'react-ts' | 'react-js' | 'react-native-ts' | 'react-native-js';
  /** If should overwrite existing .eslintrc. Else, it throws. */
  force?: boolean;
}): Promise<void> {
  await oraPromise(async () => {
    await execaCommand(`npx -y eslint-config-gev ${flavor} ${cjs ? '--cjs' : ''}`, { cwd });

    // Check if there is a `tsconfig.lint.json` in dir
    const tsconfigLintPath = path.resolve(cwd, 'tsconfig.lint.json');
    const hasTsconfigLint = fse.pathExistsSync(tsconfigLintPath);

    if (hasTsconfigLint) {
      const eslintPath = path.resolve(cwd, `.eslintrc.${cjs ? 'cjs' : 'js'}`);
      let content = fse.readFileSync(eslintPath, 'utf-8');
      content = content.replace('tsconfig.json', 'tsconfig.lint.json');
      fse.writeFileSync(eslintPath, content);
    }
  }, 'Setting up ESLint');
}