import {createRequestHandler} from '@remix-run/node';

export default {
  async fetch(request: Request, env: Env, executionContext: ExecutionContext): Promise<Response> {
    try {
      const handleRequest = createRequestHandler({
        // @ts-ignore - This will be properly typed in production
        build: () => import('virtual:remix/server-build'),
        mode: process.env.NODE_ENV,
        getLoadContext: () => ({
          env,
          session: {
            get: () => null,
            set: () => {},
            commit: () => Promise.resolve(''),
          },
          storefront: {
            // Mock storefront for development
            query: () => Promise.resolve({}),
          },
          cart: {
            // Mock cart for development
            get: () => Promise.resolve(null),
          },
          waitUntil: executionContext.waitUntil.bind(executionContext),
        }),
      });

      return await handleRequest(request);
    } catch (error) {
      console.error(error);
      return new Response('An unexpected error occurred', {status: 500});
    }
  },
} as any;

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