import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getEmployee, getAttendance, markAttendance } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

export default function EmployeeAttendance() {
  const { id } = useParams()
  const [employee, setEmployee] = useState(null)
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [status, setStatus] = useState('Present')
  const [marking, setMarking] = useState(false)
  const [toast, setToast] = useState(null)

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const fetchData = async (filters = {}) => {
    setLoading(true)
    setError(null)
    try {
      const [empRes, attRes] = await Promise.all([getEmployee(id), getAttendance(id, filters)])
      setEmployee(empRes.data)
      setRecords(attRes.data)
    } catch {
      setError('Failed to load data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [id])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(t)
  }, [toast])

  const handleFilter = (e) => {
    e.preventDefault()
    const params = {}
    if (startDate) params.start_date = startDate
    if (endDate) params.end_date = endDate
    fetchData(params)
  }

  const clearFilter = () => {
    setStartDate('')
    setEndDate('')
    fetchData()
  }

  const handleMarkAttendance = async (e) => {
    e.preventDefault()
    setMarking(true)
    try {
      await markAttendance({ employee_id: parseInt(id), date, status })
      const attRes = await getAttendance(id)
      setRecords(attRes.data)
      setDate(new Date().toISOString().split('T')[0])
      setToast({ type: 'success', msg: 'Attendance marked successfully.' })
    } catch (err) {
      const detail = err.response?.data?.detail
      setToast({ type: 'error', msg: detail || 'Failed to mark attendance.' })
    } finally {
      setMarking(false)
    }
  }

  const presentCount = records.filter(r => r.status === 'Present').length
  const absentCount = records.filter(r => r.status === 'Absent').length
  const attendanceRate = records.length > 0 ? Math.round((presentCount / records.length) * 100) : 0

  if (loading && !employee) return <div className="py-16"><LoadingSpinner /></div>

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

      {error && !employee && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300 mb-4">
          {error}
          <button onClick={() => fetchData()} className="ml-2 font-medium hover:underline text-xs">Retry</button>
        </div>
      )}

      {employee && (
        <>
          {/* Profile Header Card */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 mb-6">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0" style={{ backgroundColor: getAvatarColor(employee.full_name) }}>
                {getInitials(employee.full_name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">{employee.full_name}</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800">
                    Active
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-sm text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
                    {employee.employee_id}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    {employee.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    {employee.department}
                  </span>
                </div>
              </div>
              <Link to="/employees" className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors shrink-0">
                ← Back
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f0fdfa' }}>
                  <svg className="w-5 h-5" style={{ color: '#0d9488' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{attendanceRate}%</p>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider">Attendance Rate</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center">
                  <svg className="w-5 h-5 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{presentCount}</p>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider">Total Present</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center">
                  <svg className="w-5 h-5 text-rose-500 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{absentCount}</p>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider">Total Absent</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mark Attendance + Filter */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Mark Attendance</h2>
              <form onSubmit={handleMarkAttendance} className="flex flex-wrap gap-3 items-end">
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">Date</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} required
                    className="border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500" />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">Status</label>
                  <select value={status} onChange={e => setStatus(e.target.value)}
                    className="border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500">
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                  </select>
                </div>
                <button type="submit" disabled={marking}
                  className="px-4 py-2 rounded-lg text-white text-sm font-semibold disabled:opacity-50 transition-colors"
                  style={{ backgroundColor: '#0d9488' }}
                  onMouseEnter={e => !marking && (e.currentTarget.style.backgroundColor = '#0b7a70')}
                  onMouseLeave={e => !marking && (e.currentTarget.style.backgroundColor = '#0d9488')}>
                  {marking ? 'Saving...' : 'Mark'}
                </button>
              </form>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Filter Records</h2>
              <form onSubmit={handleFilter} className="flex flex-wrap gap-3 items-end">
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">From</label>
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                    className="border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500" />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">To</label>
                  <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                    className="border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500" />
                </div>
                <button type="submit" className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                  Apply
                </button>
                {(startDate || endDate) && (
                  <button type="button" onClick={clearFilter} className="text-xs font-medium hover:underline" style={{ color: '#0d9488' }}>Clear</button>
                )}
              </form>
            </div>
          </div>

          {/* Attendance History Table */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Attendance History</h2>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">{records.length} record{records.length !== 1 ? 's' : ''}</span>
            </div>
            {loading ? (
              <div className="py-16"><LoadingSpinner /></div>
            ) : records.length === 0 ? (
              <div className="py-16 text-center">
                <svg className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-sm text-slate-400">No attendance records yet.</p>
                <p className="text-xs text-slate-300 dark:text-slate-500 mt-1">Mark attendance above to get started.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-700">
                      <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Date</th>
                      <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Day</th>
                      <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                    {records.map(record => {
                      const d = new Date(record.date + 'T00:00:00')
                      return (
                        <tr key={record.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors">
                          <td className="px-5 py-3 text-sm text-slate-800 dark:text-slate-200 font-medium">
                            {d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="px-5 py-3 text-sm text-slate-500 dark:text-slate-400">
                            {d.toLocaleDateString('en-US', { weekday: 'long' })}
                          </td>
                          <td className="px-5 py-3">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                              record.status === 'Present' ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400' : 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400'
                            }`}>
                              {record.status === 'Present' ? (
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                              ) : (
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                              )}
                              {record.status}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
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
