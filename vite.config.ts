import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [{ src: 'manifest.json', dest: '.' }],
    }),
  ],
  build: {
    outDir: 'dist',
    // Kosongkan dist dulu sebelum build: mencegah artefak basi (chunk/assets
    // dari build lama, sourcemap dev) ikut ter-zip ke release. dulu false →
    // 5× button-*.js @ 803KB + 7.8MB .map ter-commit bertahan di CRX.
    emptyOutDir: true,
    // ponytail: oxc-minify rolldown segfault di Node 26 (SIGSEGV) → matikan
    // minify. Popup/sidepanel kecil, tidak esensial utk extension internal.
    minify: false,
    sourcemap: false,
    // ponytail: matikan inject <link rel=modulepreload> — Chrome ekstensi tolak
    // preload lintas-world ("cross-world extension resource mismatch").
    modulePreload: false,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup/index.html'),
        sidepanel: resolve(__dirname, 'sidepanel.html'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
});
