import { authClient } from '@/lib/auth-client'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useState } from 'react';
import { CircleX, KeyRound, Mail } from 'lucide-react'

export const Route = createFileRoute('/signin')({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (session) {
    router.navigate({ to: '/dashboard' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      await authClient.signIn.email({
        email,
        password
      })
      router.navigate({ to: '/bookclubs' })
    } catch (err) {
      setError('An unexpected error occured')
      console.error("Sign in failed: ", err)
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center bg-base-100 mt-12">
      <div className="card bg-base-300 max-w-md">
        <div className="card-body p-8">
          <div className="card-title text-3xl px-4">Create an Account</div>
          <p className="text-base-content/70 my-2 text-center">
            Sign up to get started
          </p>

          {error && (
            <div role="alert" className="alert alert-error">
              <CircleX />
              <span>Errror: {error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="mt-3">
              <label className="input validator">
                <Mail />
                <input id="email" type="email" placeholder="mail@site.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>
              <div className="validator-hint hidden">Enter valid email address</div>
            </div>

            <div className="mt-3">
              <label className="input validator">
                <KeyRound />
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="Password"
                  minLength={8}
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                />
              </label>
              <p className="validator-hint hidden">
                Must be more than 8 characters, including
                <br />At least one number <br />At least one lowercase letter <br />At least one uppercase letter
              </p>
            </div>

            <div className="card-actions mt-3">
              <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                {loading ? (<><span>Signing In...</span></>) : 'Sign In'}
              </button>
            </div>

            <div className="mt-2">
              <p className="text-base-content/70">
                Don't have an account?{' '}<Link to="/signup" className='link link-primary'>Sign Up</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
