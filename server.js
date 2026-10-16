import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json' };
const port = Number(process.env.PORT || 3000);
http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const target = path.resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
    const relative = path.relative(root, target).split(path.sep).join('/');
    const isPublic = ['index.html', 'styles.css', 'favicon.svg'].includes(relative) || relative.startsWith('src/') || relative.startsWith('assets/');
    if (!target.startsWith(`${root}${path.sep}`) || !isPublic) {
      res.writeHead(404).end('Nie znaleziono'); return;
    }
    if (!(await stat(target)).isFile()) { res.writeHead(404).end('Nie znaleziono'); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
    res.end(await readFile(target));
  } catch { res.writeHead(404).end('Nie znaleziono'); }
}).listen(port, '0.0.0.0', () => console.log(`Duszek Lubuszek: serwer działa na porcie ${port}`));
