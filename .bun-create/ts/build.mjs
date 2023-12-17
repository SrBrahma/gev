import dts from 'bun-plugin-dts';
import { rimraf } from 'rimraf';

const outdir = './dist';

await rimraf(outdir);

await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir,
  minify: true,
  plugins: [dts()],
  target: 'node',
  external: ['*'],
});
