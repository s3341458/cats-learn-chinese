import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { activityPrompts, introTrack, lessons, storyTrack, wordTrack } from './dist/lessons.js';

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
  ['/assets/cards-town.jpg', 'image/jpeg'],
  ['/assets/cards-outdoors.jpg', 'image/jpeg'],
  ...Object.values(activityPrompts).map(({ track }) => [track, 'audio/mpeg']),
  ...lessons.flatMap((lesson) => [
    introTrack(lesson), storyTrack(lesson), ...[...lesson.words, ...lesson.phrases].map(wordTrack),
  ])
    .map((path) => [path, 'audio/mpeg']),
]);

function sendAsset(req, res, type, contents) {
  const headers = { 'Content-Type': type, 'Cache-Control': 'no-cache' };
  const body = req.method === 'GET' ? contents : undefined;
  if (type !== 'audio/mpeg') {
    res.writeHead(200, headers).end(body);
    return;
  }

  const size = contents.length;
  headers['Accept-Ranges'] = 'bytes';
  const [, from, to] = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range ?? '') ?? [];
  if (!from && !to) {
    res.writeHead(200, { ...headers, 'Content-Length': size }).end(body);
    return;
  }

  const start = from ? Number(from) : Math.max(0, size - Number(to));
  const end = from && to ? Math.min(Number(to), size - 1) : size - 1;
  if (start >= size || start > end) {
    res.writeHead(416, { ...headers, 'Content-Range': `bytes */${size}` }).end();
    return;
  }
  res.writeHead(206, {
    ...headers,
    'Content-Length': end - start + 1,
    'Content-Range': `bytes ${start}-${end}/${size}`,
  }).end(body?.subarray(start, end + 1));
}

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
      sendAsset(req, res, type, contents);
    } catch (error) {
      console.error(error.message);
      res.writeHead(500).end('Unable to read a local asset');
    }
  }
}).listen(port, '127.0.0.1', () => console.log('猫猫学中文 · http://127.0.0.1:' + port));
