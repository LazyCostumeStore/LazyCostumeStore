import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {
  Pagination,
  getPaginationVariables,
  Image,
  Money,
} from '@shopify/hydrogen';
import type {CollectionFragment} from 'storefrontapi.generated';
import {getCurrentSeason, getSeasonalTheme} from '~/lib/seasonal';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `LazyCostumeStore | Collections`}];
};

export async function loader({request, context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });
  
  const currentSeason = getCurrentSeason();
  const seasonalTheme = getSeasonalTheme(currentSeason);

  const {collections} = await storefront.query(COLLECTIONS_QUERY, {
    variables: paginationVariables,
  });

  return defer({
    collections,
    currentSeason,
    seasonalTheme,
  });
}

export default function Collections() {
  const {collections, seasonalTheme} = useLoaderData<typeof loader>();

  return (
    <div className="collections">
      <div className="container-fluid py-12">
        <header className="text-center mb-12">
          <h1 
            className="text-4xl font-bold mb-4"
            style={{ 
              fontFamily: seasonalTheme.styles.fontFamily,
              color: seasonalTheme.colors.primary 
            }}
          >
            Our Collections
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our amazing costume collections for every season and occasion. 
            From spooky Halloween outfits to festive Christmas costumes and beyond!
          </p>
        </header>

        <Pagination connection={collections}>
          {({nodes, isLoading, PreviousLink, NextLink}) => (
            <>
              <PreviousLink>
                {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
              </PreviousLink>
              
              <CollectionsGrid collections={nodes} seasonalTheme={seasonalTheme} />
              
              <NextLink>
                {isLoading ? 'Loading...' : <span>Load more ↓</span>}
              </NextLink>
            </>
          )}
        </Pagination>
      </div>
    </div>
  );
}

function CollectionsGrid({
  collections, 
  seasonalTheme
}: {
  collections: CollectionFragment[];
  seasonalTheme: any;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {collections.map((collection, index) => (
        <CollectionItem
          key={collection.id}
          collection={collection}
          index={index}
          seasonalTheme={seasonalTheme}
        />
      ))}
    </div>
  );
}

function CollectionItem({
  collection,
  index,
  seasonalTheme,
}: {
  collection: CollectionFragment;
  index: number;
  seasonalTheme: any;
}) {
  return (
    <Link
      className="collection-item group card card-hover"
      key={collection.id}
      to={`/collections/${collection.handle}`}
      prefetch="intent"
    >
      {collection?.image && (
        <Image
          alt={collection.image.altText || collection.title}
          aspectRatio="4/3"
          data={collection.image}
          loading={index < 3 ? 'eager' : 'lazy'}
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      )}
      <div className="p-6">
        <h3 
          className="text-xl font-semibold mb-2 group-hover:color-primary transition-colors"
          style={{ color: seasonalTheme.colors.primary }}
        >
          {collection.title}
        </h3>
        {collection.description && (
          <p className="text-gray-600 text-sm line-clamp-3">
            {collection.description}
          </p>
        )}
        <div className="mt-4 flex items-center text-sm font-medium">
          <span 
            className="inline-flex items-center"
            style={{ color: seasonalTheme.colors.secondary }}
          >
            Explore Collection 
            <svg 
              className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    handle
    description
    image {
      id
      url
      altText
      width
      height
    }
  }
  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
` as const;