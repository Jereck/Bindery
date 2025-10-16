import { Hono } from "hono";
import { HonoEnv } from "../../types";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { createBook, getAllBooks, getBookByISBN } from "./book.controller";

const bookRoutes = new Hono<HonoEnv>()
  .use(authMiddleware)
  .get('/', getAllBooks)
  .get('/:isbn', getBookByISBN)
  .post('/', createBook)

export type BookRoutesType = typeof bookRoutes;

export default bookRoutes;