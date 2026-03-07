import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen,
  Coins,
  FileUp,
  History,
  Loader2,
  Sparkles,
  Upload,
  Zap,
} from 'lucide-react'
import { aiLearningService } from '../services/api'
import { useAuth } from '../context/AuthContext'

const AiLearningMode = () => {
  const { user, updateUserStats } = useAuth()

  const [syllabusText, setSyllabusText] = useState('')
  const [pdfFile, setPdfFile] = useState(null)
  const [examDate, setExamDate] = useState('')
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [generatedPath, setGeneratedPath] = useState('')

  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(true)

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true)
    try {
      const data = await aiLearningService.getHistory()
      setHistory(data)
    } catch {
      setHistory([])
    } finally {
      setHistoryLoading(false)
    }
  }, [])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setPdfFile(file)
    } else if (file) {
      setError('Please upload a PDF file.')
      setPdfFile(null)
    }
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]
    if (file && file.type === 'application/pdf') {
      setPdfFile(file)
      setError('')
    } else if (file) {
      setError('Please drop a PDF file.')
    }
  }

  const handleGenerate = async (event) => {
    event.preventDefault()
    setError('')
    setGeneratedPath('')

    if (!syllabusText.trim() && !pdfFile) {
      setError('Please provide syllabus text or upload a PDF.')
      return
    }

    setGenerating(true)
    try {
      const data = await aiLearningService.generatePath(syllabusText.trim(), pdfFile, examDate || null)
      setGeneratedPath(data.generatedPath)
      if (user) {
        updateUserStats({ tokenBalance: (user.tokenBalance || 0) - 5 })
      }
      await loadHistory()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate learning path. Check your token balance.')
    } finally {
      setGenerating(false)
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

          <Link
            to="/dashboard"
            className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 no-underline"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-5 py-7 sm:px-8 lg:grid-cols-12">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Zero-Search Learning Mode</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">AI-Powered Exam Prep</h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Upload your syllabus or past exam papers and let AI predict the highest-probability exam concepts and generate a focused learning path.
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-yellow-50 px-3 py-1.5 text-sm font-semibold text-yellow-700">
            <Coins className="h-4 w-4" />
            Costs 5 tokens per generation • Your balance: {user?.tokenBalance || 0} tokens
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-7">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-extrabold text-slate-900">Generate Learning Path</h2>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">
              {error}
            </div>
          )}

          <form onSubmit={handleGenerate} className="mt-5 space-y-4">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center transition-colors hover:border-indigo-400 hover:bg-indigo-50/30"
            >
              <Upload className="mx-auto h-8 w-8 text-slate-400" />
              <p className="mt-2 text-sm font-semibold text-slate-700">
                {pdfFile ? pdfFile.name : 'Drop your PDF syllabus or past paper here'}
              </p>
              <p className="mt-1 text-xs text-slate-500">or click to browse</p>
              <label className="mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-indigo-100 px-3 py-1.5 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-200">
                <FileUp className="h-4 w-4" />
                Choose PDF
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label htmlFor="syllabusText" className="mb-1.5 block text-sm font-semibold text-slate-700">
                Or paste syllabus text
              </label>
              <textarea
                id="syllabusText"
                value={syllabusText}
                onChange={(event) => setSyllabusText(event.target.value)}
                rows={6}
                placeholder="Paste your syllabus topics, course outline, or exam paper content here..."
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="examDate" className="mb-1.5 block text-sm font-semibold text-slate-700">
                Exam Date (optional)
              </label>
              <input
                id="examDate"
                type="date"
                value={examDate}
                onChange={(event) => setExamDate(event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={generating || (!syllabusText.trim() && !pdfFile)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5 hover:shadow-indigo-500/45 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Learning Path (5 tokens)
                </>
              )}
            </button>
          </form>
        </section>

        <aside className="space-y-6 lg:col-span-5">
          {generatedPath && (
            <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-600" />
                <h2 className="text-lg font-extrabold text-slate-900">AI Learning Path</h2>
              </div>
              <div className="mt-4 max-h-[600px] overflow-y-auto rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-800 whitespace-pre-wrap">
                {generatedPath}
              </div>
            </div>
          )}

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-extrabold text-slate-900">Generation History</h2>
            </div>

            {historyLoading ? (
              <div className="mt-5 inline-flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading history...
              </div>
            ) : history.length === 0 ? (
              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-600">
                No AI-generated paths yet. Generate your first one above.
              </div>
            ) : (
              <ul className="mt-4 space-y-2.5">
                {history.slice(0, 5).map((item) => (
                  <li
                    key={item.id}
                    className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 transition-colors hover:bg-indigo-50"
                    onClick={() => setGeneratedPath(item.generatedPath)}
                  >
                    <p className="text-sm font-semibold text-slate-900">
                      {item.examDate ? `Exam: ${item.examDate}` : 'Learning Path'}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Generated on {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </main>
    </div>
  )
}

export default AiLearningMode
