import { Context } from "hono";
import db from "../../db/db";
import { book } from "../../db/schema";
import { createBookInDb, findBookByISBN } from "./book.services";

export const getAllBooks = async (c: Context) => {
  const allBooks = await db.select().from(book);
  return c.json(allBooks);
}

export const getBookByISBN = async (c: Context) => {
  const isbn = c.req.param("isbn");
  if (!isbn) return c.json({ error: "ISBN required" }, 400);

  const book = await findBookByISBN(isbn);
  if (!book) return c.json({ error: "Not found" }, 404);

  return c.json(book);
};

export const createBook = async (c: Context) => {
  const data = await c.req.json();
  if (!data.isbn13) return c.json({ error: "ISBN required" }, 400);

  const existing = await findBookByISBN(data.isbn13);
  if (existing) return c.json(existing);

  const newBook = await createBookInDb({
    title: data.title,
    authors: data.authors,
    isbn13: data.isbn13,
    coverImage: data.coverImage,
    publishedYear: data.publishedYear ? Number(data.publishedYear) : null,
    description: data.description,
    pageCount: data.pageCount,
    categories: data.categories
  });

  return c.json(newBook);
};