import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    background: 'src/background.ts',
    content: 'src/content.ts',
  },
  format: ['esm'],
  target: 'es2022',
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
});
