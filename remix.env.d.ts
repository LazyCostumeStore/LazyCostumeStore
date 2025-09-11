/// <reference types="@shopify/remix-oxygen" />
/// <reference types="@shopify/oxygen-workers-types" />

// Enhance TypeScript's built-in typings.
import type {Storefront, HydrogenCart} from '@shopify/hydrogen';
import type {
  CustomerAccessToken,
  MailingAddress,
  Customer,
} from '@shopify/hydrogen/storefront-api-types';

declare global {
  /**
   * A global `process` object is only available during build to access NODE_ENV.
   */
  const process: {env: {NODE_ENV: 'production' | 'development'}};

  /**
   * Declare expected Env parameter in fetch handler.
   */
  interface Env {
    NODE_ENV: 'production' | 'development';
    SESSION_SECRET: string;
    PUBLIC_STOREFRONT_API_TOKEN: string;
    PRIVATE_STOREFRONT_API_TOKEN: string;
    PUBLIC_STORE_DOMAIN: string;
    PUBLIC_STOREFRONT_ID: string;
    PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID: string;
    PUBLIC_CUSTOMER_ACCOUNT_API_URL: string;
    PRINTFUL_API_TOKEN: string;
    PRINTFUL_WEBHOOK_SECRET: string;
    DATABASE_URL: string;
    BULK_UPLOAD_API_KEY: string;
  }
}

declare module '@shopify/remix-oxygen' {
  /**
   * Declare local additions to the Remix loader context.
   */
  interface AppLoadContext {
    env: Env;
    cart: HydrogenCart;
    storefront: Storefront;
    session: Session;
    waitUntil: ExecutionContext['waitUntil'];
  }

  interface SessionData {
    customerAccessToken?: CustomerAccessToken;
  }
}

export {};