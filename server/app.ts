import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { auth } from './lib/auth';
import bookclubRoutes from './features/bookclub/bookclub.routes';
import libraryRoutes from './features/library/library.routes';
import bookRoutes from './features/book/book.routes';

const app = new Hono().basePath('/api')

const router = app
  .use(
    '/auth/*',
    cors({
      origin: ['http://localhost:3000', 'http://localhost:5000'],
      allowHeaders: ['Content-Type', 'Authorization'],
      allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
      exposeHeaders: ['Content-Length'],
      credentials: true
    })
  )
  .use('*', logger())
  .on(["POST", "GET"], "/auth/**", (c) => auth.handler(c.req.raw))
  .route('/bookclubs', bookclubRoutes)
  .route('/library', libraryRoutes)
  .route('/books', bookRoutes)


export type AppType = typeof router;
export default app
