import {defer, type LoaderFunctionArgs, type MetaFunction} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import {getCurrentSeason, getSeasonalTheme} from '~/lib/seasonal';

export const meta: MetaFunction = () => {
  return [{title: 'LazyCostumeStore | Home'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const currentSeason = getCurrentSeason();
  const seasonalTheme = getSeasonalTheme(currentSeason);
  
  const {collections} = await storefront.query(FEATURED_COLLECTION_QUERY);
  const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);

  return defer({
    featuredCollection: collections.nodes[0],
    recommendedProducts,
    currentSeason,
    seasonalTheme,
  });
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  
  return (
    <div className="homepage">
      <HeroSection seasonalTheme={data.seasonalTheme} />
      <FeaturedCollection collection={data.featuredCollection} />
      <RecommendedProducts products={data.recommendedProducts} />
      <SeasonalHighlight seasonalTheme={data.seasonalTheme} />
    </div>
  );
}

function HeroSection({seasonalTheme}: {seasonalTheme: any}) {
  return (
    <section 
      className="hero relative h-screen flex items-center justify-center text-white"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${seasonalTheme.assets.heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="text-center space-y-6 max-w-4xl mx-auto px-4">
        <h1 
          className="text-5xl md:text-7xl font-bold animate-fade-in"
          style={{ 
            fontFamily: seasonalTheme.styles.fontFamily,
            color: seasonalTheme.colors.primary
          }}
        >
          Welcome to LazyCostumeStore
        </h1>
        <p className="text-xl md:text-2xl animate-slide-up">
          Discover amazing costumes for every season and occasion
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
          <Link
            to="/collections"
            className="btn btn-primary text-lg px-8 py-3"
            style={{ 
              backgroundColor: seasonalTheme.colors.primary,
              borderColor: seasonalTheme.colors.primary 
            }}
          >
            Shop Now
          </Link>
          <Link
            to="/collections/seasonal"
            className="btn btn-secondary text-lg px-8 py-3"
            style={{ 
              borderColor: seasonalTheme.colors.primary,
              color: seasonalTheme.colors.primary
            }}
          >
            Seasonal Collection
          </Link>
        </div>
      </div>
    </section>
  );
}

function FeaturedCollection({collection}: {collection: FeaturedCollectionFragment}) {
  if (!collection) return null;

  const image = collection?.image;
  return (
    <section className="py-16 bg-white">
      <div className="container-fluid">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">{collection.title}</h2>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              {collection.description}
            </p>
            <Link
              className="btn btn-primary"
              to={`/collections/${collection.handle}`}
            >
              View Collection
            </Link>
          </div>
          {image && (
            <div className="relative">
              <Image
                alt={image.altText || collection.title}
                aspectRatio="4/3"
                data={image}
                loading="eager"
                className="rounded-lg shadow-lg"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function RecommendedProducts({products}: {products: Promise<RecommendedProductsQuery>}) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container-fluid">
        <h2 className="text-3xl font-bold text-center mb-12">Recommended Products</h2>
        <Suspense fallback={<RecommendedProductsSkeleton />}>
          <Await resolve={products}>
            {(response) => (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {response.products.nodes.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </Await>
        </Suspense>
      </div>
    </section>
  );
}

function ProductCard({product}: {product: RecommendedProductsQuery['products']['nodes'][0]}) {
  const variant = product.variants.nodes[0];
  const variantUrl = `/products/${product.handle}${variant?.id ? `?variant=${variant.id}` : ''}`;

  return (
    <Link
      className="card card-hover group"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {product.featuredImage && (
        <Image
          alt={product.featuredImage.altText || product.title}
          aspectRatio="1/1"
          data={product.featuredImage}
          loading="lazy"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      )}
      <div className="p-4">
        <h4 className="font-medium mb-2 group-hover:text-blue-600 transition-colors">
          {product.title}
        </h4>
        <small className="text-gray-600">
          <Money data={product.priceRange.minVariantPrice} />
        </small>
      </div>
    </Link>
  );
}

function SeasonalHighlight({seasonalTheme}: {seasonalTheme: any}) {
  return (
    <section 
      className="py-20 text-white"
      style={{ backgroundColor: seasonalTheme.colors.secondary }}
    >
      <div className="container-fluid text-center">
        <h2 
          className="text-4xl font-bold mb-6"
          style={{ 
            fontFamily: seasonalTheme.styles.fontFamily,
            color: seasonalTheme.colors.accent
          }}
        >
          {seasonalTheme.name} Collection
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Get ready for {seasonalTheme.name.toLowerCase()} with our specially curated collection of costumes and accessories.
        </p>
        <Link
          to="/collections/seasonal"
          className="btn btn-primary text-lg px-8 py-3"
          style={{ 
            backgroundColor: seasonalTheme.colors.accent,
            borderColor: seasonalTheme.colors.accent,
            color: seasonalTheme.colors.background
          }}
        >
          Explore {seasonalTheme.name} Costumes
        </Link>
      </div>
    </section>
  );
}

function RecommendedProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({length: 4}).map((_, i) => (
        <div key={i} className="card animate-pulse">
          <div className="bg-gray-300 aspect-square"></div>
          <div className="p-4">
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
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
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      altText
      url
      width
      height
    }
    variants(first: 1) {
      nodes {
        id
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;