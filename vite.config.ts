import {vitePlugin as remix} from '@remix-run/dev';
import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {oxygen} from '@shopify/mini-oxygen/vite';
import {vitePlugin as shopify} from '@shopify/cli-hydrogen/vite';

export default defineConfig({
  plugins: [
    oxygen(),
    shopify(),
    hydrogen(),
    remix({
      presets: [hydrogen.preset()],
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
  ],
  ssr: {
    optimizeDeps: {
      include: ['@headlessui/react', 'clsx'],
    },
  },
  build: {
    assetsInlineLimit: 0,
  },
});