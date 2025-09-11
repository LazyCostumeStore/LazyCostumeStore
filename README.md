# LazyCostumeStore - Shopify Hydrogen Storefront

A secure, automated, multi-season Shopify Hydrogen storefront for LazyCostumeShop featuring dynamic seasonal theming, bulk product management, and Printful integration.

## Features

### 🎨 Dynamic Seasonal Theming
- **Automatic seasonal theme switching** based on date
- **4 Pre-configured themes**: Halloween, Christmas, Valentine's Day, Easter
- **Dynamic asset swapping**: headers, footers, backgrounds, hero images
- **Seasonal color schemes** integrated with Tailwind CSS
- **Custom fonts** for each seasonal theme

### 🛍️ E-commerce Core
- **Complete Shopify Hydrogen storefront** with modern React architecture
- **Product catalog** with collections, filtering, and search
- **Shopping cart** with full checkout integration
- **Customer accounts** with order history and profile management
- **Responsive design** optimized for all devices

### 🔧 Backend Automation
- **Bulk product upload API** for efficient inventory management
- **Printful SKU synchronization** with automated webhook handling
- **Inventory sync** between Shopify and Printful
- **Order fulfillment tracking** with automatic status updates

### 🔒 Security & Performance
- **Environment variable management** with `.env` protection
- **Rate limiting** on API endpoints
- **API key authentication** for backend operations
- **HMAC webhook verification** for Printful integration
- **TypeScript** for type safety and maintainability

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Shopify store with Storefront API access
- Printful account (optional, for print-on-demand)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Mr-Hub00/LazyCostumeStore.git
   cd LazyCostumeStore
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your actual values:
   ```env
   # Shopify Configuration
   PRIVATE_SHOPIFY_STORE_ID=your-shop-name
   PUBLIC_SHOPIFY_STORE_DOMAIN=your-shop-name.myshopify.com
   PRIVATE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token
   PUBLIC_STOREFRONT_API_TOKEN=your-public-token
   PUBLIC_STOREFRONT_ID=your-storefront-id
   
   # Session Management
   SESSION_SECRET=your-long-random-secret
   
   # Printful Integration (Optional)
   PRINTFUL_API_TOKEN=your-printful-api-token
   PRINTFUL_WEBHOOK_SECRET=your-printful-webhook-secret
   
   # Backend APIs
   BULK_UPLOAD_API_KEY=your-bulk-upload-api-key
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## Seasonal Theming

The storefront automatically switches themes based on the current date:

- **Halloween**: October 1 - November 2
- **Christmas**: December 1 - December 31  
- **Valentine's Day**: February 1 - February 18
- **Easter**: March 15 - April 15
- **Default**: All other times

### Custom Theme Configuration

Themes are configured in `app/lib/seasonal.ts`. Each theme includes:

```typescript
{
  id: 'halloween',
  name: 'Halloween',
  period: { start: { month: 10, day: 1 }, end: { month: 11, day: 2 } },
  colors: { primary: '#FF6B35', secondary: '#6B46C1', ... },
  assets: { headerLogo: '/assets/halloween/logo.svg', ... },
  styles: { className: 'theme-halloween', fontFamily: 'Creepster, cursive' }
}
```

## API Endpoints

### Bulk Product Upload
```bash
POST /api/bulk-upload
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

[
  {
    "title": "Vampire Costume",
    "handle": "vampire-costume",
    "vendor": "LazyCostume Co",
    "price": "49.99",
    "description": "Classic vampire costume...",
    "tags": ["halloween", "vampire", "adult"]
  }
]
```

### Printful Synchronization
```bash
POST /api/printful-sync
Authorization: Bearer YOUR_PRINTFUL_TOKEN
Content-Type: application/json

{
  "action": "sync_inventory",
  "products": [...]
}
```

### Webhook Endpoints
- **Printful Webhooks**: `/api/printful-webhook`
- **Order Updates**: Automatic handling of shipments, returns, cancellations

## Deployment

### Shopify Oxygen (Recommended)

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Oxygen:**
   ```bash
   npx shopify hydrogen deploy
   ```

3. **Set environment variables** in Shopify Partners dashboard

### Alternative Deployment Options
- **Vercel**: `vercel deploy`
- **Netlify**: `netlify deploy`
- **Docker**: Use included Dockerfile

## Development

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run typecheck` - Run TypeScript checks
- `npm test` - Run tests

### Project Structure
```
app/
├── components/          # React components
├── routes/             # Remix routes
├── lib/                # Utilities and helpers
├── styles/             # CSS and styling
└── types/              # TypeScript definitions

tests/                  # Test files
public/                 # Static assets
```

## Security

- **Environment variables** are excluded from Git via `.gitignore`
- **API authentication** required for bulk operations
- **Webhook signature verification** prevents unauthorized requests
- **Rate limiting** protects against abuse
- **Input validation** on all API endpoints

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Run tests: `npm test`
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or issues:
- Create an issue in this repository
- Contact the development team
- Check the [Shopify Hydrogen documentation](https://shopify.dev/docs/custom-storefronts/hydrogen)

---

Built with ❤️ using Shopify Hydrogen, React, TypeScript, and Tailwind CSS
