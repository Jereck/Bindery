import { authClient } from '@/lib/auth-client'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useState } from 'react';
import { CircleX, KeyRound, Mail, User, Image } from 'lucide-react'

export const Route = createFileRoute('/signup')({
  component: SignUpComponent,
})

function SignUpComponent() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [avatar, setAvatar] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (session) {
    router.navigate({ to: '/bookclubs' })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setAvatar(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError('');
    setLoading(true);

    try {
      await authClient.signUp.email({ name, email, password })

      let avatarUrl: string | null = null;

      if (avatar) {
        const res = await fetch ('/api/upload-avatar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: avatar.name, contentType: avatar.type })
        })
        const { uploadUrl, publicUrl } = await res.json();

        await fetch(uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: avatar
        })

        avatarUrl = publicUrl
      }


      await authClient.updateUser({
        image: avatarUrl || 'https://i.pravatar.cc/300'
      })

      router.navigate({ to: '/dashboard' })
    } catch (err) {
      setError('An unexpected error occured')
      console.error("Sign up failed: ", err)
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

          { error && (
            <div role="alert" className="alert alert-error">
              <CircleX />
              <span>Errror: {error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div>
              <label className="input validator">
                <User />
                <input
                  id="full-name"
                  type="text"
                  required
                  placeholder="Full Name"
                  pattern="[A-Za-z][A-Za-z\-]*"
                  minLength={3}
                  maxLength={30}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  title="Only letters or dash"
                />
              </label>
              <p className="validator-hint hidden">
                Must be 3 to 30 characters: only letters or dash
              </p>
            </div>

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

            <div className="mt-3">
              <label className="input validator">
                <KeyRound />
                <input
                  id="confirm-password"
                  type="password"
                  required
                  placeholder="Confirm Password"
                  minLength={8}
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                />
              </label>
              <p className="validator-hint hidden">
                Must be more than 8 characters, including
                <br />At least one number <br />At least one lowercase letter <br />At least one uppercase letter
              </p>
            </div>

            <div className="mt-3">
              <label className="input">
                <Image />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            <div className="card-actions mt-3">
              <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                { loading ? (<><span>Creating account...</span></>) : 'Register'}
              </button>
            </div>

            <div className="mt-2">
              <p className="text-base-content/70">
                Aleady have an account?{' '}<Link to="/signin" className='link link-primary'>Sign in</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
