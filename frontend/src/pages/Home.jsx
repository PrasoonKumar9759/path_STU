import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  ArrowRight,
  BookOpen,
  CalendarX2,
  CheckCircle2,
  ChevronRight,
  Coins,
  Flame,
  GraduationCap,
  Menu,
  Play,
  RefreshCcw,
  SearchX,
  Shield,
  Sparkles,
  Star,
  Trophy,
  UserCheck,
  Users2,
  X,
  Zap,
} from 'lucide-react'

const problemCards = [
  {
    icon: CalendarX2,
    iconClassName: 'text-red-500',
    iconBgClassName: 'bg-red-50',
    title: 'Static planners fail you',
    description:
      "Miss one day and the entire plan collapses. Traditional schedules don't adapt when real life changes your time.",
  },
  {
    icon: SearchX,
    iconClassName: 'text-orange-500',
    iconBgClassName: 'bg-orange-50',
    title: "Generic content doesn't match your syllabus",
    description:
      "Hours disappear while searching. Most videos and notes are not structured around your actual exam boundaries.",
  },
  {
    icon: Users2,
    iconClassName: 'text-amber-600',
    iconBgClassName: 'bg-amber-50',
    title: 'Studying alone gives no feedback loop',
    description:
      "Without peer signals or progress checkpoints, it's hard to know if you are practicing the right topics at the right depth.",
  },
]

const solutionCards = [
  {
    icon: RefreshCcw,
    iconClassName: 'text-indigo-600',
    iconBgClassName: 'bg-indigo-100',
    title: 'Dynamic Restructuring',
    description:
      'Missed a day? PeerPath AI recalculates your entire roadmap, keeping deadlines realistic without burning you out.',
  },
  {
    icon: GraduationCap,
    iconClassName: 'text-purple-600',
    iconBgClassName: 'bg-purple-100',
    title: 'Exam-Mode Planning',
    description:
      'Upload syllabus, set exam date, and get a topic-by-topic execution schedule with curated resources and checkpoints.',
  },
  {
    icon: UserCheck,
    iconClassName: 'text-pink-600',
    iconBgClassName: 'bg-pink-100',
    title: 'Peer-Matched Learning',
    description:
      'Each topic can be paired with top-rated peer notes and explanation clips from students who already aced it.',
  },
]

