// Generated types for Shopify Storefront API
export interface CartApiQueryFragment {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: {
    nodes: Array<{
      id: string;
      quantity: number;
      cost: {
        totalAmount: {
          amount: string;
          currencyCode: string;
        };
        amountPerQuantity: {
          amount: string;
          currencyCode: string;
        };
        compareAtAmountPerQuantity?: {
          amount: string;
          currencyCode: string;
        };
      };
      merchandise: {
        id: string;
        title: string;
        product: {
          title: string;
          handle: string;
        };
        image?: {
          url: string;
          altText?: string;
        };
      };
    }>;
  };
  cost: {
    subtotalAmount: {
      amount: string;
      currencyCode: string;
    };
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
  discountCodes: Array<{
    code: string;
    applicable: boolean;
  }>;
}

export interface HeaderQuery {
  shop: {
    id: string;
    name: string;
    primaryDomain: {
      url: string;
    };
  };
  menu: {
    id: string;
    items: Array<{
      id: string;
      title: string;
      url: string;
      items?: Array<{
        id: string;
        title: string;
        url: string;
      }>;
    }>;
  };
}

export interface ProductFragment {
  id: string;
  title: string;
  handle: string;
  description: string;
  vendor?: string;
  images: {
    nodes: Array<{
      id: string;
      url: string;
      altText?: string;
      width?: number;
      height?: number;
    }>;
  };
  options: Array<{
    name: string;
    values: string[];
  }>;
  variants: {
    nodes: Array<ProductVariantFragment>;
  };
  selectedVariant?: ProductVariantFragment;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  compareAtPriceRange?: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  featuredImage?: {
    id: string;
    url: string;
    altText?: string;
    width?: number;
    height?: number;
  };
}

export interface ProductVariantFragment {
  id: string;
  title: string;
  availableForSale: boolean;
  price: {
    amount: string;
    currencyCode: string;
  };
  compareAtPrice?: {
    amount: string;
    currencyCode: string;
  };
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
  image?: {
    id: string;
    url: string;
    altText?: string;
    width?: number;
    height?: number;
  };
}

export interface ProductItemFragment {
  id: string;
  title: string;
  handle: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  compareAtPriceRange?: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  featuredImage?: {
    id: string;
    url: string;
    altText?: string;
    width?: number;
    height?: number;
  };
  variants: {
    nodes: Array<{
      id: string;
    }>;
  };
}

export interface CollectionFragment {
  id: string;
  title: string;
  handle: string;
  description?: string;
  image?: {
    id: string;
    url: string;
    altText?: string;
    width?: number;
    height?: number;
  };
  products?: {
    nodes: ProductItemFragment[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string;
      endCursor?: string;
    };
  };
}

export interface FeaturedCollectionFragment {
  id: string;
  title: string;
  handle: string;
  description?: string;
  image?: {
    id: string;
    url: string;
    altText?: string;
    width?: number;
    height?: number;
  };
}

export interface RecommendedProductsQuery {
  products: {
    nodes: Array<{
      id: string;
      title: string;
      handle: string;
      priceRange: {
        minVariantPrice: {
          amount: string;
          currencyCode: string;
        };
      };
      featuredImage?: {
        id: string;
        url: string;
        altText?: string;
        width?: number;
        height?: number;
      };
      variants: {
        nodes: Array<{
          id: string;
        }>;
      };
    }>;
  };
}