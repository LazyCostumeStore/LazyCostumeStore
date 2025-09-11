import {createRequestHandler, type RequestHandler} from '@remix-run/node';
import {createStorefrontClient, storefrontRedirect} from '@shopify/hydrogen';
import {
  createCartHandler,
  createStorefrontClient,
  createCustomerAccountClient,
} from '@shopify/hydrogen';
import {HydrogenSession} from '~/lib/session.server';

export default {
  async fetch(
    request: Request,
    env: Env,
    executionContext: ExecutionContext,
  ): Promise<Response> {
    try {
      const waitUntil = executionContext.waitUntil.bind(executionContext);
      const [cache, session] = await Promise.all([
        caches.open('hydrogen'),
        HydrogenSession.init(request, [env.SESSION_SECRET]),
      ]);

      const hydrogenConfig = {
        storefront: createStorefrontClient({
          cache,
          waitUntil,
          i18n: getLocaleFromRequest(request),
          publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN,
          privateStorefrontToken: env.PRIVATE_STOREFRONT_API_TOKEN,
          storeDomain: env.PUBLIC_STORE_DOMAIN,
          storefrontId: env.PUBLIC_STOREFRONT_ID,
          storefrontHeaders: getStorefrontHeaders(request),
        }),
        customerAccount: createCustomerAccountClient({
          waitUntil,
          request,
          session,
          customerAccountId: env.PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID,
          customerAccountUrl: env.PUBLIC_CUSTOMER_ACCOUNT_API_URL,
        }),
        cart: createCartHandler({
          storefront: createStorefrontClient({
            cache,
            waitUntil,
            i18n: getLocaleFromRequest(request),
            publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN,
            privateStorefrontToken: env.PRIVATE_STOREFRONT_API_TOKEN,
            storeDomain: env.PUBLIC_STORE_DOMAIN,
            storefrontId: env.PUBLIC_STOREFRONT_ID,
            storefrontHeaders: getStorefrontHeaders(request),
          }),
          getCartId: () => session.get('cartId'),
          setCartId: (cartId: string) => session.set('cartId', cartId),
          cartQueryFragment: CART_QUERY_FRAGMENT,
        }),
        env,
        session,
        waitUntil,
      };

      const handleRequest = createRequestHandler({
        build: await import('virtual:remix/server-build'),
        mode: process.env.NODE_ENV,
        getLoadContext: () => hydrogenConfig,
      });

      const response = await handleRequest(request);

      if (session.isPending) {
        response.headers.set('Set-Cookie', await session.commit());
      }

      if (response.status === 404) {
        return storefrontRedirect({
          request,
          response,
          storefront: hydrogenConfig.storefront,
        });
      }

      return response;
    } catch (error) {
      console.error(error);
      return new Response('An unexpected error occurred', {status: 500});
    }
  },
} satisfies ExportedHandler<Env>;

function getLocaleFromRequest(request: Request) {
  const defaultLocale = {language: 'EN', country: 'US'};
  const supportedLocales = [defaultLocale];

  const url = new URL(request.url);
  const firstPathSegment = url.pathname.split('/')[1]?.toUpperCase();

  return supportedLocales.find((locale) => {
    return (
      locale.language === firstPathSegment ||
      locale.country === firstPathSegment
    );
  }) || defaultLocale;
}

function getStorefrontHeaders(request: Request) {
  const headers: Record<string, string> = {};
  const userAgent = request.headers.get('User-Agent');

  if (userAgent) {
    headers['User-Agent'] = userAgent;
  }

  return headers;
}

const CART_QUERY_FRAGMENT = `#graphql
  fragment Money on MoneyV2 {
    currencyCode
    amount
  }
  fragment CartLine on CartLine {
    id
    quantity
    attributes {
      key
      value
    }
    cost {
      totalAmount {
        ...Money
      }
      amountPerQuantity {
        ...Money
      }
      compareAtAmountPerQuantity {
        ...Money
      }
    }
    merchandise {
      ... on ProductVariant {
        id
        availableForSale
        compareAtPrice {
          ...Money
        }
        price {
          ...Money
        }
        requiresShipping
        title
        image {
          id
          url
          altText
          width
          height
        }
        product {
          handle
          title
          id
          vendor
        }
        selectedOptions {
          name
          value
        }
      }
    }
  }
  fragment CartApiQuery on Cart {
    updatedAt
    id
    checkoutUrl
    totalQuantity
    buyerIdentity {
      countryCode
      customer {
        id
        email
        firstName
        lastName
        displayName
      }
      email
      phone
    }
    lines(first: $numCartLines) {
      nodes {
        ...CartLine
      }
    }
    cost {
      subtotalAmount {
        ...Money
      }
      totalAmount {
        ...Money
      }
      totalDutyAmount {
        ...Money
      }
      totalTaxAmount {
        ...Money
      }
    }
    note
    attributes {
      key
      value
    }
    discountCodes {
      applicable
      code
    }
  }
` as const;