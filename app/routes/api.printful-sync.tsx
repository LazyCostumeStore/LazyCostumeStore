import {json, type ActionFunctionArgs, type LoaderFunctionArgs} from '@shopify/remix-oxygen';

// Rate limiting storage (in production, use Redis or database)
const rateLimitStore = new Map<string, {count: number; resetTime: number}>();

export async function action({request, context}: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  try {
    // Apply rate limiting
    const clientIP = request.headers.get('CF-Connecting-IP') || 
                    request.headers.get('X-Forwarded-For') || 
                    'unknown';
    
    if (!checkRateLimit(clientIP)) {
      return json({error: 'Rate limit exceeded'}, {status: 429});
    }

    // Authenticate request
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return json({error: 'Unauthorized'}, {status: 401});
    }

    const apiKey = authHeader.replace('Bearer ', '');
    if (apiKey !== context.env.PRINTFUL_API_TOKEN) {
      return json({error: 'Invalid API key'}, {status: 401});
    }

    const {action: syncAction, products} = await request.json();

    switch (syncAction) {
      case 'sync_inventory':
        return await syncInventory(products, context);
      case 'sync_products':
        return await syncProducts(products, context);
      case 'get_products':
        return await getPrintfulProducts(context);
      default:
        return json({error: 'Invalid action'}, {status: 400});
    }

  } catch (error) {
    console.error('Printful sync error:', error);
    return json({error: 'Internal server error'}, {status: 500});
  }
}

async function syncInventory(products: any[], context: any) {
  const results = [];
  
  for (const product of products) {
    try {
      // Sync inventory with Printful
      const printfulResponse = await fetch(`https://api.printful.com/store/products/${product.printfulId}`, {
        headers: {
          'Authorization': `Bearer ${context.env.PRINTFUL_API_TOKEN}`,
        },
      });

      if (printfulResponse.ok) {
        const printfulData = await printfulResponse.json();
        
        // Update Shopify inventory
        // This would use the Admin API to update inventory levels
        results.push({
          productId: product.productId,
          sku: product.sku,
          inventory: printfulData.result.sync_variants?.[0]?.availability,
          status: 'synced',
        });
      } else {
        results.push({
          productId: product.productId,
          sku: product.sku,
          status: 'error',
          error: 'Failed to fetch from Printful',
        });
      }
    } catch (error) {
      results.push({
        productId: product.productId,
        sku: product.sku,
        status: 'error',
        error: error.message,
      });
    }
  }

  return json({
    message: 'Inventory sync completed',
    results,
  });
}

async function syncProducts(products: any[], context: any) {
  const results = [];

  for (const product of products) {
    try {
      // Create or update product in Printful
      const printfulPayload = {
        sync_product: {
          name: product.title,
          thumbnail: product.image,
        },
        sync_variants: product.variants.map((variant: any) => ({
          retail_price: variant.price,
          variant_id: variant.printfulVariantId,
          files: variant.files || [],
        })),
      };

      const response = await fetch('https://api.printful.com/store/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${context.env.PRINTFUL_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(printfulPayload),
      });

      if (response.ok) {
        const data = await response.json();
        results.push({
          productId: product.id,
          printfulId: data.result.id,
          status: 'synced',
        });
      } else {
        const error = await response.text();
        results.push({
          productId: product.id,
          status: 'error',
          error,
        });
      }
    } catch (error) {
      results.push({
        productId: product.id,
        status: 'error',
        error: error.message,
      });
    }
  }

  return json({
    message: 'Product sync completed',
    results,
  });
}

async function getPrintfulProducts(context: any) {
  try {
    const response = await fetch('https://api.printful.com/store/products', {
      headers: {
        'Authorization': `Bearer ${context.env.PRINTFUL_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Printful products');
    }

    const data = await response.json();
    return json({
      products: data.result,
    });
  } catch (error) {
    return json({error: error.message}, {status: 500});
  }
}

function checkRateLimit(clientIP: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxRequests = 100; // 100 requests per minute

  const clientData = rateLimitStore.get(clientIP);
  
  if (!clientData || now > clientData.resetTime) {
    // Reset or initialize
    rateLimitStore.set(clientIP, {
      count: 1,
      resetTime: now + windowMs,
    });
    return true;
  }

  if (clientData.count >= maxRequests) {
    return false;
  }

  clientData.count++;
  return true;
}

export async function loader() {
  return json({
    message: 'Printful SKU synchronization endpoint',
    methods: ['POST'],
    actions: [
      'sync_inventory',
      'sync_products', 
      'get_products',
    ],
    rateLimit: '100 requests per minute',
  });
}