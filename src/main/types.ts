import type { CoreClass } from '../core/core.js';

export type FlavorFunction = (common: CoreClass) => void | Promise<void>;
export type PackageManager = 'npm' | 'yarn' | 'pnpm';
