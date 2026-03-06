import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../context/AuthContext'
import './Login.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login, googleLogin, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/dashboard'

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate(from, { replace: true })
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password')
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
      setError(err.response?.data?.message || 'Google login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleError = () => {
    setError('Google login failed. Please try again.')
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <Link to="/" className="logo">
            <span className="logo-icon">📚</span>
            <span className="logo-text">PathSTU</span>
          </Link>
          <h1>Welcome Back</h1>
          <p>Sign in to continue your learning journey</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#" className="forgot-password">Forgot Password?</a>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <div className="social-login">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
            theme="filled_black"
            size="large"
            width="100%"
            text="continue_with"
          />
        </div>

        <p className="signup-link">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </div>

      <div className="login-illustration">
        <div className="illustration-content">
          <h2>Start Your Learning Journey</h2>
          <p>Track your progress, earn XP, and build your streak!</p>
          <div className="stats-preview">
            <div className="stat-item">
              <span className="stat-icon">🔥</span>
              <span className="stat-label">Daily Streaks</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">⭐</span>
              <span className="stat-label">Earn XP</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">📈</span>
              <span className="stat-label">Track Progress</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
