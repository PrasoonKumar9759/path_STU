import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../context/AuthContext'
import './Login.css'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { register, googleLogin, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/dashboard', { replace: true })
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      await register(name, email, password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('')
    setLoading(true)

    try {
      await googleLogin(credentialResponse.credential)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Google login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleError = () => {
    setError('Google signup failed. Please try again.')
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <Link to="/" className="logo">
            <span className="logo-icon">📚</span>
            <span className="logo-text">PathSTU</span>
          </Link>
          <h1>Create Account</h1>
          <p>Start your learning journey today</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

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
              placeholder="Create a password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <div className="social-login">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="filled_black"
            size="large"
            width="100%"
            text="signup_with"
          />
        </div>

        <p className="signup-link">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>

      <div className="login-illustration">
        <div className="illustration-content">
          <h2>Join PathSTU Today</h2>
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

export default Register
