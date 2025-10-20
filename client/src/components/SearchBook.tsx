import type React from "react"

import { useState } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { hc } from "hono/client"
import type { AppType } from "../../../server/app"
import { Search, BookOpen, Loader2, CheckCircle2, XCircle } from "lucide-react"

type SearchBookProps = {
  mode: SearchBookMode
  bookclubId?: string
}
type SearchBookMode = "bookclub" | "library"

const client = hc<AppType>("/")

export default function SearchBook({ mode, bookclubId }: SearchBookProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)

  const {
    data: books,
    isFetching,
    isError,
    refetch,
    error,
  } = useQuery({
    queryKey: ["book-search", searchTerm],
    enabled: false,
    queryFn: async () => {
      const isISBN = /^[0-9\-]+$/.test(searchTerm.trim());
      const query = isISBN
        ? `isbn:${searchTerm.replace(/[^0-9]/g, "")}`
        : `intitle:${encodeURIComponent(searchTerm.trim())}`;

      const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`)
      if (!res.ok) throw new Error("Failed to fetch from Google Books")
      const data = await res.json()

      if (!data.items || data.items.length === 0) throw new Error("No books found");

      const filtered = data.items.map((item: any) => {
        const info = item.volumeInfo;
        const industryId = info.industryIdentifiers?.find((id: any) => id.type === "ISBN_13")?.identifier;

        if (!industryId || !info.title) return null;
        return {
          id: item.id,
          title: info.title,
          authors: info.authors?.join(", "),
          isbn13: industryId ?? null,
          coverImage: info.imageLinks?.thumbnail ?? null,
          publishedYear: info.publishedDate?.slice(0, 4),
          description: info.description ?? null,
          pageCount: info.pageCount,
          categories: info.categories.join(", ")
        }
      })
      .filter(Boolean);

      if (filtered.length === 0) throw new Error("No valid books with ISBN13 found");
      return filtered;
    },
  })

  const addBook = useMutation({
    mutationFn: async (bookData: any) => {
      const res = await client.api.books.$post({
        json: bookData,
      })

      if (!res.ok) throw new Error("Failed to save book")
      return res.json()
    },
  })

  const setCurrentBook = useMutation({
    mutationFn: async (bookData: any) => {
      const res = await client.api.bookclubs[":id"]["set-book"].$post(
        {
          param: { id: bookclubId! },
        },
        bookData,
      )
      if (!res.ok) throw new Error("Failed to set current book")
      return res.json()
    },
  })

  const addToLibrary = useMutation({
    mutationFn: async (bookData: any) => {
      const res = await client.api.library.add.$post({
        json: bookData,
      })
      if (!res.ok) throw new Error("Failed to add book")
      return res.json()
    },
  })

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!searchTerm.trim()) return
    refetch()
  }

  const handleSubmit = async (bookData: any) => {
    console.log("Book Data: ", bookData)
    try {
      const saved = await addBook.mutateAsync(bookData)
      if (mode === "bookclub") {
        await setCurrentBook.mutateAsync(saved)
      } else {
        await addToLibrary.mutateAsync(saved)
      }
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        setSearchTerm("")
          ; (document.getElementById("search_modal") as HTMLDialogElement)?.close()
      }, 2000)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <dialog className="modal modal-bottom sm:modal-middle" id="search_modal">
      <div className="modal-box max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">
                {mode === "bookclub" ? "Set Book for Bookclub" : "Add to Your Library"}
              </h3>
              <p className="text-sm text-base-content/60">Search by ISBN or Title to find your book</p>
            </div>
          </div>
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost">✕</button>
          </form>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">ISBN Number</span>
            </label>
            <div className="join w-full">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter ISBN (e.g., 9780143127741 or 'Harry Potter')"
                className="input input-bordered join-item flex-1"
                disabled={isFetching}
              />
              <button type="submit" className="btn btn-primary join-item" disabled={isFetching || !searchTerm.trim()}>
                {isFetching ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Search
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {isError && (
          <div className="alert alert-error mt-4">
            <XCircle className="w-5 h-5" />
            <span>{(error as Error).message}</span>
          </div>
        )}

        {books && (
          <div className="mt-6 space-y-4 max-h-[500px] overflow-y-auto">
            {books.map((book: any) => (
              <div key={book.id} className="card bg-base-200 shadow-sm">
                <div className="card-body">
                  <div className="flex gap-4">
                    {book.coverImage && (
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-24 h-36 object-cover rounded-lg shadow-md"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-1">{book.title}</h4>
                      <p className="text-sm text-base-content/70 mb-2">{book.authors}</p>
                      <div className="flex flex-wrap gap-2 text-xs text-base-content/60">
                        {book.publishedYear && (
                          <span className="badge badge-outline">Published {book.publishedYear}</span>
                        )}
                        {book.pageCount && (
                          <span className="badge badge-outline">{book.pageCount} pages</span>
                        )}
                        {book.categories && (
                          <span className="badge badge-outline">{book.categories}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {book.description && (
                    <div className="mt-4 pt-4 border-t border-base-300">
                      <p className="text-sm text-base-content/80 line-clamp-3">
                        {book.description}
                      </p>
                    </div>
                  )}

                  <div className="card-actions justify-end mt-4">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleSubmit(book)}
                      disabled={addBook.isPending || addToLibrary.isPending || setCurrentBook.isPending}
                    >
                      {addBook.isPending || addToLibrary.isPending || setCurrentBook.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                        </>
                      ) : (
                        <>{mode === "bookclub" ? "Set as Current Book" : "Add to Library"}</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </div>
    </dialog>
  )
}
