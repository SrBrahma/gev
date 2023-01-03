import { readdirSync } from 'fs';
import path from 'path';
import { Program } from '../main/consts.js';
import type { FlavorFunction } from '../main/types.js';

/** Sync, so it's available from the start. */
function getAvailableFlavors() {
  let flavors = readdirSync(Program.paths.flavors());
  flavors = flavors
    .map((flavor) => flavor.replace(/\.[tj]s/, '')) // Remove ts/js extension from the filenames
    .sort(); // Sort the flavors alphabetically
  return flavors;
}

export const availableFlavors = getAvailableFlavors();

export async function getFlavorFunction(flavor: string): Promise<FlavorFunction> {
  if (!availableFlavors.includes(flavor))
    throw new Error(`Invalid flavor! flavor=${flavor}, availableFlavors=${availableFlavors}`);
  return (await import(path.join(Program.paths.flavors(), `${flavor}.js`))).default;
}
