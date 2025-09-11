import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {
  useLoaderData,
  type MetaFunction,
  useSearchParams,
  useLocation,
} from '@remix-run/react';
import {
  Image,
  Money,
  VariantSelector,
  type VariantOption,
  getSelectedProductOptions,
  CartForm,
} from '@shopify/hydrogen';
import type {
  ProductFragment,
  ProductVariantFragment,
} from 'storefrontapi.generated';
import {getCurrentSeason, getSeasonalTheme} from '~/lib/seasonal';
import {seoPayload} from '~/lib/seo.server';
import {useState} from 'react';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return seoPayload.product({
    product: data?.product,
    url: data?.url || '',
  });
};

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const selectedOptions = getSelectedProductOptions(request);
  const currentSeason = getCurrentSeason();
  const seasonalTheme = getSeasonalTheme(currentSeason);

  const {product} = await storefront.query(PRODUCT_QUERY, {
    variables: {handle, selectedOptions},
  });

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  const firstVariant = product.variants.nodes[0];
  const firstVariantIsDefault = Boolean(
    firstVariant.selectedOptions.find(
      (option: VariantOption) =>
        option.name === 'Title' && option.value === 'Default Title',
    ),
  );

  if (firstVariantIsDefault) {
    product.selectedVariant = firstVariant;
  } else {
    // if no selected variant was returned from the selected options,
    // we redirect to the first variant's URL to update the URL
    if (!product.selectedVariant) {
      throw redirectToFirstVariant({product, request});
    }
  }

  return defer({
    product,
    currentSeason,
    seasonalTheme,
    url: request.url,
  });
}

export default function Product() {
  const {product, seasonalTheme} = useLoaderData<typeof loader>();
  const {selectedVariant} = product;

  return (
    <div className="product">
      <div className="container-fluid py-12">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <ProductImage product={product} />
          <ProductMain
            selectedVariant={selectedVariant}
            product={product}
            variants={product.variants}
            seasonalTheme={seasonalTheme}
          />
        </div>
        
        <div className="mt-16">
          <ProductDescription product={product} />
        </div>
        
        <div className="mt-16">
          <RecommendedProducts />
        </div>
      </div>
    </div>
  );
}

function ProductImage({product}: {product: ProductFragment}) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const images = product.images.nodes;

  if (!images.length) {
    return <div className="h-96 bg-gray-200 rounded-lg" />;
  }

  return (
    <div className="space-y-4">
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <Image
          alt={images[selectedImageIndex].altText || product.title}
          data={images[selectedImageIndex]}
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>
      
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImageIndex(index)}
              className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
                index === selectedImageIndex
                  ? 'border-black'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Image
                alt={image.altText || `${product.title} ${index + 1}`}
                data={image}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductMain({
  selectedVariant,
  product,
  variants,
  seasonalTheme,
}: {
  selectedVariant: ProductFragment['selectedVariant'];
  product: ProductFragment;
  variants: ProductFragment['variants'];
  seasonalTheme: any;
}) {
  const {title, vendor} = product;

  return (
    <div className="product-main space-y-6">
      {vendor && <p className="text-sm text-gray-600 uppercase tracking-wide">{vendor}</p>}
      
      <h1 
        className="text-3xl font-bold"
        style={{ color: seasonalTheme.colors.primary }}
      >
        {title}
      </h1>
      
      <ProductPrice selectedVariant={selectedVariant} />
      
      <VariantSelector
        handle={product.handle}
        options={product.options}
        variants={variants}
      >
        {({option}) => <ProductOptions key={option.name} option={option} />}
      </VariantSelector>
      
      <ProductForm selectedVariant={selectedVariant} seasonalTheme={seasonalTheme} />
      
      <ProductDetails product={product} />
    </div>
  );
}

function ProductPrice({
  selectedVariant,
}: {
  selectedVariant: ProductFragment['selectedVariant'];
}) {
  if (!selectedVariant?.price) {
    return null;
  }

  return (
    <div className="product-price">
      <div className="flex items-center space-x-4">
        <Money
          data={selectedVariant.price}
          className="text-2xl font-bold"
        />
        {selectedVariant.compareAtPrice && (
          <Money
            data={selectedVariant.compareAtPrice}
            className="text-lg text-gray-500 line-through"
          />
        )}
      </div>
      {selectedVariant.availableForSale ? (
        <p className="text-green-600 text-sm font-medium">In stock</p>
      ) : (
        <p className="text-red-600 text-sm font-medium">Out of stock</p>
      )}
    </div>
  );
}

