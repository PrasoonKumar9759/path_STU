import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ExternalLink,
  Filter,
  Loader2,
  Search,
  Sparkles,
  Zap,
} from 'lucide-react'
import { contentService } from '../services/api'

const ContentHub = () => {
  const [query, setQuery] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('')

  const [subjects, setSubjects] = useState([])
  const [contentItems, setContentItems] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadSubjects = async () => {
    try {
      const subjectData = await contentService.getSubjects()
      setSubjects(subjectData)
    } catch (err) {
      setSubjects([])
    }
  }

  const loadContent = async (nextSubject, nextQuery) => {
    setLoading(true)
    setError('')

    try {
      const data = await contentService.browseContent(nextSubject, nextQuery)
      setContentItems(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load content right now.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSubjects()
    loadContent('', '')
  }, [])

  const handleSearch = async (event) => {
    event.preventDefault()
    await loadContent(subjectFilter, query)
  }

  const subjectSummary = useMemo(() => {
    if (!subjectFilter) {
      return 'All subjects'
    }
    return subjectFilter
  }, [subjectFilter])

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

          <Link
            to="/dashboard"
            className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 no-underline"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-7 sm:px-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Basic Content Hub</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Discover Study Materials</h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Search by topic, filter by subject, and open resources uploaded by creators.
          </p>

          <form onSubmit={handleSearch} className="mt-5 grid gap-3 sm:grid-cols-12">
            <div className="sm:col-span-6">
              <label htmlFor="query" className="mb-1.5 block text-sm font-semibold text-slate-700">Search</label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="query"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by title or topic"
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-9 pr-4 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="subjectFilter" className="mb-1.5 block text-sm font-semibold text-slate-700">Subject</label>
              <div className="relative">
                <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <select
                  id="subjectFilter"
                  value={subjectFilter}
                  onChange={(event) => setSubjectFilter(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-9 pr-4 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Subjects</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:col-span-2 sm:self-end">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5 hover:shadow-indigo-500/45"
              >
                <Sparkles className="h-4 w-4" />
                Search
              </button>
            </div>
          </form>
        </section>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-extrabold text-slate-900">{subjectSummary}</h2>
            <p className="text-sm text-slate-500">{contentItems.length} resources found</p>
          </div>

          {loading ? (
            <div className="mt-5 inline-flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading content...
            </div>
          ) : (
            <>
              {error && (
                <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">
                  {error}
                </div>
              )}

              {!error && contentItems.length === 0 ? (
                <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-600">
                  No content matched your filters.
                </div>
              ) : (
                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {contentItems.map((item) => (
                    <article key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-600">{item.subject}</p>
                      <h3 className="mt-1 text-base font-extrabold text-slate-900">{item.title}</h3>
                      <p className="mt-1 text-sm font-semibold text-slate-600">Topic: {item.topic}</p>
                      {item.description && (
                        <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                      )}
                      <p className="mt-2 text-xs text-slate-500">Uploaded by {item.creatorName}</p>
                      <a
                        href={item.resourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 no-underline hover:text-indigo-700"
                      >
                        Open Resource
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  )
}

export default ContentHub
