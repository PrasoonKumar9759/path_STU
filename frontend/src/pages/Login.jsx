import { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, BookOpen, Eye, EyeOff, Sparkles, TrendingUp, Users, Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login, googleLogin, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/dashboard'
  const googleEnabled = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim())

  const resolveApiError = (err, fallbackMessage) => {
    if (!err.response) {
      return 'Cannot connect to server. Please make sure backend is running.'
    }
    if (err.response?.data?.message) {
      return err.response.data.message
    }
    if (err.response?.data?.errors) {
      const firstError = Object.values(err.response.data.errors)[0]
      if (typeof firstError === 'string') return firstError
    }
    return fallbackMessage
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(resolveApiError(err, 'Invalid email or password'))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('')
    setLoading(true)

    try {
      await googleLogin(credentialResponse.credential)
      navigate(from, { replace: true })
    } catch (err) {
      setError(resolveApiError(err, 'Google login failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-2">
      <section className="flex items-center justify-center px-5 py-12 sm:px-8 lg:px-12">
        <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-300/30 sm:p-8">
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

          <h1 className="mt-8 text-3xl font-black tracking-tight text-slate-900">Welcome back</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
            Sign in to continue your personalized learning journey.
          </p>

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-slate-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                Remember me
              </label>
              <button type="button" className="text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-700">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5 hover:shadow-indigo-500/45 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          {googleEnabled && (
            <>
              <div className="my-5 flex items-center">
                <span className="h-px flex-1 bg-slate-200" />
                <span className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">or continue with</span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError('Google login failed. Please try again.')}
                  theme="outline"
                  size="large"
                  text="continue_with"
                />
              </div>
            </>
          )}

          <p className="mt-6 text-center text-sm text-slate-600">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-semibold text-indigo-600 no-underline transition-colors hover:text-indigo-700">
              Create one free
            </Link>
          </p>
        </div>
      </section>

      <section className="relative hidden overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 lg:flex lg:items-center lg:justify-center lg:p-12">
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

        <div className="relative max-w-md text-center text-white">
          <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
            <Sparkles className="h-8 w-8" />
          </span>
          <h2 className="mt-7 text-3xl font-black tracking-tight">Your AI Study Partner</h2>
          <p className="mt-4 text-base leading-relaxed text-white/85">
            Dynamic plans, progress tracking, and peer-powered resources in one focused learning system.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              { icon: BookOpen, label: 'Smart Plans' },
              { icon: TrendingUp, label: 'Progress' },
              { icon: Users, label: 'Peer Network' },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-white/15 p-3 backdrop-blur">
                <item.icon className="mx-auto h-5 w-5" />
                <p className="mt-1.5 text-xs font-semibold text-white/90">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Login