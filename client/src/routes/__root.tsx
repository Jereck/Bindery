import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'

import type { QueryClient } from '@tanstack/react-query'
import Navbar from '@/components/Navbar'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Navbar />
      <Outlet />
    </>
  ),
})
