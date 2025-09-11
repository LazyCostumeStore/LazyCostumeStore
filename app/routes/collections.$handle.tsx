import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {
  useLoaderData,
  Link,
  type MetaFunction,
  useSearchParams,
} from '@remix-run/react';
import {
  Pagination,
  getPaginationVariables,
  Image,
  Money,
  AnalyticsPageType,
} from '@shopify/hydrogen';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {getCurrentSeason, getSeasonalTheme} from '~/lib/seasonal';
import {seoPayload} from '~/lib/seo.server';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return seoPayload.collection({
    collection: data?.collection,
    url: data?.url || '',
  });
};

export async function loader({request, params, context}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  if (!handle) {
    return redirect('/collections');
  }

  const currentSeason = getCurrentSeason();
  const seasonalTheme = getSeasonalTheme(currentSeason);

  const {collection} = await storefront.query(COLLECTION_QUERY, {
    variables: {handle, ...paginationVariables},
  });

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  return defer({
    collection,
    currentSeason,
    seasonalTheme,
    url: request.url,
  });
}

export default function Collection() {
  const {collection, seasonalTheme} = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();

  return (
    <div className="collection">
      <div className="container-fluid py-12">
        <header className="mb-12">
          {collection.image && (
            <div className="relative h-64 md:h-80 mb-8 rounded-lg overflow-hidden">
              <Image
                alt={collection.image.altText || collection.title}
                data={collection.image}
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="text-center text-white">
                  <h1 
                    className="text-4xl md:text-6xl font-bold mb-4"
                    style={{ 
                      fontFamily: seasonalTheme.styles.fontFamily,
                      color: seasonalTheme.colors.primary 
                    }}
                  >
                    {collection.title}
                  </h1>
                  {collection.description && (
                    <p className="text-xl max-w-2xl mx-auto">
                      {collection.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {!collection.image && (
            <div className="text-center mb-8">
              <h1 
                className="text-4xl md:text-6xl font-bold mb-4"
                style={{ 
                  fontFamily: seasonalTheme.styles.fontFamily,
                  color: seasonalTheme.colors.primary 
                }}
              >
                {collection.title}
              </h1>
              {collection.description && (
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  {collection.description}
                </p>
              )}
            </div>
          )}
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <CollectionFilters />
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            <Pagination connection={collection.products}>
              {({nodes, isLoading, PreviousLink, NextLink}) => (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <p className="text-gray-600">
                      {collection.products.nodes.length} products
                    </p>
                    <PreviousLink>
                      {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
                    </PreviousLink>
                  </div>
                  
                  <ProductsGrid products={nodes} />
                  
                  <div className="mt-8 text-center">
                    <NextLink>
                      {isLoading ? 'Loading...' : <span>Load more ↓</span>}
                    </NextLink>
                  </div>
                </>
              )}
            </Pagination>
          </main>
        </div>
      </div>
    </div>
  );
}

function CollectionFilters() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span className="text-sm">Under $25</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span className="text-sm">$25 - $50</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span className="text-sm">$50 - $100</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span className="text-sm">Over $100</span>
          </label>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Size</h3>
        <div className="space-y-2">
          {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
            <label key={size} className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm">{size}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Category</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span className="text-sm">Adult</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span className="text-sm">Kids</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span className="text-sm">Accessories</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span className="text-sm">Props</span>
          </label>
        </div>
      </div>
    </div>
  );
}

function ProductsGrid({products}: {products: ProductItemFragment[]}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <ProductItem
          key={product.id}
          product={product}
          loading={index < 8 ? 'eager' : 'lazy'}
        />
      ))}
    </div>
  );
}

function ProductItem({
  product,
  loading,
}: {
  product: ProductItemFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variant = product.variants.nodes[0];
  const variantUrl = `/products/${product.handle}${
    variant?.id ? `?variant=${variant.id}` : ''
  }`;

  return (
    <Link
      className="product-item group card card-hover"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {product.featuredImage && (
        <Image
          alt={product.featuredImage.altText || product.title}
          aspectRatio="1/1"
          data={product.featuredImage}
          loading={loading}
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      )}
      <div className="p-4">
        <h3 className="font-medium mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          {product.title}
        </h3>
        <div className="flex items-center justify-between">
          <Money
            data={product.priceRange.minVariantPrice}
            className="text-lg font-semibold"
          />
          {product.compareAtPriceRange?.minVariantPrice &&
            product.compareAtPriceRange.minVariantPrice.amount >
              product.priceRange.minVariantPrice.amount && (
              <Money
                data={product.compareAtPriceRange.minVariantPrice}
                className="text-sm text-gray-500 line-through"
              />
            )}
        </div>
      </div>
    </Link>
  );
}

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image {
        id
        url
        altText
        width
        height
      }
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
`;

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 1) {
      nodes {
        id
      }
    }
  }
` as const;