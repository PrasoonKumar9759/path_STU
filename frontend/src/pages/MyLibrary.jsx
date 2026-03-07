import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Loader2,
  LogOut,
  Unlock,
  Zap,
} from 'lucide-react'
import { plannerService, tokenService } from '../services/api'
import { useAuth } from '../context/AuthContext'

const MyLibrary = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('completed')
  const [completedTasks, setCompletedTasks] = useState([])
  const [unlockedContent, setUnlockedContent] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const [tasks, content] = await Promise.all([
        plannerService.getCompletedTasks(),
        tokenService.getUnlockedContent(),
      ])
      setCompletedTasks(tasks)
      setUnlockedContent(content)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load your library.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const groupedBySubject = completedTasks.reduce((acc, task) => {
    if (!acc[task.subject]) acc[task.subject] = []
    acc[task.subject].push(task)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link to="/" className="inline-flex items-center gap-2 no-underline">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
              <Zap className="h-4 w-4 text-white" />
            </span>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">PeerPath</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/dashboard"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 no-underline"
            >
              Dashboard
            </Link>
            <Link
              to="/content"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 no-underline"
            >
              Content Hub
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-7 sm:px-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">My Library</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
            Your Progress &amp; Purchases
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            All your completed study tasks and unlocked premium resources — always saved, never lost.
          </p>
        </section>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('completed')}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
              activeTab === 'completed'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            Completed Tasks ({completedTasks.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('unlocked')}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
              activeTab === 'unlocked'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Unlock className="h-4 w-4" />
            Unlocked Resources ({unlockedContent.length})
          </button>
        </div>

        {loading ? (
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading your library...
          </div>
        ) : error ? (
          <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">
            {error}
          </div>
        ) : activeTab === 'completed' ? (
          <section className="mt-6">
            {completedTasks.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-slate-300" />
                <p className="mt-3 text-sm font-semibold text-slate-500">No completed tasks yet.</p>
                <p className="mt-1 text-xs text-slate-400">Complete study tasks from your dashboard to see them here.</p>
                <Link
                  to="/dashboard/student"
                  className="mt-4 inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white no-underline hover:bg-indigo-700"
                >
                  Go to Dashboard
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.keys(groupedBySubject).sort().map((subject) => (
                  <div key={subject} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-emerald-600" />
                      <h3 className="text-lg font-extrabold text-slate-900">{subject}</h3>
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
                        {groupedBySubject[subject].length} completed
                      </span>
                    </div>
                    <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {groupedBySubject[subject].map((task) => (
                        <li
                          key={task.id}
                          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3"
                        >
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                            <div>
                              <p className="text-sm font-semibold text-emerald-800">{task.topic}</p>
                              <p className="mt-0.5 text-xs text-emerald-600">
                                {task.completedAt
                                  ? `Completed ${new Date(task.completedAt).toLocaleDateString()}`
                                  : `Assigned ${task.assignedDate}`}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : (
          <section className="mt-6">
            {unlockedContent.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center">
                <Unlock className="mx-auto h-10 w-10 text-slate-300" />
                <p className="mt-3 text-sm font-semibold text-slate-500">No unlocked resources yet.</p>
                <p className="mt-1 text-xs text-slate-400">Browse the Content Hub and unlock premium resources with tokens.</p>
                <Link
                  to="/content"
                  className="mt-4 inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white no-underline hover:bg-indigo-700"
                >
                  Browse Content Hub
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {unlockedContent.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                      <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
                        <Unlock className="h-3 w-3" />
                        Owned
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-medium text-slate-500">
                      {item.subject} &bull; {item.topic}
                    </p>
                    {item.description && (
                      <p className="mt-2 text-xs text-slate-600 line-clamp-3">{item.description}</p>
                    )}
                    <p className="mt-2 text-xs text-slate-400">By {item.creatorName}</p>
                    <a
                      href={item.resourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white no-underline transition-colors hover:bg-indigo-700"
                    >
                      Open Resource
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  )
}

export default MyLibrary
