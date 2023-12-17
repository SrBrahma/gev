import { readdirSync, readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execaCommand, execaSync } from 'execa';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const pathFromRoot = (...p: Array<string>) => path.resolve(__dirname, '..', ...p);
export const { version } = JSON.parse(readFileSync(pathFromRoot('./package.json'), 'utf8')) as {
  version: string;
};

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
