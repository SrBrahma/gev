import { Core } from './core';
import Path from 'path';


export type Flavor = 'ts' | 'expo'
export const flavorsArray = ['ts', 'expo'] as const;



export function getFlavorWritePath(flavor: Flavor): string {
  return Path.join(__dirname, '..', 'semitemplates', flavor);
}

/** Accepts '.' or './' to inform to use the cwd */
export const currentDirectoryRegex = /\.\.?/;


export type FlavorFunction = (common: Core) => (void | Promise<void>)