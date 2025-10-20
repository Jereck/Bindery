import { authClient } from "@/lib/auth-client";
import { Link, useRouter } from "@tanstack/react-router";

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  if (isPending) return <p>Loading...</p>

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.navigate({ to: '/' })
        }
      }
    })
  }

  return (
    <div className="navbar bg-neutral text-neutral-content shadow-sm px-4">
      <div className="flex-1">
        <Link to='/' className="btn btn-ghost text-xl">Bindery</Link>
      </div>

      { !session ? (
        <div className="flex gap-2">
          <button onClick={() => router.navigate({ to: '/signin'})} className="btn btn-primary">Sign In</button>
          <button onClick={() => router.navigate({ to: '/signup'})} className="btn btn-primary btn-outline text-white">Sign Up</button>
        </div>
      ) : (
      <div className="flex items-center gap-2">
        <div>
          <Link to='/bookclubs'>Bookclubs</Link>
        </div>
        <div>
          <Link to="/library">Library</Link>
        </div>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src={session?.user.image!} />
            </div>
          </div>
          <ul
            tabIndex={-1}
            className="menu menu-sm dropdown-content bg-neutral text-neutral-content z-1 mt-3 w-52 p-2 shadow">
            <li>
              <Link to='/profile' className="justify-between">
                Profile
              </Link>
            </li>
            <li><a>Settings</a></li>
            <li><button onClick={handleSignOut}>Logout</button></li>
          </ul>
        </div>
      </div>
      )}


    </div>
  )
}