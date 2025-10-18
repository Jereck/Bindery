import { eq } from "drizzle-orm";
import db from "../../db/db"
import { bookclub, bookclubUser } from "../../db/schema";
import { CreateBookclubInput, UpdateBookclubInput } from "./bookclub.schema";
import { createBookInDb, findBookByISBN } from "../book/book.services";

export const getAll = async () => {
  const bookclubs = await db.query.bookclub.findMany({})
  return bookclubs;
}

export const getById = async (id: string) => {
  const bookclub = await db.query.bookclub.findFirst({
    where: (bookclub, { eq }) => eq(bookclub.id, id)
  })
  return bookclub;
}

export const create = async (club: CreateBookclubInput, userId: string) => {
  const [newClub] = await db.insert(bookclub).values({
    name: club.name,
    description: club.description,
    ownerId: userId
  }).returning();

  if (!newClub) return null;

  await db.insert(bookclubUser).values({ userId: userId, bookclubId: newClub.id });

  return newClub;
}

export const update = async (userId: string, clubId: string, updateClub: UpdateBookclubInput) => {
  const foundBookclub = await db.query.bookclub.findFirst({
    where: (bookclub, { and, eq }) => and(eq(bookclub.id, clubId), eq(bookclub.ownerId, userId))
  })

  if (!foundBookclub) return null;

  const [updatedBookclub] = await db
    .update(bookclub)
    .set({
      name: updateClub.name,
      description: updateClub.description
    })
    .where(eq(bookclub.id, clubId))
    .returning();

  return updatedBookclub ?? null;
}

export const remove = async (clubId: string) => {
  const [deletedBookclub] = await db.delete(bookclub).where(eq(bookclub.id, clubId)).returning();
  if (!deletedBookclub) return null;
  return deletedBookclub;
}

export const join = async (userId: string, clubId: string) => {
  const existing = await db.query.bookclubUser.findFirst({
    where: (bcu, { and, eq }) => (and(eq(bcu.bookclubId, clubId), eq(bcu.userId, userId)))
  })

  if (existing) return null;

  const [membership] = await db.insert(bookclubUser).values({
    userId: userId,
    bookclubId: clubId
  }).returning();

  return membership;
}

export const leave = async (userId: string, clubId: string) => {
  const existing = await db.query.bookclubUser.findFirst({
    where: (bcu, { and, eq }) => (and(eq(bcu.bookclubId, clubId), eq(bcu.userId, userId)))
  })

  if (!existing) return null;
  if (existing.userId === userId) {
    const deletedClub = await db.delete(bookclub).where(eq(bookclub.id, clubId));
    return { message: "Club deleted", deletedClub }
  }

  const [leftMembership] = await db.delete(bookclubUser).where(eq(bookclubUser.userId, userId)).returning();
  if (!leftMembership) return null;
  return leftMembership
}

export const setBook = async (userId: string, clubId: string, isbn: string, bookData: any) => {
  const foundBookclub = await db.query.bookclub.findFirst({
    where: (bookclub, { and, eq }) => and(eq(bookclub.id, clubId), eq(bookclub.ownerId, userId))
  })

  if (!foundBookclub) return null;

  let foundBook = await findBookByISBN(isbn);
  if (!foundBook) {
    foundBook = await createBookInDb({
      title: bookData.title,
      authors: bookData.authors,
      isbn13: isbn,
      coverImage: bookData.coverImage,
      publishedYear: bookData.publishedYear ? Number(bookData.publishedYear) : null,
      description: bookData.description,
    })
  }

  const [updatedBook] = await db
    .update(bookclub)
    .set({ currentBookId: foundBook?.id })
    .where(eq(bookclub.id, clubId))
    .returning()

  return updatedBook ?? null;
}