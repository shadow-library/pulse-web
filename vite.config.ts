import { URL, fileURLToPath } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, PluginOption } from 'vite';

const optionalPlugins: PluginOption[] = [];
if (process.env.VITE_ENABLE_BUNDLE_ANALYSER === 'true') optionalPlugins.push(visualizer({ open: true, gzipSize: true, brotliSize: true }));

export default defineConfig({
  plugins: [devtools(), tanstackRouter({ target: 'react', autoCodeSplitting: true }), viteReact(), tailwindcss(), ...optionalPlugins],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    chunkSizeWarningLimit: 750,
    rollupOptions: {
      output: {
        manualChunks: {
          'antd-vendor': ['antd'],
          'icons-vendor': ['@ant-design/icons'],
        },
      },
    },
  },
});
