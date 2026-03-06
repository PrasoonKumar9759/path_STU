import axios from 'axios'

const API_URL = '/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add a request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  register: async (name, email, password, role) => {
    const response = await api.post('/auth/register', { name, email, password, role })
    return response.data
  },

  googleAuth: async (credential) => {
    const response = await api.post('/auth/google', { credential })
    return response.data
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },
}

export const plannerService = {
  generatePlan: async (subject, topics, targetDate) => {
    const response = await api.post('/planner/generate', {
      subject,
      topics,
      targetDate,
    })
    return response.data
  },

  getTodayTasks: async () => {
    const response = await api.get('/planner/tasks/today')
    return response.data
  },

  getAllTasks: async () => {
    const response = await api.get('/planner/tasks')
    return response.data
  },

  completeTask: async (taskId) => {
    const response = await api.post(`/planner/tasks/${taskId}/complete`)
    return response.data
  },
}

export const contentService = {
  createContent: async (payload) => {
    const response = await api.post('/content', payload)
    return response.data
  },

  browseContent: async (subject, query) => {
    const params = {}
    if (subject) params.subject = subject
    if (query) params.q = query
    const response = await api.get('/content', { params })
    return response.data
  },

  getSubjects: async () => {
    const response = await api.get('/content/subjects')
    return response.data
  },
}

export default api
