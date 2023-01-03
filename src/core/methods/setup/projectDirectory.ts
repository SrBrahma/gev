import fse from 'fs-extra';
import type { CoreConsts, CoreVars } from '../../core.js';
/** Creates the project directory, if not using the cwd as the path.
 *
 * As it uses createProjectDir action, createdDir and shouldCleanOnError may be set.
 * You should run projectDirMustBeValid before. */
export const setProjectDirectory = ({
  consts,
  vars,
}: {
  consts: CoreConsts;
  vars: CoreVars;
}): void => {
  // TODO [*1] get the higher level dir created to remove it.
  const dirExists = fse.pathExistsSync(consts.projectPath);
  if (!dirExists) {
    fse.ensureDirSync(consts.projectPath);
    vars.shouldCleanOnError = true;
    vars.createdDir = true;
  }
};
