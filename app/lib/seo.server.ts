import type {Shop} from '@shopify/hydrogen/storefront-api-types';

type SeoConfig = {
  shop: {
    name: string;
    description: string;
  };
  url: string;
  titleTemplate?: string;
  title?: string;
  description?: string;
  handle?: string;
  jsonLd?: object;
};

export const seoPayload = {
  root: ({shop, url}: {shop: {name: string; description: string}; url: string}) => ({
    title: shop?.name || 'LazyCostumeStore',
    titleTemplate: '%s | LazyCostumeStore',
    description: shop?.description || 'Your one-stop shop for amazing costumes for every season and occasion.',
    handle: 'root',
    url,
    robots: {
      noIndex: false,
      noFollow: false,
    },
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: shop?.name || 'LazyCostumeStore',
      description: shop?.description || 'Your one-stop shop for amazing costumes for every season and occasion.',
      url,
    },
  }),
  
  home: () => ({
    title: 'Home',
    description: 'Discover amazing costumes for Halloween, Christmas, Valentine\'s Day, Easter, and more!',
    robots: {
      noIndex: false,
      noFollow: false,
    },
  }),
  
  collection: ({
    collection,
    url,
  }: {
    collection?: {name: string; description?: string; handle: string};
    url: string;
  }) => ({
    title: collection?.name,
    description: collection?.description || `Browse our ${collection?.name} collection`,
    handle: collection?.handle,
    url,
    robots: {
      noIndex: false,
      noFollow: false,
    },
  }),
  
  product: ({
    product,
    url,
  }: {
    product?: {
      title: string;
      description?: string;
      handle: string;
      vendor?: string;
      variants?: {
        nodes: Array<{
          price: {amount: string; currencyCode: string};
          availableForSale: boolean;
        }>;
      };
      featuredImage?: {
        url: string;
        altText?: string;
        width?: number;
        height?: number;
      };
    };
    url: string;
  }) => {
    const variant = product?.variants?.nodes?.[0];
    return {
      title: product?.title,
      description: product?.description || `Shop ${product?.title} and more costumes at LazyCostumeStore`,
      handle: product?.handle,
      url,
      robots: {
        noIndex: false,
        noFollow: false,
      },
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product?.title,
        description: product?.description,
        brand: {
          '@type': 'Brand',
          name: product?.vendor || 'LazyCostumeStore',
        },
        image: product?.featuredImage?.url,
        offers: variant ? {
          '@type': 'Offer',
          price: variant.price.amount,
          priceCurrency: variant.price.currencyCode,
          availability: variant.availableForSale 
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        } : undefined,
      },
    };
  },
  
  page: ({
    page,
    url,
  }: {
    page?: {title: string; body?: string; handle: string};
    url: string;
  }) => ({
    title: page?.title,
    description: page?.body ? page.body.substring(0, 160) : `Learn more about ${page?.title}`,
    handle: page?.handle,
    url,
    robots: {
      noIndex: false,
      noFollow: false,
    },
  }),
  
  policy: ({
    policy,
    url,
  }: {
    policy?: {title: string; body?: string; handle: string};
    url: string;
  }) => ({
    title: policy?.title,
    description: policy?.body ? policy.body.substring(0, 160) : `Read our ${policy?.title}`,
    handle: policy?.handle,
    url,
    robots: {
      noIndex: false,
      noFollow: false,
    },
  }),
};