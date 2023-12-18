import { expect, test } from 'bun:test';
import { execaCommand } from 'execa';
import { pathFromRoot, version } from './utils';

const runWithArgs = (args: string) =>
  execaCommand(`bun run ${pathFromRoot('./src/index.ts')} ` + args);

test('version works', async () => {
  expect((await runWithArgs('-v')).stdout).toBe(version);
});
