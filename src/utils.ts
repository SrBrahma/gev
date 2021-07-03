import execa from 'execa';
import ora from 'ora';

// TODO add cwd to execa for non global executions
export async function checkGlobalPackageUpdate(packageName: string, { install }: {
  /** If should omit the print of the checking process and of the ins ... */
  // silent = false,
  /** If should automatically install the package if not installed or is outdated
   * @default false */
  install: boolean,
} = { install: false }): Promise<'notInstalled' | 'outdated' | 'updated'> {
  let state: 'notChecked' | 'notInstalled' | 'outdated' | 'updated' = 'notChecked';

  const spinner = ora().start(`Checking if "${packageName}" is globally installed and updated`);

  // TODO unknown behavior on errors other than package not installed.

  const [installed, updatedOrNotInstalled] = await Promise.all([
    (async () => {
      try {
        await execa('npm', ['list', '-g', packageName]);
        return true;
      } catch { return false; }
    })(),
    (async () => {
      const result = await execa('npm', ['outdated', '-g', packageName]);
      const updatedOrNotInstalled = result.stdout === '';
      return updatedOrNotInstalled;
    })(),
  ]);

  if (!installed)
    state = 'notInstalled';
  else {
    state = updatedOrNotInstalled ? 'updated' : 'outdated';
  }

  if (!install) {
    // TODO add spinner handling.
    return state;
  }

  if (state !== 'updated') {
    if (state === 'notInstalled')
      spinner.info(`"${packageName}" is not globally installed. Installing it`);

    if (state === 'outdated')
      // TODO add current version and target version.
      console.info(`"${packageName}" is not updated. Updating it`);

    await execa('npm', ['i', '-g', packageName]);
  }

  spinner.succeed();
  return 'updated';
}