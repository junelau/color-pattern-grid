import * as esbuild from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isWatch = process.argv.includes('--watch');

const buildOptions = {
  entryPoints: [join(__dirname, 'src/app.js')],
  bundle: true,
  minify: true,
  sourcemap: true,
  target: ['es2020'],
  outfile: join(__dirname, 'dist/app.min.js'),
  format: 'iife', // Immediately Invoked Function Expression for browser compatibility
  logLevel: 'info',
};

async function build() {
  try {
    if (isWatch) {
      const ctx = await esbuild.context(buildOptions);
      await ctx.watch();
      console.log('⚡ Watching for changes...');
    } else {
      await esbuild.build(buildOptions);
      console.log('✅ Build complete!');
    }
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();
