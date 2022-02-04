import Path from 'path';
import { Core } from '../core/core.js';
import { Program } from './consts.js';



export function getFlavorWritePath(flavor: string): string {
  return Path.join(Program.rootPath, 'semitemplates', flavor);
}

export type FlavorFunction = (common: Core) => (void | Promise<void>);