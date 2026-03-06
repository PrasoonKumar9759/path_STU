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
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(response))
    setUser(response)
    return response
  }

  const register = async (name, email, password) => {
    const response = await authService.register(name, email, password)
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(response))
    setUser(response)
    return response
  }

  const googleLogin = async (credential) => {
    const response = await authService.googleAuth(credential)
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(response))
    setUser(response)
    return response
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
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
