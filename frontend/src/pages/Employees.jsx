import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getEmployees, deleteEmployee, createEmployee } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'

export default function Employees() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState(null)

  // Register form
  const [form, setForm] = useState({ employee_id: '', full_name: '', email: '', department: '' })
  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const fetchEmployees = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getEmployees()
      setEmployees(res.data)
    } catch {
      setError('Failed to load employees.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchEmployees() }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(t)
  }, [toast])

  const handleDelete = async (id) => {
    if (deleteId) return
    setDeleteId(id)
    try {
      await deleteEmployee(id)
      setEmployees(prev => prev.filter(e => e.id !== id))
      setToast({ type: 'success', msg: 'Employee removed successfully.' })
    } catch {
      setToast({ type: 'error', msg: 'Failed to delete employee.' })
    } finally {
      setDeleteId(null)
    }
  }

  const validate = () => {
    const errs = {}
    if (!form.employee_id.trim()) errs.employee_id = 'Required'
    if (!form.full_name.trim()) errs.full_name = 'Required'
    if (!form.email.trim()) errs.email = 'Required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email'
    if (!form.department.trim()) errs.department = 'Required'
    return errs
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (formErrors[e.target.name]) setFormErrors({ ...formErrors, [e.target.name]: null })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return }
    setSubmitting(true)
    try {
      await createEmployee(form)
      setForm({ employee_id: '', full_name: '', email: '', department: '' })
      setFormErrors({})
      setToast({ type: 'success', msg: 'Employee registered successfully!' })
      fetchEmployees()
    } catch (err) {
      const detail = err.response?.data?.detail || 'Registration failed.'
      setToast({ type: 'error', msg: detail })
    } finally {
      setSubmitting(false)
    }
  }

  // Search filter
  const filtered = employees.filter(emp => {
    if (!search) return true
    const q = search.toLowerCase()
    return emp.full_name.toLowerCase().includes(q) || emp.employee_id.toLowerCase().includes(q) || emp.department.toLowerCase().includes(q)
  })

  // Departments for filter chips
  const departments = [...new Set(employees.map(e => e.department).filter(Boolean))]

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 animate-toast-in ${
          toast.type === 'success' ? 'bg-teal-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success' ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          )}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Employee Directory</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage and register organizational talent across all departments and divisions.</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300 flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {error}
          <button onClick={fetchEmployees} className="ml-auto text-red-800 font-medium hover:underline text-xs">Retry</button>
        </div>
      )}

      {/* Side-by-side layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Left: Register Form */}
        <div className="xl:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">Register New Talent</h2>
            <p className="text-xs text-slate-400 mb-5">Add a new employee to the system</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { name: 'employee_id', label: 'Employee ID', placeholder: 'EMP-001' },
                { name: 'full_name', label: 'Full Name', placeholder: 'John Doe' },
                { name: 'email', label: 'Work Email', placeholder: 'john@company.com', type: 'email' },
                { name: 'department', label: 'Department', placeholder: 'Engineering' },
              ].map(field => (
                <div key={field.name}>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">{field.label}</label>
                  <input
                    name={field.name}
                    type={field.type || 'text'}
                    value={form[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors dark:text-white dark:placeholder-slate-500 ${
                      formErrors[field.name] ? 'border-red-300 bg-red-50/50 dark:border-red-700 dark:bg-red-900/20' : 'border-slate-200 bg-slate-50 dark:border-slate-600 dark:bg-slate-700'
                    }`}
                  />
                  {formErrors[field.name] && <p className="mt-1 text-[11px] text-red-500">{formErrors[field.name]}</p>}
                </div>
              ))}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-lg text-white text-sm font-semibold transition-colors disabled:opacity-50"
                style={{ backgroundColor: '#0d9488' }}
                onMouseEnter={e => !submitting && (e.currentTarget.style.backgroundColor = '#0b7a70')}
                onMouseLeave={e => !submitting && (e.currentTarget.style.backgroundColor = '#0d9488')}
              >
                {submitting ? 'Registering...' : 'Register Employee'}
              </button>
            </form>
          </div>

          {/* Active Employees Stats */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 mt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Employees</h3>
              <span className="text-lg font-bold text-slate-900 dark:text-white">{employees.length}</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: '100%', backgroundColor: '#0d9488' }} />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Across {departments.length} department{departments.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Right: Employee Table */}
        <div className="xl:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            {/* Search & Filters */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search employees..."
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 dark:text-white dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>
              </div>
              {/* Department chips */}
              {departments.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {departments.map(dept => (
                    <button
                      key={dept}
                      onClick={() => setSearch(search === dept ? '' : dept)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                        search === dept ? 'text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                      style={search === dept ? { backgroundColor: '#0a1628' } : {}}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Table */}
            {loading ? (
              <div className="py-16"><LoadingSpinner /></div>
            ) : filtered.length === 0 ? (
              <div className="py-16">
                <EmptyState
                  title={employees.length === 0 ? 'No employees yet' : 'No matching employees'}
                  message={employees.length === 0 ? 'Register your first employee using the form.' : 'Try a different search term.'}
                />
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-700">
                        <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Employee</th>
                        <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Department</th>
                        <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Email</th>
                        <th className="px-5 py-3 text-right text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                      {filtered.map(emp => (
                        <tr key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: getAvatarColor(emp.full_name) }}>
                                {getInitials(emp.full_name)}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{emp.full_name}</p>
                                <p className="text-[11px] text-slate-400">{emp.employee_id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3">
                            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-medium" style={{ backgroundColor: '#f0fdfa', color: '#0d9488' }}>
                              {emp.department}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-sm text-slate-500 dark:text-slate-400">{emp.email}</td>
                          <td className="px-5 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                to={`/employees/${emp.id}/attendance`}
                                className="px-2.5 py-1 rounded-md text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                              >
                                View
                              </Link>
                              <button
                                onClick={() => handleDelete(emp.id)}
                                disabled={deleteId === emp.id}
                                className="px-2.5 py-1 rounded-md text-[11px] font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50"
                              >
                                {deleteId === emp.id ? '...' : 'Delete'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Footer */}
                <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">Showing {filtered.length} of {employees.length} employees</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

function getAvatarColor(name) {
  const colors = ['#0a1628', '#0d9488', '#6366f1', '#d946ef', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6']
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}
