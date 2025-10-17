import { authClient } from '@/lib/auth-client';
import { createFileRoute, useRouter } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  
  if (session) {
    router.navigate({ to: '/dashboard' })
    return null;
  }
  
  return (
    <div className="text-center">
      Hello World
    </div>
  )
}
