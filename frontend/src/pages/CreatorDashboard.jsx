import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Bot,
  Coins,
  ExternalLink,
  FilePlus2,
  Library,
  Loader2,
  Lock,
  LogOut,
  Sparkles,
  Upload,
  Zap,
} from 'lucide-react'
import { contentService } from '../services/api'
import { useAuth } from '../context/AuthContext'

const CreatorDashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [topic, setTopic] = useState('')
  const [resourceUrl, setResourceUrl] = useState('')
  const [description, setDescription] = useState('')
  const [premium, setPremium] = useState(false)
  const [tokenCost, setTokenCost] = useState(10)
  const [campus, setCampus] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')
  const [aiGenerating, setAiGenerating] = useState(false)

  const [myContent, setMyContent] = useState([])
  const [contentLoading, setContentLoading] = useState(true)
  const [contentError, setContentError] = useState('')

  const loadMyContent = async () => {
    setContentLoading(true)
    setContentError('')

    try {
      const mine = await contentService.getMyContent()
      setMyContent(mine)
    } catch (err) {
      setContentError(err.response?.data?.message || 'Could not load your uploaded content.')
    } finally {
      setContentLoading(false)
    }
  }

  useEffect(() => {
    loadMyContent()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const clearForm = () => {
    setTitle('')
    setSubject('')
    setTopic('')
    setResourceUrl('')
    setDescription('')
    setPremium(false)
    setTokenCost(10)
    setCampus('')
  }

  const handleAiDescription = async () => {
    if (!title.trim() || !subject.trim() || !topic.trim()) {
      setFormError('Fill in Title, Subject, and Topic before generating an AI description.')
      return
    }
    setFormError('')
    setAiGenerating(true)
    try {
      const result = await contentService.generateAiDescription(title.trim(), subject.trim(), topic.trim())
      setDescription(result.description)
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not generate AI description.')
    } finally {
      setAiGenerating(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')
    setFormSuccess('')
    setSubmitting(true)

    try {
      await contentService.createContent({
        title,
        subject,
        topic,
        resourceUrl,
        description,
        premium,
        tokenCost: premium ? tokenCost : 0,
        campus: campus.trim() || null,
      })

      setFormSuccess('Content uploaded successfully. Students can now discover it in Content Hub.')
      clearForm()
      await loadMyContent()
    } catch (err) {
      if (err.response?.status === 403) {
        setFormError('Only CREATOR accounts can upload content.')
      } else {
        setFormError(err.response?.data?.message || 'Could not upload content.')
      }
    } finally {
      setSubmitting(false)
    }
  }

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

      <main className="mx-auto grid max-w-7xl gap-6 px-5 py-7 sm:px-8 lg:grid-cols-12">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-600">Creator Dashboard</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Welcome, {user?.name || 'Creator'}.</h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Upload study resources with subject/topic tags so students can quickly find useful material.
          </p>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-7">
          <div className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-extrabold text-slate-900">Upload Resource</h2>
          </div>

          {formError && (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">
              {formError}
            </div>
          )}
          {formSuccess && (
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              {formSuccess}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label htmlFor="title" className="mb-1.5 block text-sm font-semibold text-slate-700">Title</label>
              <input
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Linked List in 20 Minutes"
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="subject" className="mb-1.5 block text-sm font-semibold text-slate-700">Subject</label>
                <input
                  id="subject"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  placeholder="e.g. Data Structures"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="topic" className="mb-1.5 block text-sm font-semibold text-slate-700">Topic</label>
                <input
                  id="topic"
                  value={topic}
                  onChange={(event) => setTopic(event.target.value)}
                  placeholder="e.g. Linked List"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="resourceUrl" className="mb-1.5 block text-sm font-semibold text-slate-700">Resource URL</label>
              <input
                id="resourceUrl"
                type="url"
                value={resourceUrl}
                onChange={(event) => setResourceUrl(event.target.value)}
                placeholder="https://youtube.com/... or https://drive.google.com/..."
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="description" className="block text-sm font-semibold text-slate-700">Description (optional)</label>
                <button
                  type="button"
                  onClick={handleAiDescription}
                  disabled={aiGenerating}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {aiGenerating ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Bot className="h-3 w-3" />
                      AI Generate
                    </>
                  )}
                </button>
              </div>
              <textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={4}
                placeholder="What should students expect from this resource? Or click 'AI Generate' above to auto-create a description."
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="campus" className="mb-1.5 block text-sm font-semibold text-slate-700">Campus (optional)</label>
              <input
                id="campus"
                value={campus}
                onChange={(event) => setCampus(event.target.value)}
                placeholder="e.g. MIT, Stanford, IIT Delhi"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={premium}
                  onChange={(event) => setPremium(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-yellow-600 focus:ring-yellow-500"
                />
                <div>
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-800">
                    <Lock className="h-4 w-4 text-yellow-600" />
                    Premium Content
                  </span>
                  <p className="text-xs text-slate-500">Students will need tokens to unlock this resource</p>
                </div>
              </label>
              {premium && (
                <div className="mt-3 ml-7">
                  <label htmlFor="tokenCost" className="mb-1 block text-xs font-semibold text-slate-600">Token Cost</label>
                  <input
                    id="tokenCost"
                    type="number"
                    min={1}
                    max={100}
                    value={tokenCost}
                    onChange={(event) => setTokenCost(Number(event.target.value))}
                    className="w-32 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5 hover:shadow-indigo-500/45 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <FilePlus2 className="h-4 w-4" />
                  Publish Resource
                </>
              )}
            </button>
          </form>
        </section>

        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-5">
          <div className="flex items-center gap-2">
            <Library className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-extrabold text-slate-900">Your Recent Uploads</h2>
          </div>

          {contentLoading ? (
            <div className="mt-5 inline-flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading uploads...
            </div>
          ) : (
            <>
              {contentError && (
                <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">
                  {contentError}
                </div>
              )}

              {myContent.length === 0 ? (
                <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-600">
                  No uploads yet.
                </div>
              ) : (
                <ul className="mt-4 space-y-2.5">
                  {myContent.slice(0, 8).map((item) => (
                    <li key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                        {item.premium && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-bold text-yellow-700">
                            <Coins className="h-3 w-3" />
                            {item.tokenCost}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-slate-600">{item.subject} • {item.topic}</p>
                      <a
                        href={item.resourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 no-underline hover:text-indigo-700"
                      >
                        Open resource
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          <div className="mt-5 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
            <p className="inline-flex items-center gap-1 font-semibold">
              <Sparkles className="h-4 w-4" />
              Token Economy
            </p>
            <p className="mt-1 text-indigo-700">Mark resources as premium to let students unlock them with earned tokens. Free resources remain accessible to all.</p>
          </div>
        </aside>
      </main>
    </div>
  )
}

export default CreatorDashboard
