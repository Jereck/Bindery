import { authClient } from '@/lib/auth-client'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react';
import { CircleX, KeyRound, Mail, User, EyeOff, Eye, Check, ImageIcon, Loader2 } from 'lucide-react'

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
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null)

  if (session) {
    router.navigate({ to: '/bookclubs' })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatar(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
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
        const res = await fetch('/api/upload-avatar', {
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

  const getPasswordStrength = (pwd: string) => {
    if (pwd.length === 0) return { strength: 0, label: "" }
    if (pwd.length < 8) return { strength: 1, label: "Weak" }

    let strength = 1
    if (/[a-z]/.test(pwd)) strength++
    if (/[A-Z]/.test(pwd)) strength++
    if (/\d/.test(pwd)) strength++
    if (/[^a-zA-Z\d]/.test(pwd)) strength++

    if (strength <= 2) return { strength: 1, label: "Weak" }
    if (strength === 3) return { strength: 2, label: "Medium" }
    return { strength: 3, label: "Strong" }
  }

  const passwordStrength = getPasswordStrength(password)

  return (
    <div className="flex items-center justify-center bg-base-100 min-h-screen py-12 px-4">
      <div className="card bg-base-300 w-full max-w-md shadow-xl">
        <div className="card-body p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold">Create an Account</h1>
            <p className="text-base-content/70 mt-2">Sign up to get started</p>
          </div>

          {error && (
            <div role="alert" className="alert alert-error mb-4">
              <CircleX className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Avatar Upload */}
            <div>
              <label htmlFor="avatar" className="label">
                <span className="label-text">Profile Picture (Optional)</span>
              </label>
              <div className="flex items-center gap-4">
                {avatarPreview && (
                  <div className="avatar">
                    <div className="w-16 h-16 rounded-full">
                      <img src={avatarPreview || "/placeholder.svg"} alt="Avatar preview" />
                    </div>
                  </div>
                )}
                <label className="input input-bordered flex items-center gap-2 flex-1 cursor-pointer">
                  <ImageIcon className="h-4 w-4 opacity-70" />
                  <input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="file-input file-input-ghost w-full p-0 h-auto"
                  />
                </label>
              </div>
            </div>

            {/* Name Field */}
            <div>
              <label htmlFor="full-name" className="label">
                <span className="label-text">Full Name</span>
              </label>
              <label className="input input-bordered w-full flex items-center gap-2">
                <User className="h-4 w-4 opacity-70" />
                <input
                  id="full-name"
                  type="text"
                  required
                  placeholder="John Doe"
                  pattern="[A-Za-z][A-Za-z\-\s]*"
                  minLength={3}
                  maxLength={30}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="grow"
                  title="Only letters, spaces, or dashes"
                />
              </label>
              <label className="label">
                <span className="label-text-alt text-base-content/60">3-30 characters: letters, spaces, or dashes</span>
              </label>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="label">
                <span className="label-text">Email</span>
              </label>
              <label className="input input-bordered w-full flex items-center gap-2">
                <Mail className="h-4 w-4 opacity-70" />
                <input
                  id="email"
                  type="email"
                  placeholder="mail@site.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="grow"
                />
              </label>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="label">
                <span className="label-text">Password</span>
              </label>
              <label className="input input-bordered w-full flex items-center gap-2">
                <KeyRound className="h-4 w-4 opacity-70" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter password"
                  minLength={8}
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="grow"
                  title="Must be 8+ characters with number, lowercase, and uppercase"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="opacity-70 hover:opacity-100"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </label>
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    <div
                      className={`h-1 flex-1 rounded ${passwordStrength.strength >= 1 ? "bg-error" : "bg-base-content/20"}`}
                    />
                    <div
                      className={`h-1 flex-1 rounded ${passwordStrength.strength >= 2 ? "bg-warning" : "bg-base-content/20"}`}
                    />
                    <div
                      className={`h-1 flex-1 rounded ${passwordStrength.strength >= 3 ? "bg-success" : "bg-base-content/20"}`}
                    />
                  </div>
                  <label className="label">
                    <span className="label-text-alt">{passwordStrength.label}</span>
                  </label>
                </div>
              )}
              <label className="label">
                <span className="label-text-alt text-base-content/60">
                  8+ characters with number, lowercase, and uppercase
                </span>
              </label>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirm-password" className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <label
                className={`input input-bordered w-full flex items-center gap-2 ${passwordsMatch === false ? "input-error" : passwordsMatch === true ? "input-success" : ""
                  }`}
              >
                <KeyRound className="h-4 w-4 opacity-70" />
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="Confirm password"
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="grow"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="opacity-70 hover:opacity-100"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                {passwordsMatch === true && <Check className="h-4 w-4 text-success" />}
                {passwordsMatch === false && <CircleX className="h-4 w-4 text-error" />}
              </label>
              {passwordsMatch === false && (
                <label className="label">
                  <span className="label-text-alt text-error">Passwords do not match</span>
                </label>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-full mt-6"
              disabled={loading || passwordsMatch === false}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Sign In Link */}
            <div className="text-center mt-4">
              <p className="text-base-content/70">
                Already have an account?{" "}
                <a href="/signin" className="link link-primary font-medium">
                  Sign in
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
