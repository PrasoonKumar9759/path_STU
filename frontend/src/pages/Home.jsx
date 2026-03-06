import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect, useRef } from 'react'
import './Home.css'

const Home = () => {
  const { isAuthenticated } = useAuth()
  const processRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    // Observe all animatable elements
    const animatableElements = document.querySelectorAll('.scroll-animate')
    animatableElements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <div className="home-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-left">
          <Link to="/" className="nav-logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">PathSTU</span>
          </Link>
        </div>
        <div className="nav-center">
          <a href="#features" className="nav-link">Features</a>
          <a href="#how-it-works" className="nav-link">How It Works</a>
          <a href="#gamification" className="nav-link">Gamification</a>
          <a href="#about" className="nav-link">About</a>
        </div>
        <div className="nav-right">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn-primary">Login</Link>
          ) : (
            <Link to="/login" className="btn-primary">Log In</Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-glow"></div>
        <div className="hero-content">
          <div className="hero-badge hero-animate hero-animate-1">
            <span className="badge-icon">✨</span>
            <span>AI-Powered Adaptive Learning</span>
          </div>
          
          <h1 className="hero-title hero-animate hero-animate-2">Study Smarter</h1>
          <h2 className="hero-subtitle hero-animate hero-animate-3">Level Up Faster</h2>
          
          <p className="hero-description hero-animate hero-animate-4">
            PathSTU combines AI-driven study plans, adaptive scheduling, and 
            gamification to keep you consistent and crush your learning goals.
          </p>
          
          <div className="hero-buttons hero-animate hero-animate-5">
            <Link to="/register" className="btn-hero-primary">
              START YOUR JOURNEY
              <span className="btn-arrow">→</span>
            </Link>
            <a href="#how-it-works" className="btn-hero-secondary">
              SEE HOW IT WORKS
            </a>
          </div>
        </div>

        {/* Decorative line */}
        <div className="hero-divider"></div>

        {/* Stats Section */}
        <div className="stats-section scroll-animate fade-up">
          <div className="stat-item">
            <span className="stat-value">10K+</span>
            <span className="stat-label">Active Learners</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">95%</span>
            <span className="stat-label">Completion Rate</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">4.9★</span>
            <span className="stat-label">User Rating</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <span className="features-label scroll-animate fade-up">FEATURES</span>
        <h2 className="section-title scroll-animate fade-up">
          <span className="title-white">Everything You Need to </span>
          <span className="title-accent">Excel</span>
        </h2>
        <p className="section-subtitle scroll-animate fade-up">
          A complete learning intelligence platform built for real-world study habits.
        </p>
        
        <div className="features-grid">
          <div className="feature-card scroll-animate fade-up" style={{transitionDelay: '0.1s'}}>
            <div className="feature-icon-box green">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
                <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
              </svg>
            </div>
            <h3>AI-Powered Plans</h3>
            <p>Enter your goal or syllabus and let AI generate a structured, personalized study roadmap.</p>
          </div>
          
          <div className="feature-card scroll-animate fade-up" style={{transitionDelay: '0.2s'}}>
            <div className="feature-icon-box cyan">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
                <path d="M21 3v5h-5"/>
              </svg>
            </div>
            <h3>Adaptive Scheduling</h3>
            <p>Missed a day? The system auto-restructures your plan to keep you on track before deadlines.</p>
          </div>
          
          <div className="feature-card scroll-animate fade-up" style={{transitionDelay: '0.3s'}}>
            <div className="feature-icon-box purple">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="12" r="6"/>
                <circle cx="12" cy="12" r="2"/>
              </svg>
            </div>
            <h3>Goal & Syllabus Modes</h3>
            <p>Choose goal-based planning for career targets or syllabus-based for exam preparation.</p>
          </div>
          
          <div className="feature-card scroll-animate fade-up" style={{transitionDelay: '0.4s'}}>
            <div className="feature-icon-box orange">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <h3>Deadline Feasibility</h3>
            <p>Smart validation ensures your plan is realistic within your available time and deadline.</p>
          </div>
          
          <div className="feature-card scroll-animate fade-up" style={{transitionDelay: '0.5s'}}>
            <div className="feature-icon-box teal">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
            </div>
            <h3>Progress Analytics</h3>
            <p>Track your performance with detailed analytics, completion rates, and trend insights.</p>
          </div>
          
          <div className="feature-card scroll-animate fade-up" style={{transitionDelay: '0.6s'}}>
            <div className="feature-icon-box mint">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h3>Topic Assessments</h3>
            <p>Complete quizzes after each topic to validate mastery before moving forward.</p>
          </div>
        </div>
      </section>

      {/* Process Section - How It Works */}
      <section id="how-it-works" className="process-section" ref={processRef}>
        <span className="section-label scroll-animate fade-up">PROCESS</span>
        <h2 className="section-title scroll-animate fade-up">
          <span className="title-white">How </span>
          <span className="title-gradient">PathSTU</span>
          <span className="title-white"> Works</span>
        </h2>

        <div className="process-timeline">
          <div className="timeline-line"></div>
          
          <div className="process-step left scroll-animate slide-left">
            <div className="step-card">
              <span className="step-number">01</span>
              <h3>Set Your Goal</h3>
              <p>Enter your learning target, deadline, and daily study hours. Choose goal-based or syllabus-based mode.</p>
            </div>
            <div className="step-dot"></div>
          </div>

          <div className="process-step right scroll-animate slide-right">
            <div className="step-dot"></div>
            <div className="step-card">
              <span className="step-number">02</span>
              <h3>AI Generates Plan</h3>
              <p>Our AI analyzes difficulty, estimates time, and creates a structured day-by-day study schedule.</p>
            </div>
          </div>

          <div className="process-step left scroll-animate slide-left">
            <div className="step-card">
              <span className="step-number">03</span>
              <h3>Study & Track</h3>
              <p>Follow your plan, complete assessments, earn XP, and maintain your streak for maximum consistency.</p>
            </div>
            <div className="step-dot"></div>
          </div>

          <div className="process-step right scroll-animate slide-right">
            <div className="step-dot"></div>
            <div className="step-card">
              <span className="step-number">04</span>
              <h3>Adapt & Conquer</h3>
              <p>Missed a day? The system restructures automatically. Stay on track no matter what life throws at you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gamification Section */}
      <section id="gamification" className="gamification-section">
        <span className="section-label purple scroll-animate fade-up">GAMIFICATION</span>
        <h2 className="section-title scroll-animate fade-up">
          <span className="title-white">Stay Motivated, </span>
          <span className="title-gradient">Level Up</span>
        </h2>
        <p className="section-subtitle scroll-animate fade-up">
          Streaks, badges, XP, and reward tokens keep you coming back every day.
        </p>

        <div className="gamification-content">
          <div className="level-card scroll-animate slide-left">
            <div className="level-header">
              <div className="level-info">
                <span className="level-label">Current Level</span>
                <span className="level-value">Level 12</span>
              </div>
              <div className="streak-badge">
                <span className="fire-icon">🔥</span>
                <span>14 Day Streak</span>
              </div>
            </div>
            
            <div className="xp-progress">
              <div className="xp-labels">
                <span>2,480 XP</span>
                <span>3,000 XP</span>
              </div>
              <div className="xp-bar">
                <div className="xp-fill" style={{width: '83%'}}></div>
              </div>
              <span className="xp-remaining">520 XP to Level 13</span>
            </div>

            <div className="stats-row">
              <div className="mini-stat">
                <span className="mini-value">47</span>
                <span className="mini-label">Topics Done</span>
              </div>
              <div className="mini-stat">
                <span className="mini-value">128</span>
                <span className="mini-label">Tokens</span>
              </div>
              <div className="mini-stat">
                <span className="mini-value">9</span>
                <span className="mini-label">Badges</span>
              </div>
            </div>
          </div>

          <div className="badges-grid scroll-animate slide-right">
            <div className="badge-item active">
              <div className="badge-icon">🔥</div>
              <span>7-Day Streak</span>
            </div>
            <div className="badge-item active">
              <div className="badge-icon">🏆</div>
              <span>First Topic</span>
            </div>
            <div className="badge-item active">
              <div className="badge-icon">⭐</div>
              <span>Quiz Master</span>
            </div>
            <div className="badge-item">
              <div className="badge-icon">🏅</div>
              <span>Milestone 50</span>
            </div>
            <div className="badge-item">
              <div className="badge-icon">⚡</div>
              <span>Speed Learner</span>
            </div>
            <div className="badge-item">
              <div className="badge-icon">💎</div>
              <span>Token Collector</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-card scroll-animate scale-up">
          <h2>
            <span className="title-white">Ready to </span>
            <span className="title-gradient">Transform</span>
          </h2>
          <h2 className="title-white">Your Study Game?</h2>
          <p>Join thousands of students who study smarter, stay consistent, and achieve their goals with PathSTU.</p>
          <Link to="/register" className="cta-button">
            GET STARTED FREE
            <span className="btn-arrow">→</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">PathSTU</span>
          </div>
          <div className="footer-links">
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
            <a href="#contact">Contact</a>
          </div>
          <p className="footer-copyright">&copy; 2026 PathSTU. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home
