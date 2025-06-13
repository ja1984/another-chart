import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/AnotherChart.ts',
      name: 'AnotherChart',
      fileName: 'another-chart',
      formats: ['es', 'umd'],
    },
    minify: true,
  }
});
