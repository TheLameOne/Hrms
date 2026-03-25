import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// --- Employee APIs ---

export const getEmployees = () => api.get('/employees')

export const getEmployee = (id) => api.get(`/employees/${id}`)

export const createEmployee = (data) => api.post('/employees/', data)

export const deleteEmployee = (id) => api.delete(`/employees/${id}`)

// --- Attendance APIs ---

export const getAttendance = (employeeId, params = {}) =>
  api.get(`/attendance/${employeeId}`, { params })

export const markAttendance = (data) => api.post('/attendance/', data)

// --- Dashboard APIs ---

export const getDashboardSummary = () => api.get('/dashboard/summary')

export default api
