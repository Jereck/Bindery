import db from "../../db/db"
import { library, libraryBook } from "../../db/schema";
import { createBookInDb, findBookByISBN } from "../book/book.services";

export const getLibrary = async (userId: string) => {
  const userLibrary = await db.query.library.findFirst({
    where: (lib, { eq }) => eq(lib.userId, userId),
    with: {
      libraryBooks: {
        with: {
          book: true
        }
      }
    }
  })

  if (!userLibrary) return null;
  return userLibrary;
}

export const addBook = async (userId: string, isbn: string, bookData: any) => {
  let userLibrary = await db.query.library.findFirst({
    where: (lib, { eq }) => eq(lib.userId, userId)
  })

  if (!userLibrary) {
    const [newLibrary] = await db
      .insert(library)
      .values({ userId })
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
      publishedYear: bookData.publisehdYear ? Number(bookData.publishedYear) : null,
      description: bookData.description
    })
  }

  if (!foundBook) return null;

  await db.insert(libraryBook).values({
    libraryId: userLibrary.id,
    bookId: foundBook.id
  })

  return foundBook;
}