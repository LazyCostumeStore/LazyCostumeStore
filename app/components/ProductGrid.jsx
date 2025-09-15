import React from 'react';
import {ProductProvider, Link, Image, Money} from '@shopify/hydrogen';

export default function ProductGrid({products}) {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <article key={product.id} className="product-card">
          <Link to={`/products/${product.handle}`}>
            <div className="product-image">
              {product.featuredImage?.url ? (
                <Image data={product.featuredImage} alt={product.title} />
              ) : (
                <div className="placeholder">No image</div>
              )}
            </div>
            <h3>{product.title}</h3>
            <div>
              <Money data={product.priceRange?.minVariantPrice} />
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}