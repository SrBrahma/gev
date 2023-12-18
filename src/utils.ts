import { readdirSync, readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

export const loadConfigs = (): void => {
  let loadedData: string = Bun.spawnSync(['npm', 'get', 'gev']).stdout.toString();

  if (loadedData === 'undefined') loadedData = '{}';
  configData = JSON.parse(loadedData) as Config;
};

export const setConfigs = (props: Partial<Config>): void => {
  configData = { ...configData, ...props };
  Bun.spawnSync(['npm', 'set', 'gev', JSON.stringify(configData)]);
};
