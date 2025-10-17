import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { hc } from "hono/client";
import type { AppType } from "../../../server/app";

type SearchBookProps = {
  mode: SearchBookMode;
  bookclubId?: string;
}
type SearchBookMode = "bookclub" | "library";

const client = hc<AppType>('/');

export default function SearchBook({ mode, bookclubId }: SearchBookProps) {
  const [isbn, setIsbn] = useState("");

  const {
    data: book,
    isFetching,
    isError,
    refetch,
    error,
  } = useQuery({
    queryKey: ["book-search", isbn],
    enabled: false,
    queryFn: async () => {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
      );
      if (!res.ok) throw new Error("Failed to fetch from Google Books");
      const data = await res.json();
      const items = data.items
      console.log("Items", items)
      const info = data.items?.[0]?.volumeInfo;
      console.log("Info: ", info);
      if (!info) throw new Error("Book not found");

      return {
        title: info.title,
        authors: info.authors?.join(", "),
        isbn13: isbn.replace(/[^0-9]/g, ""),
        coverImage: info.imageLinks?.thumbnail ?? null,
        publishedYear: info.publishedDate?.slice(0, 4),
        description: info.description ?? null,
        pageCount: info.pageCount,
        categories: info.categories?.join(", ")
      };
    },
  });

  const addBook = useMutation({
    mutationFn: async (bookData: any) => {
      const res = await client.api.books.$post({
        json: bookData
      });

      if (!res.ok) throw new Error("Failed to save book");
      return res.json();
    },
  });

  const setCurrentBook = useMutation({
    mutationFn: async (bookData: any) => {
      const res = await client.api.bookclubs[":id"]["set-book"].$post({ 
        param: { id: bookclubId! }
      }, bookData);
      if (!res.ok) throw new Error("Failed to set current book");
      return res.json();
    }
  });

  const addToLibrary = useMutation({
    mutationFn: async (bookData: any) => {
      const res = await client.api.library.add.$post({
        json: bookData
      });
      if (!res.ok) throw new Error("Failed to add book");
      return res.json();
    },
  });

  const handleSearch = () => {
    if (!isbn.trim()) return;
    refetch();
  };

  const handleSubmit = async () => {
    if (!book) return;
    try {
      const saved = await addBook.mutateAsync(book);
      if (mode === "bookclub") {
        await setCurrentBook.mutateAsync(saved);
        alert("Book set as current reading!");
      } else {
        await addToLibrary.mutateAsync(saved);
        alert("Book added to your library!");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  return (
    <dialog className="modal" id="search_modal">
      <div className="modal-box">
      <div>
        <div>
          {mode === "bookclub" ? "Set Book for Bookclub" : "Add to Your Library"}
        </div>
      </div>

      <div className="flex gap-2">
        <input
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          placeholder="Enter ISBN (e.g., 9780143127741)"
          className="w-full border p-2 rounded"
        />
        <button onClick={handleSearch} className="btn btn-primary" disabled={isFetching || !isbn}>
          {isFetching ? "Searching..." : "Search"}
        </button>
      </div>

      {isError && (
        <p className="text-red-500 text-sm">{(error as Error).message}</p>
      )}

      {book && (
        <div className="mt-4 border rounded p-4 space-y-3">
          <div className="flex gap-4">
            {book.coverImage && (
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-20 h-28 object-cover rounded"
              />
            )}
            <div>
              <h3 className="font-semibold text-lg">{book.title}</h3>
              <p className="text-sm text-gray-700">{book.authors}</p>
              <p className="text-xs text-gray-500">
                Published: {book.publishedYear || "N/A"}
              </p>
            </div>
          </div>
          {book.description && (
            <p className="text-sm text-gray-700 line-clamp-3">
              {book.description}
            </p>
          )}

          <button
            className="w-full btn btn-primary"
            onClick={handleSubmit}
            disabled={addBook.isPending || addToLibrary.isPending}
          >
            {mode === "bookclub"
              ? addBook.isPending
                ? "Saving..."
                : "Set as Current Book"
              : addToLibrary.isPending
                ? "Saving..."
                : "Add to Library"}
          </button>
        </div>
      )}
      </div>
    </dialog>
  );
}
