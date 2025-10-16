import { type Context } from "hono";
import { create, getAll, getById } from "./bookclub.queries";

export const getAllBookclubs = async (c: Context) => {
  const allClubs = await getAll();
  return c.json(allClubs);
}

export const getBookclubById = async (c: Context) => {
  const id = c.req.param("id");
  const club = await getById(id);
  if (!club) return c.json({ error: "Not found" }, 404);
  return c.json(club);
}

export const createBookclub = async (c: Context) => {
  const data = await c.req.json();
  const user = c.get('user');
  if(!user) return c.json({ error: "Unauthorized" });
  const newClub = await create(data, user.id);
  if (!newClub) return c.json({ error: "Error creating club" });
  return c.json({ message: "Your new bookclub was created!", newClub }, 201);
}