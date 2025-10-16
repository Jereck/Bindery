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
    description: club.description
  }).returning();

  if (!newClub) return null;

  await db.insert(bookclubUser).values({ userId: userId, bookclubId: newClub.id, isOwner: true });

  return newClub;
}

export const update = async (userId: string, clubId: string, updateClub: UpdateBookclubInput) => {
  const ownership = await db.query.bookclubUser.findFirst({
    where: (bcu, { and, eq }) => and(eq(bcu.userId, userId), eq(bcu.bookclubId, clubId), eq(bcu.isOwner, true))
  });

  if (!ownership) return null;

  const [updatedBookcub] = await db
    .update(bookclub)
    .set({
      name: updateClub.name,
      description: updateClub.description
    })
    .where(eq(bookclub.id, clubId))
    .returning();

  if (!updatedBookcub) return null;

  return updatedBookcub;
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
    bookclubId: clubId,
    isOwner: false
  }).returning();

  return membership;
}

export const leave = async (userId: string, clubId: string) => {
  const existing = await db.query.bookclubUser.findFirst({
    where: (bcu, { and, eq }) => (and(eq(bcu.bookclubId, clubId), eq(bcu.userId, userId)))
  })

  if (!existing) return null;
  if (existing.isOwner) {
    const deletedClub = await db.delete(bookclub).where(eq(bookclub.id, clubId));
    return { message: "Club deleted", deletedClub }
  }

  const [leftMembership] = await db.delete(bookclubUser).where(eq(bookclubUser.userId, userId)).returning();
  if (!leftMembership) return null;
  return leftMembership
}

export const setBook = async (userId: string, clubId: string, isbn: string, bookData: any) => {
  const ownership = await db.query.bookclubUser.findFirst({
    where: (bcu, { and, eq }) => and(eq(bcu.userId, userId), eq(bcu.bookclubId, clubId), eq(bcu.isOwner, true))
  });

  if (!ownership) return null;

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

  if (!updatedBook) return null;
  return updatedBook;
}