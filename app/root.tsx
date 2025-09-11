import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
  type ShouldRevalidateFunction,
  useLoaderData,
} from '@remix-run/react';
import {
  Analytics,
  getShopAnalytics,
  useNonce,
} from '@shopify/hydrogen';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import favicon from '../public/favicon.ico';
import resetStyles from './styles/reset.css?url';
import appStyles from './styles/app.css?url';
import {Layout} from '~/components/Layout';
import {seoPayload} from '~/lib/seo.server';

/**
 * This is important to avoid re-fetching root queries on sub-navigations
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') {
    return true;
  }

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) {
    return true;
  }

  return false;
};

export function links() {
  return [
    {rel: 'stylesheet', href: resetStyles},
    {rel: 'stylesheet', href: appStyles},
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
}

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront, env} = context;
  
  const publicStoreDomain = context.env.PUBLIC_STORE_DOMAIN;
  const isProduction = context.env.NODE_ENV === 'production';

  const seoData = seoPayload.root({
    shop: {name: 'LazyCostumeStore', description: 'Your one-stop shop for amazing costumes'}, 
    url: context.request?.url || ''
  });

  // Mock data for layout - in a real app this would come from Shopify
  const mockShop = {
    id: 'gid://shopify/Shop/1',
    name: 'LazyCostumeStore',
    description: 'Your one-stop shop for amazing costumes',
    primaryDomain: {
      url: publicStoreDomain,
    },
  };

  const mockMenu = {
    id: 'gid://shopify/Menu/1',
    items: [
      {
        id: '1',
        title: 'Collections',
        url: '/collections',
        items: [],
      },
      {
        id: '2', 
        title: 'About',
        url: '/pages/about',
        items: [],
      },
    ],
  };

  return defer(
    {
      publicStoreDomain,
      shop: mockShop,
      header: {
        shop: mockShop,
        menu: mockMenu,
      },
      footer: Promise.resolve({
        menu: mockMenu,
      }),
      cart: Promise.resolve(null),
      isLoggedIn: false,
      analytics: {
        shopAnalytics: Promise.resolve(null),
      },
      seoData,
    },
    {
      headers: {
        'Set-Cookie': await context.session.commit(),
      },
    },
  );
}

export default function App() {
  const nonce = useNonce();
  const data = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Layout {...data}>
          <Outlet />
        </Layout>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        {data.analytics.shopAnalytics && (
          <Analytics.Provider
            cart={data.cart}
            shop={data.analytics.shopAnalytics}
          >
            <Analytics.PageView />
          </Analytics.Provider>
        )}
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const nonce = useNonce();
  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data ?? errorMessage;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="route-error">
          <h1>Oops!</h1>
          <h2>{errorStatus}</h2>
          {errorMessage && (
            <fieldset>
              <pre>{errorMessage}</pre>
            </fieldset>
          )}
        </div>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

const LAYOUT_QUERY = `#graphql
  query layout($language: LanguageCode, $headerMenuHandle: String!, $footerMenuHandle: String!) @inContext(language: $language) {
    shop {
      id
      name
      description
      primaryDomain {
        url
      }
      brand {
        logo {
          image {
            url
          }
        }
      }
    }
    headerMenu: menu(handle: $headerMenuHandle) {
      id
      items {
        id
        resourceId
        tags
        title
        type
        url
        items {
          id
          resourceId
          tags
          title
          type
          url
        }
      }
    }
    footerMenu: menu(handle: $footerMenuHandle) {
      id
      items {
        id
        resourceId
        tags
        title
        type
        url
        items {
          id
          resourceId
          tags
          title
          type
          url
        }
      }
    }
  }
` as const;