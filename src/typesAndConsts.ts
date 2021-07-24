import { Core } from './core/core';
import Path from 'path';


export function getFlavorWritePath(flavor: string): string {
  return Path.join(__dirname, '..', 'semitemplates', flavor);
}

/** Accepts '.' or './' to inform to use the cwd */
export const currentDirectoryRegex = /\.\.?/;

export type FlavorFunction = (common: Core) => (void | Promise<void>);