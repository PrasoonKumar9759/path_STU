import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const persistSession = (nextUser, token) => {
    if (token) {
      localStorage.setItem('token', token)
    }
    localStorage.setItem('user', JSON.stringify(nextUser))
    setUser(nextUser)
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const userData = await authService.getCurrentUser()
        setUser(userData)
      } catch (error) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }

  const login = async (email, password) => {
    const response = await authService.login(email, password)
    persistSession(response, response.token)
    return response
  }

  const register = async (name, email, password, role) => {
    const response = await authService.register(name, email, password, role)
    persistSession(response, response.token)
    return response
  }

  const googleLogin = async (credential) => {
    const response = await authService.googleAuth(credential)
    persistSession(response, response.token)
    return response
  }

  const updateUserStats = (stats) => {
    setUser((previousUser) => {
      if (!previousUser) {
        return previousUser
      }

      const nextUser = {
        ...previousUser,
        ...stats,
      }

      localStorage.setItem('user', JSON.stringify(nextUser))
      return nextUser
    })
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    register,
    googleLogin,
    updateUserStats,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
