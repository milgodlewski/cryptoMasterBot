import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = {
  port: 9500,
  hostname: 'localhost',
  rootDir: __dirname,
  open: true,
  fileExtensions: ['.html', '.js', '.css', '.json'],
  middlewares: [
    async function rewriteMiddleware(ctx, next) {
      if (ctx.url === '/') {
        ctx.url = '/dist/index.html';
      } else if (!ctx.url.startsWith('/dist')) {
        ctx.url = `/dist${ctx.url}`;
      }
      await next();
    },
  ],
};

export default config;