import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { hc } from 'hono/client';
import { AlertCircle, ArrowLeft, BookOpen, Loader2 } from 'lucide-react';
import { useState } from 'react';
import type { AppType } from '../../../server/app';
import { authClient } from '@/lib/auth-client';

const client = hc<AppType>('/');

export const Route = createFileRoute('/bookclubs/create')({
  component: CreateBookclubComponent,
})

function CreateBookclubComponent() {
  const router = useRouter();
  const { data: session, isPending, error: authError } = authClient.useSession();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isPending) return <p>Pending...</p>

  if (authError) return <p>Error...</p>

  if (!session) {
    router.navigate({ to: "/signin" })
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    setLoading(true)
    try {
      const res = await client.api.bookclubs.$post({
        json: {
          name,
          description
        }
      })

      if (!res.ok) {
        throw new Error("Failed to create bookclub")
      }

      router.navigate({ to: "/bookclubs" })
    } catch (error) {
      setError("An error occurred while creating the bookclub")
      console.error("Create bookclub failed", error)
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <Link
          to="/bookclubs"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Bookclubs
        </Link>

        <div className="card bg-base-200 p-8 shadow-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2 text-balance">Create a New Bookclub</h1>
            <p className="text-muted-foreground text-pretty">Start your reading community and invite others to join</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <input
                id="name"
                type="text"
                required
                placeholder="e.g., Mystery Lovers Club"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input w-full"
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">Choose a memorable name for your bookclub</p>
            </div>

            <div className="space-y-2">
              <textarea
                id="description"
                placeholder="Tell others what your bookclub is about, what genres you'll read, and what makes it special..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="textarea w-full"
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">Help potential members understand your bookclub's focus</p>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-start gap-2 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                className="btn flex flex-1"
                disabled={loading}
                onClick={() => router.navigate({ to: "/bookclubs" })}
              >
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn btn-primary  flex flex-1">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <BookOpen className="w-4 h-4 mr-2" />
                    Create Bookclub
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
