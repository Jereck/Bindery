import { Hono } from "hono";
import { createBookclub, getAllBookclubs, getBookclubById } from "./bookclub.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { HonoEnv } from "../../types";


export const bookclubRoutes = new Hono<HonoEnv>()
  .use(authMiddleware)
  .get('/', getAllBookclubs)
  .post('/', createBookclub)
  .get('/:id', getBookclubById)


export type BookclubRoutesType = typeof bookclubRoutes;

export default bookclubRoutes;