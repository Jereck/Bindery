import { Hono } from "hono";
import { HonoEnv } from "../../types";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { addBookToLibrary, getUserLibrary } from "./library.controller";

const libraryRoutes = new Hono<HonoEnv>()
  .use(authMiddleware)
  .get('/', getUserLibrary)
  .post('/add', addBookToLibrary)

export type LibraryRoutesType = typeof libraryRoutes;

export default libraryRoutes;
