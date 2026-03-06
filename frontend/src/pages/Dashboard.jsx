import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import './Dashboard.css'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <Link to="/" className="logo">
            <span className="logo-icon">📚</span>
            <span className="logo-text">PathSTU</span>
          </Link>
        </div>
        <div className="header-right">
          <div className="user-menu">
            <div className="user-info">
              {user?.profilePicture ? (
                <img 
                  src={user.profilePicture} 
                  alt={user.name} 
                  className="user-avatar"
                />
              ) : (
                <div className="user-avatar-placeholder">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
              <span className="user-name">{user?.name}</span>
              <span className="dropdown-arrow">▼</span>
            </div>
            <div className="dropdown-menu">
              <Link to="/profile" className="dropdown-item">
                <span className="dropdown-icon">👤</span>
                Profile
              </Link>
              <Link to="/progress" className="dropdown-item">
                <span className="dropdown-icon">📊</span>
                Progress
              </Link>
              <Link to="/syllabus" className="dropdown-item">
                <span className="dropdown-icon">📖</span>
                Syllabus
              </Link>
              <Link to="/strategy" className="dropdown-item">
                <span className="dropdown-icon">🎯</span>
                Strategy
              </Link>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item signout" onClick={handleLogout}>
                <span className="dropdown-icon">🚪</span>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-section">
          <h1>Hey, {user?.name}! 👋</h1>
          <p>Ready to continue your learning journey?</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrapper fire">
              <span>🔥</span>
            </div>
            <div className="stat-content">
              <h3>{user?.currentStreak || 0}</h3>
              <p>Day Streak</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper xp">
              <span>⭐</span>
            </div>
            <div className="stat-content">
              <h3>{user?.totalXp || 0}</h3>
              <p>Total XP</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper streak">
              <span>🏆</span>
            </div>
            <div className="stat-content">
              <h3>{user?.longestStreak || 0}</h3>
              <p>Best Streak</p>
            </div>
          </div>
        </div>

        <div className="content-section">
          <h2>Your Learning Path</h2>
          <div className="placeholder-content">
            <p>🚀 Start learning to earn XP and build your streak!</p>
            <p>Your courses and progress will appear here.</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
