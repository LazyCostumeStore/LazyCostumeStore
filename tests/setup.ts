import '@testing-library/jest-dom';

// Mock environment variables for tests
process.env.PUBLIC_STORE_DOMAIN = 'test-store.myshopify.com';
process.env.PUBLIC_STOREFRONT_API_TOKEN = 'test-token';
process.env.SESSION_SECRET = 'test-secret';