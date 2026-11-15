import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

const files = new Map([
  ['/index.html', 'text/html; charset=utf-8'],
  ['/adventure.css', 'text/css; charset=utf-8'],
  ['/progress.js', 'text/javascript; charset=utf-8'],
  ['/tracing.js', 'text/javascript; charset=utf-8'],
  ['/style.css', 'text/css; charset=utf-8'],
  ['/app.js', 'text/javascript; charset=utf-8'],
  ['/lessons.js', 'text/javascript; charset=utf-8'],
  ['/assets/kitten-stickers.png', 'image/png'],
  ['/assets/countryside.jpg', 'image/jpeg'],
  ['/assets/town.svg', 'image/svg+xml'],
  ['/assets/cats.svg', 'image/svg+xml'],
]);

const port = Number(process.env.PORT ?? 9018);
createServer(async (req, res) => {
  const path = req.url?.split('?')[0];
  const file = path === '/' ? '/index.html' : path;
  const type = files.get(file);
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(405, { Allow: 'GET, HEAD' }).end();
  } else if (!type) {
    res.writeHead(404).end('Not found');
  } else {
    try {
      const contents = await readFile(new URL('./dist' + file, import.meta.url));
      res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-cache' });
      res.end(req.method === 'GET' ? contents : undefined);
    } catch (error) {
      console.error(error.message);
      res.writeHead(500).end('Unable to read a local asset');
    }
  }
}).listen(port, '127.0.0.1', () => console.log('喵喵识字镇 · http://127.0.0.1:' + port));
