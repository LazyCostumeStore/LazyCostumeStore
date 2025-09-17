// Minimal entry wrapper for Oxygen deployments
// This file ensures the platform finds an `index.js` entry when uploading.
try {
  module.exports = require('./dist/server/index.js');
} catch (e) {
  // If the server bundle isn't built yet, provide a helpful error.
  console.error('Could not load server bundle at ./dist/server/index.js. Run `npm run build` first.');
  throw e;
}
