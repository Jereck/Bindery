import { Hono } from "hono";
import { createBookclub, deleteBookclub, getAllBookclubs, getBookclubById, joinBookclub, leaveBookclub, updateBookclub } from "./bookclub.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { HonoEnv } from "../../types";


export const bookclubRoutes = new Hono<HonoEnv>()
  .use(authMiddleware)
  .get('/', getAllBookclubs)
  .post('/', createBookclub)
  .get('/:id', getBookclubById)
  .put('/:id', updateBookclub)
  .delete('/:id', deleteBookclub)
  .post('/:id/join', joinBookclub)
  .delete('/:id/leave', leaveBookclub)


export type BookclubRoutesType = typeof bookclubRoutes;

export default bookclubRoutes;