const Home = () => {
  const { isAuthenticated } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const primaryCtaTo = isAuthenticated ? '/dashboard' : '/register'
  const primaryCtaLabel = isAuthenticated ? 'Open Dashboard' : 'Get Started Free'

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
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

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#problem" className="text-sm font-semibold text-slate-600 transition-colors hover:text-indigo-600 no-underline">
              Problem
            </a>
            <a href="#solution" className="text-sm font-semibold text-slate-600 transition-colors hover:text-indigo-600 no-underline">
              Solution
            </a>
            <a href="#economy" className="text-sm font-semibold text-slate-600 transition-colors hover:text-indigo-600 no-underline">
              Token Economy
            </a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-5 py-2.5 text-sm font-bold text-white no-underline shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5 hover:shadow-indigo-500/45"
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:text-indigo-600 no-underline"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-5 py-2.5 text-sm font-bold text-white no-underline shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5 hover:shadow-indigo-500/45"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 md:hidden"
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-slate-200 bg-white px-5 py-4 md:hidden">
            <div className="space-y-2">
              <a
                href="#problem"
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 no-underline"
              >
                Problem
              </a>
              <a
                href="#solution"
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 no-underline"
              >
                Solution
              </a>
              <a
                href="#economy"
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 no-underline"
              >
                Token Economy
              </a>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="col-span-2 rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-3 py-2 text-center text-sm font-bold text-white no-underline"
                >
                  Open Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-center text-sm font-semibold text-slate-700 no-underline"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-3 py-2 text-center text-sm font-bold text-white no-underline"
                  >
                    Start Free
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="pt-16">
        <section className="relative overflow-hidden pb-20 pt-14 sm:pt-16 lg:pb-24" id="top">
          <div className="pointer-events-none absolute -left-20 -top-24 h-80 w-80 rounded-full bg-indigo-200/50 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 -top-12 h-96 w-96 rounded-full bg-purple-200/50 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-pink-100/50 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-2 shadow-sm">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <span className="text-xs font-semibold tracking-wide text-slate-700 sm:text-sm">
                  AI-Adaptive Learning + Peer-Powered Resources
                </span>
              </div>

              <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl xl:text-7xl">
                Stop searching.
                <br />
                Start{' '}
                <span className="text-brand-gradient">
                  acing.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
                Upload your syllabus and exam date. PeerPath builds a smart study path that adapts in real time,
                then pairs each step with trusted peer notes and lesson clips.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  to={primaryCtaTo}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-7 py-3.5 text-sm font-bold text-white no-underline shadow-xl shadow-indigo-500/30 transition-all hover:-translate-y-0.5 hover:shadow-indigo-500/45"
                >
                  {primaryCtaLabel}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href="#solution"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-7 py-3.5 text-sm font-bold text-slate-700 no-underline transition-all hover:border-indigo-300 hover:text-indigo-600"
                >
                  <Play className="h-4 w-4" />
                  See How It Works
                </a>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {['A', 'S', 'M', 'R'].map((char, index) => (
                      <span
                        key={char}
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white ${
                          index === 0
                            ? 'bg-indigo-500'
                            : index === 1
                              ? 'bg-purple-500'
                              : index === 2
                                ? 'bg-pink-500'
                                : 'bg-amber-500'
                        }`}
                      >
                        {char}
                      </span>
                    ))}
                  </div>
                  <span className="font-semibold">10,000+ active learners</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Star key={value} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-1 font-semibold">4.9 / 5 user rating</span>
                </div>
                <div className="flex items-center gap-1.5 font-semibold">
                  <Shield className="h-4 w-4 text-emerald-600" />
                  95% completion rate
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-2xl shadow-slate-300/35 sm:p-6">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">Your Week Plan</p>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                      Synced
                    </span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {[
                      { day: 'Mon', topic: 'OS Memory Management', status: 'done' },
                      { day: 'Tue', topic: 'DBMS Normalization', status: 'done' },
                      { day: 'Wed', topic: 'Skipped: Graph Theory', status: 'missed' },
                      { day: 'Thu', topic: 'Auto-Replanned Session', status: 'active' },
                    ].map((item) => (
                      <div
                        key={item.day}
                        className={`rounded-xl border px-3 py-2.5 ${
                          item.status === 'done'
                            ? 'border-emerald-200 bg-emerald-50/60'
                            : item.status === 'missed'
                              ? 'border-rose-200 bg-rose-50/60'
                              : 'border-indigo-200 bg-indigo-50/70'
                        }`}
                      >
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{item.day}</p>
                        <p className="mt-0.5 text-sm font-semibold text-slate-800">{item.topic}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-indigo-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">Focus Score</p>
                    <p className="mt-1 text-2xl font-black text-indigo-700">92%</p>
                  </div>
                  <div className="rounded-2xl bg-amber-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-amber-600">Streak</p>
                    <p className="mt-1 text-2xl font-black text-amber-700">5 Days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="scroll-mt-24 bg-white py-20 lg:py-24" id="problem">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-500">The Problem</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Your current study system is <span className="text-red-500">fighting you.</span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
                You are not lazy. Your system is brittle. Here are the three bottlenecks that keep good students stuck.
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {problemCards.map((card) => (
                <article
                  key={card.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBgClassName}`}>
                    <card.icon className={`h-5 w-5 ${card.iconClassName}`} />
                  </span>
                  <h3 className="mt-5 text-lg font-extrabold text-slate-900">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">{card.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="scroll-mt-24 py-20 lg:py-24" id="solution">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-600">The Solution</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                The PeerPath{' '}
                <span className="text-brand-gradient">
                  advantage
                </span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
                Three core systems work together so your study plan stays aligned, adaptive, and accountable.
              </p>
            </div>

            <div className="mt-12 grid gap-5 lg:grid-cols-12">
              <div className="lg:col-span-8 grid gap-5 sm:grid-cols-2">
                {solutionCards.map((card) => (
                  <article
                    key={card.title}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBgClassName}`}>
                      <card.icon className={`h-5 w-5 ${card.iconClassName}`} />
                    </span>
                    <h3 className="mt-5 text-lg font-extrabold text-slate-900">{card.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">{card.description}</p>
                  </article>
                ))}
              </div>

              <aside className="lg:col-span-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-xl shadow-slate-900/25">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-extrabold">Adaptive AI Engine</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                  PeerPath learns your pace and weak spots over time, then optimizes priority and difficulty to keep
                  your execution realistic and exam-ready.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {['Weak Spot Detection', 'Smart Prioritization', 'Time Rebalancing', 'Retention Boost'].map((item) => (
                    <span key={item} className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/90">
                      {item}
                    </span>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="scroll-mt-24 bg-indigo-50/60 py-20 lg:py-24" id="economy">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-purple-600">Token Economy</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Earn while you{' '}
                <span className="text-brand-gradient">
                  learn
                </span>
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
                Good consistency deserves reward. PeerPath turns daily progress into tokens you can redeem for premium
                peer content, breakdowns, and exam-focused bundles.
              </p>

              <ul className="mt-7 space-y-3">
                {[
                  'Maintain streaks for weekly bonus tokens',
                  'Complete quizzes to gain XP and rewards',
                  'Redeem tokens for high-quality peer resources',
                  'Unlock badges by hitting milestone goals',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-700 sm:text-base">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                to={primaryCtaTo}
                className="group mt-8 inline-flex items-center gap-2 text-sm font-bold text-indigo-600 no-underline transition-colors hover:text-indigo-700 sm:text-base"
              >
                {isAuthenticated ? 'Continue your progress' : 'Start earning tokens'}
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-indigo-500/10 sm:p-6">
                <div className="flex items-center justify-between">
                  <h3 className="inline-flex items-center gap-2 text-base font-extrabold text-slate-900 sm:text-lg">
                    <Flame className="h-5 w-5 text-orange-500" />
                    Streak Tracker
                  </h3>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">Active</span>
                </div>
                <div className="mt-4 grid grid-cols-7 gap-1.5">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                    <div
                      key={`${day}-${index}`}
                      className={`rounded-lg py-2 text-center text-xs font-bold ${
                        index < 5
                          ? 'bg-gradient-to-b from-orange-400 to-orange-500 text-white'
                          : index === 5
                            ? 'border-2 border-dashed border-orange-300 bg-orange-100 text-orange-500'
                            : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {index < 5 ? 'Streak' : day}
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-indigo-500/10 sm:p-6">
                <div className="flex items-center justify-between">
                  <h3 className="inline-flex items-center gap-2 text-base font-extrabold text-slate-900 sm:text-lg">
                    <Coins className="h-5 w-5 text-amber-500" />
                    Token Wallet
                  </h3>
                  <p className="text-2xl font-black text-amber-600">248</p>
                </div>

                <div className="mt-4 space-y-2.5 text-sm">
                  <div className="flex items-center justify-between rounded-lg bg-purple-50 px-3 py-2">
                    <span className="inline-flex items-center gap-2 text-slate-700">
                      <Trophy className="h-4 w-4 text-purple-600" />
                      7-day streak bonus
                    </span>
                    <span className="font-bold text-emerald-600">+50</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2">
                    <span className="inline-flex items-center gap-2 text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      Quiz completion
                    </span>
                    <span className="font-bold text-emerald-600">+25</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-indigo-50 px-3 py-2">
                    <span className="inline-flex items-center gap-2 text-slate-700">
                      <BookOpen className="h-4 w-4 text-indigo-600" />
                      Peer notes unlock
                    </span>
                    <span className="font-bold text-rose-500">-15</span>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 lg:py-24">
          <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-center text-white shadow-2xl shadow-indigo-500/30 sm:p-12">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Have an exam coming soon?
              <br />
              Let AI build your survival path.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base text-white/85 sm:text-lg">
              Move from overwhelm to execution in under a minute. Your adaptive plan is one click away.
            </p>
            <Link
              to={primaryCtaTo}
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-indigo-700 no-underline shadow-lg transition-all hover:-translate-y-0.5 sm:text-base"
              style={{ color: '#312e81' }}
            >
              {primaryCtaLabel}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-10 text-sm text-slate-500 sm:px-8 md:flex-row">
          <div className="inline-flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
              <Zap className="h-3.5 w-3.5 text-white" />
            </span>
            <span className="font-bold text-slate-800">PeerPath AI</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="#" className="transition-colors hover:text-indigo-600 no-underline">Privacy</a>
            <a href="#" className="transition-colors hover:text-indigo-600 no-underline">Terms</a>
            <a href="#" className="transition-colors hover:text-indigo-600 no-underline">Contact</a>
          </div>
          <p className="text-slate-400">Copyright 2026 PeerPath AI</p>
        </div>
      </footer>
    </div>
  )
}

export default Home