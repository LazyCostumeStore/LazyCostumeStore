import {useLoaderData} from 'react-router';
import {gql} from 'graphql-tag';
import ProductGrid from '~/components/ProductGrid';
import {useShopQuery, flattenConnection} from '@shopify/hydrogen';

const PRODUCTS_QUERY = gql`
  query Products($first: Int = 12, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    products(first: $first) {
      nodes {
        id
        handle
        title
        featuredImage {
          id
          url
          altText
          width
          height
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

export async function loader({request}) {
  // The app load context in this project already creates a storefront client
  const {storefront} = await import('~/lib/context'); // or use createAppLoadContext
  // But Hydrogen helper useShopQuery runs on server within components; use loader to pass props
  return null;
}

// Simple client component using useShopQuery
export default function ProductsIndex() {
  const {data} = useShopQuery({
    query: PRODUCTS_QUERY,
    variables: {first: 12},
  });

  const products = data?.products?.nodes ?? [];

  return (
    <main>
      <h1>All Products</h1>
      <ProductGrid products={products} />
    </main>
  );
}