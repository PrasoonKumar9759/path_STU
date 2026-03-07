import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Coins,
  Flame,
  ListChecks,
  Loader2,
  LogOut,
  PlusCircle,
  RefreshCcw,
  Sparkles,
  Star,
  Zap,
} from 'lucide-react'
import { plannerService } from '../services/api'
import { useAuth } from '../context/AuthContext'

const todayDate = new Date()
const defaultTargetDate = new Date(todayDate)
defaultTargetDate.setDate(defaultTargetDate.getDate() + 7)

const formatDateInput = (date) => date.toISOString().split('T')[0]

const StudentDashboard = () => {
  const { user, logout, updateUserStats } = useAuth()
  const navigate = useNavigate()

  const [subject, setSubject] = useState('')
  const [topicsInput, setTopicsInput] = useState('')
  const [targetDate, setTargetDate] = useState(formatDateInput(defaultTargetDate))

  const [plannerLoading, setPlannerLoading] = useState(false)
  const [plannerError, setPlannerError] = useState('')
  const [plannerMessage, setPlannerMessage] = useState('')
  const [latestGeneratedTasks, setLatestGeneratedTasks] = useState([])

  const [todayTasks, setTodayTasks] = useState([])
  const [allTasks, setAllTasks] = useState([])
  const [tasksLoading, setTasksLoading] = useState(true)
  const [tasksError, setTasksError] = useState('')
  const [completingTaskId, setCompletingTaskId] = useState(null)

  const [overdueCount, setOverdueCount] = useState(0)
  const [restructuring, setRestructuring] = useState(false)
  const [restructureMessage, setRestructureMessage] = useState('')

  const pendingTasksCount = useMemo(
    () => todayTasks.filter((task) => !task.completed).length,
    [todayTasks],
  )

  const groupedUpcoming = useMemo(() => {
    const upcoming = allTasks.filter((task) => !task.completed)
    return upcoming.reduce((acc, task) => {
      const key = task.assignedDate
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(task)
      return acc
    }, {})
  }, [allTasks])

  const sortedUpcomingDates = useMemo(
    () => Object.keys(groupedUpcoming).sort((a, b) => a.localeCompare(b)),
    [groupedUpcoming],
  )

  const loadTasks = async () => {
    setTasksLoading(true)
    setTasksError('')

    try {
      const [todayData, allData, overdueData] = await Promise.all([
        plannerService.getTodayTasks(),
        plannerService.getAllTasks(),
        plannerService.getOverdueCount(),
      ])
      setTodayTasks(todayData)
      setAllTasks(allData)
      setOverdueCount(overdueData.overdueCount || 0)
    } catch (err) {
      if (err.response?.status === 403) {
        setTasksError('Planner is available only for STUDENT accounts.')
      } else {
        setTasksError(err.response?.data?.message || 'Could not load tasks right now.')
      }
    } finally {
      setTasksLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const handleGeneratePlan = async (event) => {
    event.preventDefault()
    setPlannerError('')
    setPlannerMessage('')

    const topics = topicsInput
      .split('\n')
      .map((topic) => topic.trim())
      .filter(Boolean)

    if (!subject.trim()) {
      setPlannerError('Subject is required.')
      return
    }
    if (topics.length === 0) {
      setPlannerError('Please add at least one topic (one per line).')
      return
    }

    setPlannerLoading(true)
    try {
      const response = await plannerService.generatePlan(subject.trim(), topics, targetDate)
      setPlannerMessage(`Plan generated: ${response.totalTopics} topics across ${response.availableDays} days.`)
      setLatestGeneratedTasks(response.generatedTasks || [])
      await loadTasks()
    } catch (err) {
      setPlannerError(err.response?.data?.message || 'Failed to generate plan.')
    } finally {
      setPlannerLoading(false)
    }
  }

  const handleRestructure = async () => {
    setRestructuring(true)
    setRestructureMessage('')
    try {
      const data = await plannerService.restructurePlan()
      setRestructureMessage(data.message || 'Plan restructured successfully.')
      await loadTasks()
    } catch (err) {
      setRestructureMessage(err.response?.data?.message || 'Failed to restructure plan.')
    } finally {
      setRestructuring(false)
    }
  }

  const handleCompleteTask = async (taskId) => {
    setCompletingTaskId(taskId)
    setTasksError('')

    try {
      const response = await plannerService.completeTask(taskId)

      setTodayTasks((previous) =>
        previous.map((task) =>
          task.id === taskId
            ? {
                ...task,
                completed: response.task.completed,
                completedAt: response.task.completedAt,
              }
            : task,
        ),
      )

      setAllTasks((previous) =>
        previous.map((task) =>
          task.id === taskId
            ? {
                ...task,
                completed: response.task.completed,
                completedAt: response.task.completedAt,
              }
            : task,
        ),
      )

      updateUserStats({
        totalXp: response.totalXp,
        currentStreak: response.currentStreak,
        longestStreak: response.longestStreak,
        tokenBalance: response.tokenBalance,
      })
    } catch (err) {
      setTasksError(err.response?.data?.message || 'Could not complete task.')
    } finally {
      setCompletingTaskId(null)
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
            <Link
              to="/ai-learning"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-50 no-underline"
            >
              AI Learning
            </Link>
            <Link
              to="/my-library"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-emerald-600 transition-colors hover:bg-emerald-50 no-underline"
            >
              My Library
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
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Student Dashboard</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Hello, {user?.name || 'Student'}.</h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Build a deterministic study plan and complete today&apos;s checklist to earn XP.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-amber-200/70 bg-amber-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-amber-700">Total XP</p>
              <p className="mt-1 text-2xl font-black text-amber-700">{user?.totalXp || 0}</p>
            </div>
            <div className="rounded-xl border border-orange-200/70 bg-orange-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-orange-700">Current Streak</p>
              <p className="mt-1 inline-flex items-center gap-1 text-2xl font-black text-orange-700">
                <Flame className="h-6 w-6" />
                {user?.currentStreak || 0}
              </p>
            </div>
            <div className="rounded-xl border border-purple-200/70 bg-purple-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-purple-700">Best Streak</p>
              <p className="mt-1 text-2xl font-black text-purple-700">{user?.longestStreak || 0}</p>
            </div>
            <div className="rounded-xl border border-yellow-200/70 bg-yellow-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-yellow-700">Tokens</p>
              <p className="mt-1 inline-flex items-center gap-1 text-2xl font-black text-yellow-700">
                <Coins className="h-6 w-6" />
                {user?.tokenBalance || 0}
              </p>
            </div>
          </div>

          {overdueCount > 0 && (
            <div className="mt-4 flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-rose-600" />
                <span className="text-sm font-semibold text-rose-700">
                  You have {overdueCount} overdue task{overdueCount > 1 ? 's' : ''}. Restructure your plan to redistribute the workload.
                </span>
              </div>
              <button
                type="button"
                onClick={handleRestructure}
                disabled={restructuring}
                className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-rose-700 disabled:opacity-60"
              >
                {restructuring ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCcw className="h-3.5 w-3.5" />}
                Restructure
              </button>
            </div>
          )}

          {restructureMessage && (
            <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              {restructureMessage}
            </div>
          )}
        </section>

        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-4">
          <h2 className="text-sm font-extrabold uppercase tracking-[0.2em] text-slate-700">Today&apos;s Progress</h2>
          <p className="mt-4 text-4xl font-black text-slate-900">{todayTasks.length - pendingTasksCount}/{todayTasks.length}</p>
          <p className="mt-1 text-sm text-slate-600">tasks completed today</p>
          <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
              style={{
                width: `${todayTasks.length === 0 ? 0 : Math.round(((todayTasks.length - pendingTasksCount) / todayTasks.length) * 100)}%`,
              }}
            />
          </div>
        </aside>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-7">
          <div className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-extrabold text-slate-900">Generate Study Plan</h2>
          </div>

          {plannerError && (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">
              {plannerError}
            </div>
          )}
          {plannerMessage && (
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              {plannerMessage}
            </div>
          )}

          <form onSubmit={handleGeneratePlan} className="mt-5 space-y-4">
            <div>
              <label htmlFor="subject" className="mb-1.5 block text-sm font-semibold text-slate-700">Subject</label>
              <input
                id="subject"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="e.g. Data Structures"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label htmlFor="targetDate" className="mb-1.5 block text-sm font-semibold text-slate-700">Target Completion Date</label>
              <input
                id="targetDate"
                type="date"
                value={targetDate}
                onChange={(event) => setTargetDate(event.target.value)}
                min={formatDateInput(todayDate)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label htmlFor="topics" className="mb-1.5 block text-sm font-semibold text-slate-700">
                Topics (one per line)
              </label>
              <textarea
                id="topics"
                value={topicsInput}
                onChange={(event) => setTopicsInput(event.target.value)}
                placeholder={"Chapter 1\nChapter 2\nChapter 3"}
                rows={6}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={plannerLoading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5 hover:shadow-indigo-500/45 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {plannerLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Deterministic Plan
                </>
              )}
            </button>
          </form>

          {latestGeneratedTasks.length > 0 && (
            <div className="mt-6 rounded-xl border border-indigo-200 bg-indigo-50 p-4">
              <h3 className="text-sm font-extrabold uppercase tracking-[0.16em] text-indigo-700">Latest Generated Tasks</h3>
              <ul className="mt-3 space-y-2">
                {latestGeneratedTasks.slice(0, 6).map((task) => (
                  <li key={task.id} className="text-sm font-medium text-indigo-900">
                    {task.assignedDate}: {task.topic}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-5">
          <div className="flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-extrabold text-slate-900">Today&apos;s Checklist</h2>
          </div>

          {tasksLoading ? (
            <div className="mt-5 inline-flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading tasks...
            </div>
          ) : (
            <>
              {tasksError && (
                <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">
                  {tasksError}
                </div>
              )}

              {todayTasks.length === 0 ? (
                <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-600">
                  No tasks assigned for today. Generate a plan to start.
                </div>
              ) : (
                <ul className="mt-4 space-y-2.5">
                  {todayTasks.map((task) => (
                    <li
                      key={task.id}
                      className={`rounded-xl border px-3 py-3 transition-colors ${
                        task.completed ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <label className="flex cursor-pointer items-start gap-3">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          disabled={task.completed || completingTaskId === task.id}
                          onChange={() => handleCompleteTask(task.id)}
                          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <div className="flex-1">
                          <p className={`text-sm font-semibold ${task.completed ? 'text-emerald-700 line-through' : 'text-slate-800'}`}>
                            {task.topic}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500">{task.subject}</p>
                        </div>
                        {task.completed && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-12">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-extrabold text-slate-900">Upcoming Tasks</h2>
          </div>

          {sortedUpcomingDates.length === 0 ? (
            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-600">
              No upcoming tasks yet.
            </div>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sortedUpcomingDates.map((dateKey) => (
                <article key={dateKey} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{dateKey}</p>
                  <ul className="mt-2 space-y-1.5">
                    {groupedUpcoming[dateKey].map((task) => (
                      <li key={task.id} className="text-sm font-medium text-slate-700">
                        {task.topic}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          )}

          <div className="mt-5 inline-flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700">
            <Star className="h-4 w-4" />
            +50 XP &amp; +10 Tokens per completed task. Streak bonuses for consistent study!
          </div>
        </section>
      </main>
    </div>
  )
}

export default StudentDashboard
