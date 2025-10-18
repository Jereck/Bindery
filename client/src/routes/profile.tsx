import { createFileRoute, useRouter } from '@tanstack/react-router'
import { hc } from 'hono/client'
import type { AppType } from '../../../server/app'
import { authClient } from '@/lib/auth-client';
import { useQuery } from '@tanstack/react-query';
import { BookOpen } from 'lucide-react';

const client = hc<AppType>('/');

export const Route = createFileRoute('/profile')({
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


  if (sessionLoading || isLoading) {
    return <div className="flex items-center justify-center h-screen text-lg">Loading...</div>
  }

  if (isError) {
    return <p className="text-center text-red-500">Error: {error?.message ?? 'Something went wrong.'}</p>
  }

  if (!library || 'error' in library) {
    return <p className="text-center text-gray-500">You don’t have any books in your library yet.</p>
  }

  if (!session) {
    router.navigate({ to: "/signin" })
    return null
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Your Library</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* {library.libraryBooks.map(({ book }) => (
          <div key={book.id} className="card bg-base-200 hover:shadow-md transition">
            <div className="card-body p-4 flex flex-col items-center text-center">
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-24 h-36 object-cover rounded-md mb-3"
                />
              ) : (
                <BookOpen className="w-12 h-12 text-gray-400 mb-3" />
              )}
              <h2 className="font-semibold">{book.title}</h2>
              <p className="text-sm text-gray-500">{book.authors ?? 'Unknown Author'}</p>
              <p className="text-xs text-gray-400 mt-1">{book.publishedYear ?? ''}</p>
            </div>
          </div>
        ))} */}
      </div>
    </div>
  )
}
