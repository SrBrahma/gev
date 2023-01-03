import Path from 'path';
import editJsonFile from 'edit-json-file';
import fse from 'fs-extra';

/** True if has git, false if don't. */
export function pathHasGit(path: string): Promise<boolean> {
  return fse.pathExists(Path.join(path, '.git'));
}

export type EditPackageJsonProps = {
  projectPath: string;
  name?: string;
  author?: string;
  data?: Record<string, any>;
  // TODO add scripts
};
export function editPackageJson(props: EditPackageJsonProps): void {
  const json = editJsonFile(Path.join(props.projectPath, 'package.json'));
  const content: Record<string, string> = json.read() as Record<string, string>;
  const author: string | undefined = props.author ?? content.author;
  const name: string | undefined = props.name ?? content.name;

  const commonData = {
    name: props.name ?? content.name,
    ...(author && {
      author,
    }),
    ...(author &&
      name && {
        homepage: `https://github.com/${author}/${name}#readme`,
        bugs: `https://github.com/${author}/${name}/issues`,
        repository: `github:${author}/${name}`,
      }),
  };

  Object.entries({ ...commonData, ...props.data }).forEach(([key, value]) => json.set(key, value));
  json.save();
}

export const commonTestDeps = ['jest', 'ts-jest', '@types/jest'];
