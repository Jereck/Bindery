import { createFileRoute } from '@tanstack/react-router'
import { hc } from 'hono/client';
import type { AppType } from '../../../server/app';
import { authClient } from '@/lib/auth-client';

const client = hc<AppType>('/');

export const Route = createFileRoute('/bookclubs/$clubId')({
  loader: async ({ params: { clubId } }) => {
    const res = await client.api.bookclubs[':id'].$get({ param: { id: clubId } })
    if (!res.ok) throw new Error("Failed to fetch bookclub");
    const data = res.json();
    return data;
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { data: session } = authClient.useSession();
  const { clubId } = Route.useParams();
  const club = Route.useLoaderData();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{club.name}</h1>
      <p className="text-gray-600">{club.description}</p>
      <div className="mt-2 text-sm text-gray-500">
        Club ID: {clubId}
      </div>
    </div>
  )
}
