try {
  // Prefer the built SSR server bundle. Oxygen expects a root `index.js`.
  module.exports = require('./dist/server/index.js');
} catch (err) {
  // If the bundle isn't present, log a helpful message and exit gracefully.
  console.error('Could not load ./dist/server/index.js — run `npm run build` first.');
  if (require.main === module) process.exit(1);
}
import{createServer as n}from"node:http";const o=n((t,e)=>{e.writeHead(200,{"Content-Type":"text/plain"}),e.end(`Hello World!
`)});o.listen(3e3,"127.0.0.1",()=>{console.log("Listening on 127.0.0.1:3000")});
//# sourceMappingURL=index.js.map
