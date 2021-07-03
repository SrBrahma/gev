import { Core } from './core';
import Path from 'path';


export const flavorsArray = ['ts', 'expo', 'expo-pkg'] as const;


export type Flavor = (typeof flavorsArray)[number]

export function getFlavorWritePath(flavor: Flavor): string {
  return Path.join(__dirname, '..', 'semitemplates', flavor);
}

/** Accepts '.' or './' to inform to use the cwd */
export const currentDirectoryRegex = /\.\.?/;


export type FlavorFunction = (common: Core) => (void | Promise<void>)