import {
  createStorefrontApiClient,
  type StorefrontApiClient,
} from '@shopify/storefront-api-client';

export function createStorefront(options: {
  request: Request;
  env: Env;
  cart?: {
    id?: string;
  };
}): StorefrontApiClient {
  const {request, env} = options;

  return createStorefrontApiClient({
    storeDomain: env.PUBLIC_STORE_DOMAIN,
    apiVersion: '2024-07',
    publicAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
    privateAccessToken: env.PRIVATE_STOREFRONT_API_TOKEN,
    requestInit: {
      headers: {
        'User-Agent': request.headers.get('User-Agent') || '',
      },
    },
  });
}