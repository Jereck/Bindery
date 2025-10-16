import { createFileRoute, useRouter } from '@tanstack/react-router'
import { hc } from 'hono/client'
import { useQuery } from '@tanstack/react-query'
import type { AppType } from '../../../server/app'
import { CircleX } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

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
    <div className="flex flex-col items-center p-10">
      { isError && (
        <div role="alert" className="alert alert-error">
          <CircleX />
          <span>Error: {error.message}</span>
        </div>
      )}
      <div className="space-y-3 p-6">
        {isLoading && (
          <>
            {[1, 2, 3, 4, 5].map(() => (
              <div className="flex items-center gap-2">
                <div className="skeleton h-6 w-6 rounded-full"></div>
                <div className="skeleton h-4 w-32"></div>
              </div>
            ))}
          </>
        )}

        { data && data.map((bookclub) => {
          return (
            <div key={bookclub.id} className="flex items-center gap-2">
              <span>{ bookclub.name }</span>
            </div>
          )
        })}
      </div>

    </div>
  )
}
