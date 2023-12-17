import { readdirSync } from 'fs';
import path from 'path';
import { execaCommand, execaSync } from 'execa';

export const pathFromRoot = (...p: Array<string>) => path.resolve(import.meta.dir, '..', ...p);
// const require = createRequire(import.meta.url);
// export const { version } = JSON.parse(readFileSync(pathFromRoot('package.json'), 'utf-8')) as { version: string };

export const getAvailableFlavors = () => readdirSync(pathFromRoot('.bun-create')).sort();

type Config = {
  githubAuthor?: string;
};

export let configData: Config = {};

export const loadConfigs = async (): Promise<void> => {
  let loadedData: string = (await execaCommand('npm get gev')).stdout;

  if (loadedData === 'undefined') loadedData = '{}';
  configData = JSON.parse(loadedData) as Config;
};

export const setConfigs = (props: Partial<Config>): void => {
  configData = { ...configData, ...props };
  execaSync('npm', ['set', 'gev', JSON.stringify(configData)]);
};
