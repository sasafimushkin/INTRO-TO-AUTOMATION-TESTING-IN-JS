import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
    '.html': 'text/html; charset=UTF-8',
    '.css': 'text/css; charset=UTF-8',
    '.js': 'application/javascript; charset=UTF-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.json': 'application/json',
};

export function createServer(port = 3000) {
    const server = http.createServer((req, res) => {
        const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        let pathname = url.pathname;

        if (pathname === '/') {
            pathname = '/index.html';
        } else if (!path.extname(pathname)) {
            // Support routes like /about and /services
            if (fs.existsSync(path.join(PUBLIC_DIR, `${pathname}.html`))) {
                pathname = `${pathname}.html`;
            }
        }

        const filePath = path.join(PUBLIC_DIR, pathname);

        if (!filePath.startsWith(PUBLIC_DIR) || !fs.existsSync(filePath)) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, { 'Content-Type': contentType });
        fs.createReadStream(filePath).pipe(res);
    });

    return {
        start() {
            return new Promise((resolve) => {
                server.listen(port, () => {
                    resolve(server);
                });
            });
        },
        stop() {
            return new Promise((resolve) => {
                server.close(resolve);
            });
        },
        server,
    };
}

if (process.argv[1] === __filename) {
    const port = Number(process.env.PORT) || 3000;
    const s = createServer(port);
    s.start().then(() => {
        console.log(`Application under test running at http://localhost:${port}`);
    });
}

