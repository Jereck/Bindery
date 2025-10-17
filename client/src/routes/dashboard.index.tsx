import { authClient } from '@/lib/auth-client';
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { hc } from 'hono/client';
import { Award, Book, BookMarked, MessageCircle, Target, ThumbsUp, TrendingUp } from 'lucide-react'
import type { AppType } from '../../../server/app';
import { useQuery } from '@tanstack/react-query';

const client = hc<AppType>('/');

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const { data: library, isError, error, isLoading } = useQuery({
    queryKey: ['library'],
    queryFn: async () => {
      const res = await client.api.library.$get();
      if (!res.ok) throw new Error("Failed to fetch library");
      return res.json();
    }
  })

  if (sessionLoading || isLoading) {
    return <div className="flex items-center justify-center h-screen text-lg">Loading...</div>
  }

  if (isError) {
    return <p className="text-center text-red-500">Error: {error?.message ?? 'Something went wrong.'}</p>
  }

  console.log("Library: ", library)

  if (!library || 'error' in library) {
    return <p className="text-center text-gray-500">You don’t have any books in your library yet.</p>
  }

  if (!session) {
    router.navigate({ to: "/signin" })
    return null
  }

  const discussions = [
    {
      id: 1,
      user: "Sarah Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SC",
      book: "The Midnight Library",
      comment:
        "The concept of infinite possibilities really resonated with me. What did everyone think about the ending?",
      time: "2h ago",
      likes: 12,
      replies: 8,
    },
    {
      id: 2,
      user: "Michael Torres",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MT",
      book: "Atomic Habits",
      comment: "Just finished chapter 4. The idea of habit stacking is brilliant! Already implementing it.",
      time: "5h ago",
      likes: 18,
      replies: 5,
    },
    {
      id: 3,
      user: "Emma Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "EW",
      book: "Project Hail Mary",
      comment:
        "This book is absolutely incredible! The science is so well explained. Anyone else staying up way too late reading?",
      time: "1d ago",
      likes: 24,
      replies: 15,
    },
  ]

  const stats = [
    {
      label: "Books Read",
      value: "24",
      icon: Book,
      trend: "+3 this month",
      color: "text-info",
    },
    {
      label: "Reading Streak",
      value: "12",
      icon: TrendingUp,
      trend: "days",
      color: "text-success",
    },
    {
      label: "Club Rank",
      value: "#8",
      icon: Award,
      trend: "of 156 members",
      color: "text-warning",
    },
  ]

  return (
    <div className="min-h-screen bg-base-100">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-12">

          <div className="lg:col-span-8 space-y-6">
            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="card-title text-xl">Currently Reading</h2>
                  <button className="btn btn-ghost btn-sm">View All</button>
                </div>
                <div className="space-y-4">
                  { library.libraryBooks.map((book) => book.readingStatus === 'reading' && (
                    <div key={book.book.id} className="flex gap-4 p-4 rounded-lg bg-base-200/50 hover:bg-base-200 transition-colors">
                      <img className={`w-16 h-24 rounded-md bg-gradient-to-br flex-shrink-0 shadow-md`} src={book.book.coverImage!} />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base mb-1 truncate">{book.book.title}</h3>
                        <p className="text-sm opacity-70 mb-3">{book.book.authors}</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="opacity-70">
                              {book.currentPage} of {book.book.pageCount} pages
                            </span>
                          </div>
                        </div>
                      </div>
                      <button className="btn btn-outline btn-sm self-start">
                        <BookMarked className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="card-title text-xl">Recent Discussions</h2>
                  <button className="btn btn-ghost btn-sm">View All</button>
                </div>
                <div className="space-y-4">
                  {discussions.map((discussion) => (
                    <div
                      key={discussion.id}
                      className="p-4 rounded-lg border border-base-300 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-neutral text-neutral-content rounded-full w-10">
                            <span className="text-sm">{discussion.initials}</span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div>
                              <p className="font-medium text-sm">{discussion.user}</p>
                              <p className="text-xs opacity-70">{discussion.book}</p>
                            </div>
                            <span className="text-xs opacity-70 whitespace-nowrap">{discussion.time}</span>
                          </div>
                          <p className="text-sm opacity-90 mb-3 text-pretty leading-relaxed">{discussion.comment}</p>
                          <div className="flex items-center gap-4">
                            <button className="flex items-center gap-1.5 text-xs opacity-70 hover:text-primary transition-colors">
                              <ThumbsUp className="h-3.5 w-3.5" />
                              <span>{discussion.likes}</span>
                            </button>
                            <button className="flex items-center gap-1.5 text-xs opacity-70 hover:text-primary transition-colors">
                              <MessageCircle className="h-3.5 w-3.5" />
                              <span>{discussion.replies} replies</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">

            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body">
                <h2 className="card-title text-lg mb-2">Your Stats</h2>
                <div className="space-y-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-base-200/50">
                      <div className={`p-2 rounded-md bg-base-100 ${stat.color}`}>
                        <stat.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="text-xs opacity-70">{stat.label}</div>
                      </div>
                      <div className="text-xs opacity-70 text-right">{stat.trend}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body">
                <h2 className="card-title text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  2025 Reading Goal
                </h2>
                <div className="space-y-4">
                  <div className="text-center py-4">
                    <div className="text-4xl font-bold mb-2">
                      24<span className="opacity-50 text-2xl"> / 50</span>
                    </div>
                    <p className="text-sm opacity-70">books completed</p>
                  </div>
                  <progress className="progress progress-primary w-full h-3" value="48" max="100" />
                  <div className="flex justify-between text-sm">
                    <span className="opacity-70">48% complete</span>
                    <span className="text-primary font-medium">26 books to go</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