function ProductOptions({option}: {option: VariantOption}) {
  return (
    <div className="product-options">
      <h5 className="font-medium mb-3">{option.name}</h5>
      <div className="flex flex-wrap gap-2">
        {option.values.map(({value, isAvailable, isActive, to}) => (
          <a
            key={option.name + value}
            href={to}
            preventScrollReset
            className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
              isActive
                ? 'border-black bg-black text-white'
                : isAvailable
                ? 'border-gray-300 hover:border-black'
                : 'border-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            style={{
              opacity: isAvailable ? 1 : 0.5,
            }}
          >
            {value}
          </a>
        ))}
      </div>
    </div>
  );
}

function ProductForm({
  selectedVariant,
  seasonalTheme,
}: {
  selectedVariant: ProductFragment['selectedVariant'];
  seasonalTheme: any;
}) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="product-form">
      <div className="flex items-center space-x-4 mb-4">
        <label htmlFor="quantity" className="font-medium">
          Quantity:
        </label>
        <div className="flex items-center border rounded-md">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-2 hover:bg-gray-100"
          >
            -
          </button>
          <input
            id="quantity"
            name="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            min="1"
            className="w-20 text-center border-0 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="px-3 py-2 hover:bg-gray-100"
          >
            +
          </button>
        </div>
      </div>

      <CartForm
        route="/cart"
        inputs={{
          lines: selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity,
                },
              ]
            : [],
        }}
        action={CartForm.ACTIONS.LinesAdd}
      >
        {(fetcher) => (
          <>
            <AddToCartButton
              disabled={!selectedVariant || !selectedVariant.availableForSale}
              onClick={() => {
                window.location.href = window.location.href + '#cart-aside';
              }}
              lines={
                selectedVariant
                  ? [
                      {
                        merchandiseId: selectedVariant.id,
                        quantity,
                      },
                    ]
                  : []
              }
              seasonalTheme={seasonalTheme}
            >
              {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
            </AddToCartButton>
          </>
        )}
      </CartForm>
    </div>
  );
}

function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
  seasonalTheme,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<{merchandiseId: string; quantity: number}>;
  onClick?: () => void;
  seasonalTheme: any;
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher) => (
        <button
          type="submit"
          onClick={onClick}
          disabled={disabled ?? fetcher.state !== 'idle'}
          className="w-full btn btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: seasonalTheme.colors.primary,
            borderColor: seasonalTheme.colors.primary,
          }}
        >
          {children}
        </button>
      )}
    </CartForm>
  );
}

function ProductDetails({product}: {product: ProductFragment}) {
  return (
    <div className="product-details space-y-4">
      <details className="group">
        <summary className="flex justify-between items-center cursor-pointer font-medium py-2">
          Description
          <span className="group-open:rotate-180 transition-transform">↓</span>
        </summary>
        <div className="prose prose-sm max-w-none text-gray-600 mt-2">
          {product.description ? (
            <p>{product.description}</p>
          ) : (
            <p>No description available for this product.</p>
          )}
        </div>
      </details>

      <details className="group">
        <summary className="flex justify-between items-center cursor-pointer font-medium py-2">
          Shipping & Returns
          <span className="group-open:rotate-180 transition-transform">↓</span>
        </summary>
        <div className="prose prose-sm max-w-none text-gray-600 mt-2">
          <p>Free shipping on orders over $75. Returns accepted within 30 days.</p>
        </div>
      </details>

      <details className="group">
        <summary className="flex justify-between items-center cursor-pointer font-medium py-2">
          Size Guide
          <span className="group-open:rotate-180 transition-transform">↓</span>
        </summary>
        <div className="prose prose-sm max-w-none text-gray-600 mt-2">
          <p>Check our size guide to find the perfect fit for your costume.</p>
        </div>
      </details>
    </div>
  );
}

function ProductDescription({product}: {product: ProductFragment}) {
  if (!product.description) return null;

  return (
    <div className="product-description">
      <h2 className="text-2xl font-bold mb-6">Product Description</h2>
      <div className="prose max-w-none">
        <p>{product.description}</p>
      </div>
    </div>
  );
}

function RecommendedProducts() {
  return (
    <div className="recommended-products">
      <h2 className="text-2xl font-bold mb-6">You might also like</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* This would normally fetch and display recommended products */}
        <div className="text-gray-500 text-center py-8 col-span-full">
          Recommended products will appear here
        </div>
      </div>
    </div>
  );
}

function redirectToFirstVariant({
  product,
  request,
}: {
  product: ProductFragment;
  request: Request;
}) {
  const url = new URL(request.url);
  const firstVariant = product.variants.nodes[0];

  return redirect(
    `/products/${product.handle}?${firstVariant.selectedOptions
      .map(
        (option) =>
          `${option.name}=${encodeURIComponent(option.value)}`,
      )
      .join('&')}`,
    {
      status: 302,
    },
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
`;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    options {
      name
      values
    }
    images(first: 20) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    variants(first: 1) {
      nodes {
        ...ProductVariant
      }
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;