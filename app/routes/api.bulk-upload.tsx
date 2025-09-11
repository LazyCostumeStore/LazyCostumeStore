import {json, type ActionFunctionArgs} from '@shopify/remix-oxygen';

export async function action({request, context}: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  try {
    // Verify API key for authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return json({error: 'Unauthorized'}, {status: 401});
    }

    const apiKey = authHeader.replace('Bearer ', '');
    // In production, verify this against stored API keys
    if (apiKey !== context.env.BULK_UPLOAD_API_KEY) {
      return json({error: 'Invalid API key'}, {status: 401});
    }

    const products = await request.json();
    
    if (!Array.isArray(products)) {
      return json({error: 'Expected array of products'}, {status: 400});
    }

    const results = await Promise.allSettled(
      products.map((product) => createProduct(product, context))
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected');

    return json({
      message: `Processed ${products.length} products`,
      successful,
      failed: failed.length,
      errors: failed.map(f => f.status === 'rejected' ? f.reason : null).filter(Boolean),
    });

  } catch (error) {
    console.error('Bulk upload error:', error);
    return json({error: 'Internal server error'}, {status: 500});
  }
}

async function createProduct(productData: any, context: any) {
  const {storefront} = context;
  
  // Validate required fields
  const requiredFields = ['title', 'handle', 'vendor'];
  for (const field of requiredFields) {
    if (!productData[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // Create product using Shopify Admin API
  const mutation = `
    mutation productCreate($input: ProductInput!) {
      productCreate(input: $input) {
        product {
          id
          title
          handle
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      title: productData.title,
      handle: productData.handle,
      vendor: productData.vendor,
      productType: productData.productType || 'Costume',
      descriptionHtml: productData.description || '',
      status: productData.status || 'DRAFT',
      tags: productData.tags || [],
      images: productData.images || [],
      variants: productData.variants || [{
        price: productData.price || '0.00',
        inventoryQuantity: productData.quantity || 0,
      }],
    },
  };

  // Note: This would need to use the Admin API, not Storefront API
  // For now, this is a placeholder showing the structure
  const response = await storefront.query(mutation, {variables});
  
  if (response.productCreate?.userErrors?.length > 0) {
    throw new Error(response.productCreate.userErrors[0].message);
  }

  return response.productCreate?.product;
}

export async function loader() {
  return json({
    message: 'Bulk product upload endpoint',
    method: 'POST',
    authentication: 'Bearer token required',
    format: 'JSON array of product objects',
  });
}