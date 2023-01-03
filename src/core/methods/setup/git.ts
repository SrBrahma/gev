import { execaCommand } from 'execa';
import { pathHasGit } from '../../utils/utils.js';

export const setupGit = async ({ projectPath }: { projectPath: string }): Promise<void> => {
  if (!(await pathHasGit(projectPath))) await execaCommand('git init', { cwd: projectPath });

  // Ensure it uses main as main branch.
  await execaCommand('git branch -m main', { cwd: projectPath }).catch(() => null); // It may error if there is no master / there is already a main.
};
