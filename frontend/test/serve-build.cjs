const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../build');
const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json' };
http.createServer((req, res) => {
  const relative = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).replace(/^\/+/, '');
  let target = path.resolve(root, relative);
  if (target !== root && !target.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) target = path.join(root, 'index.html');
  res.setHeader('Content-Type', types[path.extname(target)] || 'application/octet-stream');
  res.setHeader('Cache-Control', 'no-store');
  fs.createReadStream(target).pipe(res);
}).listen(Number(process.env.PORT || 3000), '127.0.0.1', () => console.log('Local review build: http://127.0.0.1:' + (process.env.PORT || 3000)));
