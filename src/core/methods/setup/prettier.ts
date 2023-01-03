import { oraPromise } from 'ora';
import { editPackageJson } from '../../utils/utils.js';

export async function setupPrettier({ projectPath }: { projectPath: string }): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/require-await
  await oraPromise(async () => {
    // TODO add prettier installation
    editPackageJson({
      projectPath,
      data: {
        prettier: 'prettier-config-gev',
      },
    });
  }, 'Setting up Prettier');
}
