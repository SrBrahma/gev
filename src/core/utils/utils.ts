import Path from 'path';
import editJsonFile from 'edit-json-file';
import fse from 'fs-extra';

/** True if has git, false if don't. */
export function pathHasGit(path: string): Promise<boolean> {
  return fse.pathExists(Path.join(path, '.git'));
}

export function editPackageJson({
  projectPath,
  data,
  name,
  githubAuthor,
}: {
  projectPath: string;
  name: string;
  githubAuthor?: string;
  data?: Record<string, any>;
}): void {
  const json = editJsonFile(Path.join(projectPath, 'package.json'));
  const commonData = {
    name,
    author: githubAuthor,
    homepage: `https://github.com/${githubAuthor}/${name}#readme`,
    bugs: `https://github.com/${githubAuthor}/${name}/issues`,
    repository: `github:${githubAuthor}/${name}`,
  };
  Object.entries({ ...commonData, ...data }).forEach(([key, value]) => json.set(key, value));
  json.save();
}
