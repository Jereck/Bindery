import type { Context } from "hono";
import { addBook, getLibrary } from "./library.query";

export const getUserLibrary = async (c: Context) => {
  const user = c.get('user');
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const userLibrary = await getLibrary(user.id);
  if (!userLibrary) return c.json({ error: "Something went wrong grabbing your library" });
  return c.json(userLibrary);
}

export const addBookToLibrary = async (c: Context) => {
  const user = c.get('user');
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const bookData = await c.req.json();

  const addedBook = await addBook(user.id, bookData.isbn13, bookData);
  if (!addedBook) return c.json({ error: "Error adding book to library" });

  return c.json(addedBook);
}