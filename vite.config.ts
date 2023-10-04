// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { defineConfig } from 'vite'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import react from '@vitejs/plugin-react-swc'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { imagetools } from 'vite-imagetools'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { dependencies } from './package.json';

function renderChunks(deps: Record<string, string>) {
  const chunks = {};
  Object.keys(deps).forEach((key) => {
    if (key === "react" || key === "react-dom" || key === "@nextui-org/react" || key === "framer-motion") return;
    chunks[key] = [key];
  });
  return chunks;
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), imagetools()],
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ...renderChunks(dependencies),
        },
      },
    },
  }
})
