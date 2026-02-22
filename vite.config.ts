import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      'sonner@2.0.3': 'sonner',
      'react-hook-form@7.55.0': 'react-hook-form',
      'figma:asset/dedaba7512f12ad5ab90e0af39132d92d35273a9.png': path.resolve(__dirname, './src/assets/dedaba7512f12ad5ab90e0af39132d92d35273a9.png'),
      'figma:asset/49248dbd165caf7144a4cb6ade908b8d36ee2839.png': path.resolve(__dirname, './src/assets/49248dbd165caf7144a4cb6ade908b8d36ee2839.png'),
      'figma:asset/15191165dc220c16c69248b29f4dd056f221a3b3.png': path.resolve(__dirname, './src/assets/15191165dc220c16c69248b29f4dd056f221a3b3.png'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'build',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || id.includes('/react/')) return 'vendor-react';
            if (id.includes('@radix-ui')) return 'vendor-radix';
            if (id.includes('@dnd-kit')) return 'vendor-dnd';
            if (id.includes('motion')) return 'vendor-motion';
            if (id.includes('lucide-react')) return 'vendor-lucide';
          }
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
  server: {
    port: 3000,
    open: true,
  },
});