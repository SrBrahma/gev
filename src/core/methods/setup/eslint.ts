import path from 'path';
import { execaCommand } from 'execa';
import fse from 'fs-extra';
import { oraPromise } from 'ora';

export type EslintFlavor =
  | 'ts'
  | 'js'
  | 'react-ts'
  | 'react-js'
  | 'react-native-ts'
  | 'react-native-js';
export type SetupEslintrcProps = {
  projectPath: string;
  /**
   * If should create '.eslintrc.cjs' instead of '.eslintrc.js'.
   * @default false
   */
  cjs?: boolean;
  /** Run `npx eslint-config-gev -h` for updated flavors. */
  flavor: EslintFlavor;
};

export async function setupEslintrc({
  projectPath,
  cjs,
  flavor,
}: SetupEslintrcProps): Promise<void> {
  await oraPromise(async () => {
    await execaCommand(`npx -y eslint-config-gev ${flavor} ${cjs ? '--cjs' : ''}`, {
      cwd: projectPath,
    });

    // Check if there is a `tsconfig.lint.json` in dir
    const tsconfigLintPath = path.resolve(projectPath, 'tsconfig.lint.json');
    const hasTsconfigLint = fse.pathExistsSync(tsconfigLintPath);

    if (hasTsconfigLint) {
      const eslintPath = path.resolve(projectPath, `.eslintrc.${cjs ? 'cjs' : 'js'}`);
      let content = fse.readFileSync(eslintPath, 'utf-8');
      content = content.replace('tsconfig.json', 'tsconfig.lint.json');
      fse.writeFileSync(eslintPath, content);
    }
  }, 'Setting up ESLint');
}
