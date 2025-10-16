import db from "../../db/db"
import { bookclub, bookclubUser } from "../../db/schema";

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

export const create = async (club: any, userId: string) => {
  const [newClub] = await db.insert(bookclub).values({
    name: club.name,
    description: club.description
  }).returning();

  if (!newClub) return null;

  await db.insert(bookclubUser).values({ userId: userId, bookclubId: newClub.id, isOwner: true });

  return newClub;
}