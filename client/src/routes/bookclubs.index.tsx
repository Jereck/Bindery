import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { hc } from 'hono/client'
import { useQuery } from '@tanstack/react-query'
import type { AppType } from '../../../server/app'
import { CircleX } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import SearchBook from '@/components/SearchBook';

const client = hc<AppType>('/');

export const Route = createFileRoute('/bookclubs/')({
  component: BookclubsComponent,
})

function BookclubsComponent() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  const { data, isError, error, isLoading } = useQuery({
    queryKey: ['bookclubs'],
    queryFn: async () => {
      const res = await client.api.bookclubs.$get();
      if (!res.ok) throw new Error("Failed to fetch bookclubs");
      return res.json();
    }
  })

  if (isPending) return <div>Loading...</div>

  if (!session) {
    router.navigate({ to: "/signin" })
    return null
  }

  return (
    <div className="flex flex-col p-10">

      { isError && (
        <div role="alert" className="alert alert-error">
          <CircleX />
          <span>Error: {error.message}</span>
        </div>
      )}

      <button className="btn mb-3" onClick={() => {
        const modal = document.getElementById("search_modal") as HTMLDialogElement | null
        modal?.showModal()
      }}>Search</button>
      <SearchBook mode='library' />

      <div className="space-y-3">
        {isLoading && (
          <>Loading...</>
        )}

        { data && data.map((bookclub) => {
          return (
            <div key={bookclub.id} className="card bg-base-200 shadow-md">
              <div className="card-body">
                <h2 className="card-title">{ bookclub.name }</h2>
                <p>{ bookclub.description }</p>
                <div className="card-actions w-full">
                  <Link to='/bookclubs/$clubId' params={{ clubId: bookclub.id }} className="btn btn-outline btn-primary">Learn more</Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}
