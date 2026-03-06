import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  BarChart3,
  BookOpen,
  Calendar,
  ChevronDown,
  Clock,
  Flame,
  LogOut,
  Rocket,
  Sparkles,
  Star,
  Target,
  Trophy,
  User,
  Zap,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const safeUserName = user?.name || 'Learner'
  const currentStreak = Number(user?.currentStreak || 0)
  const totalXp = Number(user?.totalXp || 0)
  const longestStreak = Number(user?.longestStreak || 0)

  const { level, xpIntoLevel, xpTarget, progressPercent } = useMemo(() => {
    const levelSize = 100
    const currentLevel = Math.floor(totalXp / levelSize) + 1
    const remaining = totalXp % levelSize
    return {
      level: currentLevel,
      xpIntoLevel: remaining,
      xpTarget: levelSize,
      progressPercent: Math.min(100, (remaining / levelSize) * 100),
    }
  }, [totalXp])

  useEffect(() => {
    const onEscape = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    window.addEventListener('keydown', onEscape)
    return () => window.removeEventListener('keydown', onEscape)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const scrollToSection = (sectionId) => {
    const target = document.getElementById(sectionId)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    setMenuOpen(false)
  }

  const profileInitial = safeUserName.charAt(0).toUpperCase()

  const stats = [
    {
      icon: Flame,
      label: 'Current Streak',
      value: `${currentStreak} days`,
      iconBgClassName: 'bg-orange-100',
      iconClassName: 'text-orange-600',
      borderClassName: 'border-orange-200/70',
    },
    {
      icon: Star,
      label: 'Total XP',
      value: totalXp,
      iconBgClassName: 'bg-amber-100',
      iconClassName: 'text-amber-600',
      borderClassName: 'border-amber-200/70',
    },
    {
      icon: Trophy,
      label: 'Best Streak',
      value: `${longestStreak} days`,
      iconBgClassName: 'bg-purple-100',
      iconClassName: 'text-purple-600',
      borderClassName: 'border-purple-200/70',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link to="/" className="inline-flex items-center gap-2 no-underline">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
              <Zap className="h-4 w-4 text-white" />
            </span>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Peer
              <span className="text-brand-gradient">
                Path
              </span>
            </span>
          </Link>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              className="inline-flex items-center gap-2 rounded-xl px-2.5 py-2 transition-colors hover:bg-slate-100"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
            >
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={safeUserName}
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-indigo-100"
                />
              ) : (
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white">
                  {profileInitial}
                </span>
              )}
              <span className="hidden text-sm font-semibold text-slate-700 sm:block">{safeUserName}</span>
              <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
            </button>

            {menuOpen && (
              <>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="fixed inset-0 z-40 h-full w-full cursor-default"
                  aria-label="Close user menu"
                />
                <div className="absolute right-0 top-12 z-50 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-300/40">
                  <button
                    type="button"
                    onClick={() => scrollToSection('profile-section')}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('progress-section')}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <BarChart3 className="h-4 w-4" />
                    Progress
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('syllabus-section')}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <BookOpen className="h-4 w-4" />
                    Syllabus
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('strategy-section')}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <Target className="h-4 w-4" />
                    Strategy
                  </button>
                  <div className="my-1 h-px bg-slate-100" />
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-5 py-7 sm:px-8 sm:py-8">
        <section className="grid gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-12 md:p-7">
          <div className="md:col-span-8">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-600">Dashboard</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Welcome back, {safeUserName}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Keep your momentum. Track streaks, maintain XP growth, and execute your syllabus in focused daily blocks.
            </p>
          </div>
          <div className="md:col-span-4">
            <div className="rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-5 text-white shadow-lg shadow-indigo-500/30">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">Level</p>
              <p className="mt-1 text-3xl font-black">{level}</p>
              <p className="mt-1 text-sm text-white/80">
                {xpIntoLevel} / {xpTarget} XP to next level
              </p>
              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/20">
                <div className="h-full rounded-full bg-white" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>
        </section>

        <section id="progress-section" className="scroll-mt-24 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((item) => (
            <article
              key={item.label}
              className={`rounded-2xl border ${item.borderClassName} bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg`}
            >
              <div className="flex items-center gap-3">
                <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${item.iconBgClassName}`}>
                  <item.icon className={`h-5 w-5 ${item.iconClassName}`} />
                </span>
                <div>
                  <p className="text-2xl font-black text-slate-900">{item.value}</p>
                  <p className="text-sm font-semibold text-slate-500">{item.label}</p>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="grid gap-5 lg:grid-cols-12">
          <article
            id="syllabus-section"
            className="scroll-mt-24 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-8"
          >
            <div className="border-b border-slate-100 p-5 sm:p-6">
              <h2 className="inline-flex items-center gap-2 text-lg font-extrabold text-slate-900 sm:text-xl">
                <Rocket className="h-5 w-5 text-indigo-600" />
                Your Learning Path
              </h2>
              <p className="mt-1 text-sm text-slate-600">Organize your syllabus and generate your adaptive execution plan.</p>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Next Priority</p>
                <h3 className="mt-2 text-base font-extrabold text-slate-900">Data Structures Revision</h3>
                <p className="mt-1 text-sm text-slate-600">2 hours planned for today, with peer notes and solved examples.</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Upcoming Deadline</p>
                <h3 className="mt-2 text-base font-extrabold text-slate-900">Operating Systems Quiz</h3>
                <p className="mt-1 text-sm text-slate-600">Due in 3 days. Schedule will auto-rebalance if today is missed.</p>
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5 hover:shadow-indigo-500/45 sm:col-span-2"
              >
                <Sparkles className="h-4 w-4" />
                Generate Study Plan
              </button>
            </div>
          </article>

          <div className="space-y-5 lg:col-span-4">
            <article id="strategy-section" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-extrabold uppercase tracking-[0.2em] text-slate-700">Quick Actions</h3>
              <div className="mt-3 space-y-2">
                {[
                  { icon: Calendar, label: 'Open Weekly Schedule', tint: 'bg-indigo-50 text-indigo-600' },
                  { icon: BookOpen, label: 'Browse Peer Notes', tint: 'bg-purple-50 text-purple-600' },
                  { icon: Target, label: 'Set New Goal', tint: 'bg-pink-50 text-pink-600' },
                  { icon: Clock, label: 'Start Study Timer', tint: 'bg-emerald-50 text-emerald-600' },
                ].map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
                  >
                    <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${action.tint}`}>
                      <action.icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-semibold text-slate-700">{action.label}</span>
                  </button>
                ))}
              </div>
            </article>

            <article id="profile-section" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-extrabold uppercase tracking-[0.2em] text-slate-700">Profile Snapshot</h3>
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-500">Name</p>
                <p className="text-base font-extrabold text-slate-900">{safeUserName}</p>
                <p className="mt-3 text-sm font-semibold text-slate-500">Email</p>
                <p className="text-sm font-semibold text-slate-800">{user?.email || 'Not available'}</p>
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Dashboard