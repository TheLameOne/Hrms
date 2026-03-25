import { useState, useEffect } from 'react'
import { getEmployees, markAttendance } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Attendance() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [statuses, setStatuses] = useState({}) // { employeeId: 'Present' | 'Absent' }
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [search, setSearch] = useState('')

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

  const handleStatus = (empId, status) => {
    setStatuses(prev => ({ ...prev, [empId]: status }))
  }

  const handleSave = async () => {
    const entries = Object.entries(statuses)
    if (entries.length === 0) {
      setToast({ type: 'error', msg: 'No attendance marked. Click Present/Absent for employees first.' })
      return
    }
    setSaving(true)
    let successCount = 0
    let failCount = 0
    for (const [empId, status] of entries) {
      try {
        await markAttendance({ employee_id: parseInt(empId), date, status })
        successCount++
      } catch {
        failCount++
      }
    }
    setSaving(false)
    if (failCount > 0 && successCount > 0) {
      setToast({ type: 'error', msg: `${successCount} saved, ${failCount} failed (duplicate entries?).` })
    } else if (failCount > 0) {
      setToast({ type: 'error', msg: `Failed to save. Attendance may already exist for ${date}.` })
    } else {
      setToast({ type: 'success', msg: `Attendance saved for ${successCount} employee${successCount > 1 ? 's' : ''}.` })
      setStatuses({})
    }
  }

  const filtered = employees.filter(emp => {
    if (!search) return true
    const q = search.toLowerCase()
    return emp.full_name.toLowerCase().includes(q) || emp.employee_id.toLowerCase().includes(q)
  })

  const markedCount = Object.keys(statuses).length
  const presentCount = Object.values(statuses).filter(s => s === 'Present').length
  const absentCount = Object.values(statuses).filter(s => s === 'Absent').length

  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Daily Attendance</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track and manage daily employee attendance records across all departments.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || markedCount === 0}
          className="px-5 py-2.5 rounded-lg text-white text-sm font-semibold transition-colors disabled:opacity-40"
          style={{ backgroundColor: '#0d9488' }}
          onMouseEnter={e => !saving && (e.currentTarget.style.backgroundColor = '#0b7a70')}
          onMouseLeave={e => !saving && (e.currentTarget.style.backgroundColor = '#0d9488')}
        >
          {saving ? 'Saving...' : 'Save Attendance'}
        </button>
      </div>

      {/* Date selector + summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        {/* Date */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-4">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Selected Date</p>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full text-sm font-semibold text-slate-800 dark:text-white border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
          />
          <p className="text-[11px] text-slate-400 mt-1.5">{formattedDate}</p>
        </div>
        {/* Total Staff */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-4">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Total Staff</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{employees.length}</p>
          <p className="text-[11px] text-slate-400 mt-1.5">Registered employees</p>
        </div>
        {/* Present */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-4">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Present</p>
          <p className="text-3xl font-bold" style={{ color: '#0d9488' }}>{presentCount}</p>
          <p className="text-[11px] text-slate-400 mt-1.5">Marked present today</p>
        </div>
        {/* Absent */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-4">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Absent</p>
          <p className="text-3xl font-bold text-rose-500">{absentCount}</p>
          <p className="text-[11px] text-slate-400 mt-1.5">Marked absent today</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300">
          {error}
          <button onClick={fetchEmployees} className="ml-2 font-medium hover:underline text-xs">Retry</button>
        </div>
      )}

      {/* Employee Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-700">
          <div className="relative max-w-sm">
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

        {loading ? (
          <div className="py-16"><LoadingSpinner /></div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-slate-400">No employees found.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-700">
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Employee</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Department</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3 text-center text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                  {filtered.map(emp => {
                    const st = statuses[emp.id]
                    return (
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
                          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400">
                            {emp.department}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          {st ? (
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                              st === 'Present' ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400' : 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400'
                            }`}>
                              {st}
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-300 dark:text-slate-500">Not marked</span>
                          )}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleStatus(emp.id, 'Present')}
                              className={`p-1.5 rounded-lg transition-colors ${
                                st === 'Present' ? 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-400 hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:text-teal-600 dark:hover:text-teal-400'
                              }`}
                              title="Mark Present"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleStatus(emp.id, 'Absent')}
                              className={`p-1.5 rounded-lg transition-colors ${
                                st === 'Absent' ? 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-600 dark:hover:text-rose-400'
                              }`}
                              title="Mark Absent"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                {markedCount} of {filtered.length} employees marked
              </p>
            </div>
          </>
        )}
      </div>

      {/* Attendance Summary */}
      {markedCount > 0 && (
        <div className="mt-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-3">Attendance Summary</h2>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#0d9488' }} />
              <span className="text-sm text-slate-600 dark:text-slate-300">Present: <strong>{presentCount}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-400" />
              <span className="text-sm text-slate-600 dark:text-slate-300">Absent: <strong>{absentCount}</strong></span>
            </div>
          </div>
          <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mt-3">
            <div className="h-full flex">
              {presentCount > 0 && <div className="h-full rounded-l-full" style={{ width: `${(presentCount / markedCount) * 100}%`, backgroundColor: '#0d9488' }} />}
              {absentCount > 0 && <div className="h-full rounded-r-full bg-rose-300" style={{ width: `${(absentCount / markedCount) * 100}%` }} />}
            </div>
          </div>
        </div>
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
