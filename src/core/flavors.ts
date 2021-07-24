import { readdirSync } from 'fs';
import path from 'path';
import { FlavorFunction } from '../typesAndConsts';

const flavorsDirPath = path.join(__dirname, '..', 'flavors');

/** Sync, so it's available from the start. */
function getAvailableFlavors() {
  let flavors = readdirSync(flavorsDirPath);
  // omit _todo from flavors
  flavors = flavors.filter(f => !['_todo'].includes(f));
  flavors = flavors.map(flavor => flavor.replace('.ts', ''));
  return flavors;
}

export const availableFlavors = getAvailableFlavors();

export async function getFlavorFunction(flavor: string): Promise<FlavorFunction> {
  if (!availableFlavors.includes(flavor))
    throw new Error(`Invalid flavor! flavor=${flavor}, availableFlavors=${availableFlavors}`);
  return (await import(path.join(flavorsDirPath, flavor))).default;
}