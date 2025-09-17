import {useLoaderData} from 'react-router';
import ProductGrid from '~/components/ProductGrid';

const PRODUCTS_QUERY = `#graphql
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

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */

export async function loader({context}) {
  // Query products on the server using the provided storefront client
  const {products} = await context.storefront.query(PRODUCTS_QUERY, {
    variables: {first: 12},
  });

  return {products};
}

export default function ProductsIndex() {
  const {products} = useLoaderData();

  const nodes = products?.nodes ?? [];

  return (
    <main>
      <h1>All Products</h1>
      <ProductGrid products={nodes} />
    </main>
  );
}