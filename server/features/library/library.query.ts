import db from "../../db/db"
import { library, libraryBook } from "../../db/schema";
import { createBookInDb, findBookByISBN } from "../book/book.services";

export const getLibrary = async (userId: string) => {
  const userWithLibrary = await db.query.user.findFirst({
    where: (usr, { eq }) => eq(usr.id, userId),
    with: {
      library: {
        with: {
          books: {
            with: {
              book: true
            }
          }
        }
      }
    }
  })

  if (!userWithLibrary) return null;
  return userWithLibrary;
}

export const addBook = async (userId: string, isbn: string, bookData: any, readingStatus: "read" | "reading" | "want_to_read" = "want_to_read") => {
  let userLibrary = await db.query.library.findFirst({
    where: (lib, { and, eq }) => and(eq(lib.ownerId, userId), eq(lib.ownerType, "user"))
  })

  if (!userLibrary) {
    const [newLibrary] = await db
      .insert(library)
      .values({ ownerId: userId, ownerType: "user" })
      .returning()
    userLibrary = newLibrary;
  }

  let foundBook = await findBookByISBN(isbn);
  if (!foundBook) {
    foundBook = await createBookInDb({
      title: bookData.title,
      authors: bookData.authors,
      isbn13: isbn,
      coverImage: bookData.coverImage,
      publishedYear: bookData.publishedYear ? Number(bookData.publishedYear) : null,
      description: bookData.description,
      pageCount: Number(bookData.pageCount),
      categories: bookData.categories
    })
  }

  if (!foundBook) return null;

  const existingLink = await db.query.libraryBook.findFirst({
    where: (lb, { and, eq }) => and(eq(lb.libraryId, userLibrary.id), eq(lb.bookId, foundBook.id)),
  });

  if (existingLink) return foundBook;

  await db.insert(libraryBook).values({
    libraryId: userLibrary.id,
    bookId: foundBook.id,
    currentPage: 0,
    readingStatus
  })

  return foundBook;
}