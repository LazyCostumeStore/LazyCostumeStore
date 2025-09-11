import {defineConfig} from '@shopify/cli-hydrogen';

export default defineConfig({
  shopify: {
    storeDomain: process.env.PUBLIC_STORE_DOMAIN,
    storefrontToken: {
      public: process.env.PUBLIC_STOREFRONT_API_TOKEN,
      private: process.env.PRIVATE_STOREFRONT_API_TOKEN,
    },
  },
  session: {
    secret: process.env.SESSION_SECRET,
  },
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  },
});