import {json, type ActionFunctionArgs} from '@shopify/remix-oxygen';

export async function action({request, context}: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  try {
    // Verify webhook signature
    const signature = request.headers.get('X-Printful-Signature');
    const body = await request.text();
    
    if (!verifyPrintfulWebhook(body, signature, context.env.PRINTFUL_WEBHOOK_SECRET)) {
      return json({error: 'Invalid signature'}, {status: 401});
    }

    const data = JSON.parse(body);
    
    switch (data.type) {
      case 'package_shipped':
        await handlePackageShipped(data, context);
        break;
      case 'package_returned':
        await handlePackageReturned(data, context);
        break;
      case 'order_failed':
        await handleOrderFailed(data, context);
        break;
      case 'order_canceled':
        await handleOrderCanceled(data, context);
        break;
      case 'product_synced':
        await handleProductSynced(data, context);
        break;
      default:
        console.log('Unknown webhook type:', data.type);
    }

    return json({success: true});

  } catch (error) {
    console.error('Printful webhook error:', error);
    return json({error: 'Internal server error'}, {status: 500});
  }
}

function verifyPrintfulWebhook(body: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  
  // Implement HMAC verification
  const crypto = require('crypto');
  const hash = crypto.createHmac('sha256', secret).update(body).digest('hex');
  return hash === signature;
}

async function handlePackageShipped(data: any, context: any) {
  // Update order status in Shopify
  console.log('Package shipped:', data);
  
  // You would typically:
  // 1. Update the order fulfillment status
  // 2. Send tracking information to customer
  // 3. Update inventory if needed
}

async function handlePackageReturned(data: any, context: any) {
  console.log('Package returned:', data);
  
  // Handle returns:
  // 1. Update order status
  // 2. Process refund if applicable
  // 3. Update inventory
}

async function handleOrderFailed(data: any, context: any) {
  console.log('Order failed:', data);
  
  // Handle failed orders:
  // 1. Notify customer
  // 2. Process refund
  // 3. Update order status
}

async function handleOrderCanceled(data: any, context: any) {
  console.log('Order canceled:', data);
  
  // Handle canceled orders:
  // 1. Process refund
  // 2. Update inventory
  // 3. Notify customer
}

async function handleProductSynced(data: any, context: any) {
  console.log('Product synced:', data);
  
  // Handle product sync:
  // 1. Update product information
  // 2. Sync inventory levels
  // 3. Update pricing if changed
}

export async function loader() {
  return json({
    message: 'Printful webhook endpoint',
    supportedEvents: [
      'package_shipped',
      'package_returned', 
      'order_failed',
      'order_canceled',
      'product_synced',
    ],
  });
}