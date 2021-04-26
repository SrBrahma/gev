import execa from 'execa';

// TODO add cwd to execa for non global executions
export async function checkPackageUpdate(packageName: string, { install }: {
  /** If should omit the print of the checking process and of the ins ... */
  // silent = false,
  /** If should automatically install the package if not installed or is outdated
   * @default false */
  install: boolean,
} = { install: false }): Promise<'notInstalled' | 'outdated' | 'updated'> {
  let state: 'notChecked' | 'notInstalled' | 'installed' | 'outdated' | 'updated' = 'notChecked';

  console.log(`Checking if "${packageName}" is globally installed and updated...`);

  // TODO npm list and npm outdated could be run in parallel. Aint sure how to do it now. Will save ~4s.
  try {
    await execa('npm', ['list', '-g', packageName]);
    state = 'installed';
  } catch {
    state = 'notInstalled';
  }

  if (state === 'installed') {
    // Check for updates
    const result = await execa('npm', ['outdated', '-g', packageName]);
    const updated = result.stdout === '';

    state = updated ? 'updated' : 'outdated';
  }

  if (!install)
    return state;

  if (state === 'notInstalled')
    console.log(`"${packageName}" is not globally installed. Installing it...`);

  if (state === 'outdated')
    // TODO add current version and target version.
    console.log(`"${packageName}" is not updated. Updating it...`);

  if (state !== 'updated')
    await execa('npm', ['i', '-g', packageName]);

  return 'updated';
}
