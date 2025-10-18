import { authClient } from '@/lib/auth-client';
import { useQuery } from '@tanstack/react-query';

import { createFileRoute, useRouter } from "@tanstack/react-router"
import { hc } from "hono/client";
import type { AppType } from "../../../server/app";
import SearchBook from '@/components/SearchBook';
import { BookOpen, Loader2, Search } from 'lucide-react';

const client = hc<AppType>('/');

export const Route = createFileRoute('/library/')({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const { data: library, isError, error, isLoading } = useQuery({
    queryKey: ['library'],
    queryFn: async () => {
      const res = await client.api.library.$get();
      if (!res.ok) throw new Error("Failed to fetch library");
      return res.json();
    }
  })

  if (sessionLoading) {
    return <div className="flex items-center justify-center h-screen text-lg">Loading...</div>
  }

  if (!session) {
    router.navigate({ to: "/signin" })
    return null
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen text-lg">Loading...</div>
  }

  if (isError) {
    return <p className="text-center text-red-500">Error: {error?.message ?? 'Something went wrong.'}</p>
  }

  if (!library || 'error' in library) {
    return <p className="text-center text-gray-500">You don’t have any books in your library yet.</p>
  }

  console.log("library", library)

  const openSearchModal = () => {
    const modal = document.getElementById("search_modal") as HTMLDialogElement | null
    modal?.showModal()
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] to-[#F5E6D3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#8B4513] rounded-xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#2C1810]">My Library</h1>
                <p className="text-gray-600 mt-1">
                  {library && "library" in library
                    ? `${library.library.books.length} ${library.library.books.length === 1 ? "book" : "books"} in your collection`
                    : "Your personal book collection"}
                </p>
              </div>
            </div>
            <button
              onClick={openSearchModal}
              className="btn btn-primary flex items-center gap-2 px-6 py-3 bg-[#8B4513] hover:bg-[#6B3410] text-white rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
              <span className="hidden sm:inline">Add Book</span>
            </button>
          </div>
        </div>

        <SearchBook mode="library" />

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#8B4513]" />
              <p className="text-lg text-gray-600">Loading your books...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium">Error: Something went wrong.</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && library && "library" in library && library.library.books.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#D4A574]/20 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-[#FFF8F0] rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-10 h-10 text-[#8B4513]" />
              </div>
              <h3 className="text-xl font-semibold text-[#2C1810] mb-2">Your library is empty</h3>
              <p className="text-gray-600 mb-6">Start building your collection by adding books you love</p>
              <button
                onClick={openSearchModal}
                className="btn btn-primary inline-flex items-center gap-2 px-6 py-3 bg-[#8B4513] hover:bg-[#6B3410] text-white rounded-lg transition-colors"
              >
                <Search className="w-5 h-5" />
                Add Your First Book
              </button>
            </div>
          </div>
        )}

        {/* Books Grid */}
        {!isLoading && library && "library" in library && library.library.books.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {library.library.books.map((book) => (
              <div
                key={book.book.id}
                className="bg-white rounded-xl shadow-sm border border-[#D4A574]/20 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4 p-4">
                  {/* Book Cover */}
                  <div className="flex-shrink-0">
                    <img
                      src={book.book.coverImage || "/placeholder.svg?height=160&width=120"}
                      alt={book.book.title}
                      className="w-24 h-32 object-cover rounded-lg shadow-sm"
                    />
                  </div>

                  {/* Book Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#2C1810] text-lg mb-1 line-clamp-2">{book.book.title}</h3>
                    {book.book.authors && <p className="text-sm text-gray-600 mb-2">by {book.book.authors}</p>}
                    {book.book.description && (
                      <p className="text-sm text-gray-500 line-clamp-3 mb-3">{book.book.description}</p>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                  <button className="w-full btn btn-sm bg-[#8B4513] hover:bg-[#6B3410] text-white rounded-lg py-2 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}