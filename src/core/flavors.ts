import { readdirSync } from 'fs';
import path from 'path';
import { Program } from '../main/consts.js';
import { FlavorFunction } from '../main/typesAndConsts.js';



const flavorsDirPath = path.join(Program.srcPath, 'flavors');

/** Sync, so it's available from the start. */
function getAvailableFlavors() {
  let flavors = readdirSync(flavorsDirPath);
  // omit _todo from flavors
  flavors = flavors.filter((f) => !['_todo'].includes(f));
  flavors = flavors.map((flavor) => flavor.replace(/\.[tj]s/, ''));
  return flavors;
}

export const availableFlavors = getAvailableFlavors();

export async function getFlavorFunction(flavor: string): Promise<FlavorFunction> {
  if (!availableFlavors.includes(flavor))
    throw new Error(`Invalid flavor! flavor=${flavor}, availableFlavors=${availableFlavors}`);
  return (await import(path.join(flavorsDirPath, `${flavor}.js`))).default;
}