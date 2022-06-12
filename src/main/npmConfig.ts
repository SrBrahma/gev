import { execa } from 'execa';



type Config = {
  githubAuthor?: string;
};

export let configData: Config = {};

export async function loadConfigs(): Promise<void> {
  let loadedData: string = (await execa('npm', ['get', 'gev'])).stdout;
  if (loadedData === 'undefined')
    loadedData = '{}';

  configData = JSON.parse(loadedData);
}

export async function setConfigs(props: Partial<Config>): Promise<void> {
  configData = { ...configData, ...props };
  await execa('npm', ['set', 'gev', JSON.stringify(configData)]);
}