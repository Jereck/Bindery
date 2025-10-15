import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import db from './db/db';
import { bookclub } from './db/schema';
import { auth } from './lib/auth';

const app = new Hono().basePath('/api')

const router = app
  .use(
    '/auth/*',
    cors({
      origin: ['http://localhost:3000', 'http://localhost:5000'],
      allowHeaders: ['Content-Type', 'Authorization'],
      allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
      exposeHeaders: ['Content-Length'],
      maxAge: 600,
      credentials: true
    })
  )
  .use(logger())

  .on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw))

  .get('/bookclubs', async (c) => {
    try {
      const bookclubs = await db.select().from(bookclub)
      return c.json(bookclubs);
    } catch (error) {
      console.error("Failed to fetch bookclubs: ", error);
      return c.json({ error: "Failed to fetch bookclubs" }, 500); 
    }
  })
  .get('/people', (c) => {
    return c.json([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' },
    ])
  });


export type AppType = typeof router;
export default app
