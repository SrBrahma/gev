import type { Core } from '../core/core.js';

export type FlavorFunction = (common: Core) => void | Promise<void>;
export type PackageManager = 'npm' | 'yarn' | 'pnpm';
