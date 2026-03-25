import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getDashboardSummary, getEmployees } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorAlert from '../components/ErrorAlert'

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [sumRes, empRes] = await Promise.all([getDashboardSummary(), getEmployees()])
      setSummary(sumRes.data)
      setEmployees(empRes.data)
    } catch {
      setError('Failed to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  // Department breakdown from employees
  const deptCounts = employees.reduce((acc, emp) => {
    const dept = emp.department?.substring(0, 12) || 'Other'
    acc[dept] = (acc[dept] || 0) + 1
    return acc
  }, {})
  const maxDeptCount = Math.max(...Object.values(deptCounts), 1)
  const deptColors = ['#0a1628', '#1a2744', '#334155', '#0d9488', '#64748b', '#475569']

  // Recently added employees (last 5)
  const recentEmployees = employees.slice(0, 5)

  const presentPct = summary && summary.total_employees > 0
    ? Math.round(((summary.present_today) / Math.max(summary.present_today + summary.absent_today, 1)) * 100)
    : 0
  const absentPct = 100 - presentPct

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Executive Overview</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time workforce metrics and organizational health indicators for the current fiscal period.</p>
      </div>

      {error && <ErrorAlert message={error} onRetry={fetchData} />}

      {loading ? (
        <LoadingSpinner />
      ) : summary ? (
        <>
          {/* Top stat cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {/* Total Employees Card */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: '#0a1628' }}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Total Employees</p>
                  <p className="text-4xl font-bold text-slate-900 dark:text-white mt-1">{summary.total_employees.toLocaleString()}</p>
                </div>
                <span className="px-3 py-1 text-xs font-semibold rounded-full text-teal-700 bg-teal-50 border border-teal-200">
                  System Active
                </span>
              </div>
            </div>

            {/* Today's Attendance Card */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Today's Attendance</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">Presence Real-time</p>
                </div>
                <div className="flex gap-6 text-right">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Present</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{summary.present_today.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Absent</p>
                    <p className="text-2xl font-bold text-rose-500">{summary.absent_today.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              {/* Progress bar */}
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mt-3">
                <div className="h-full rounded-full flex">
                  <div className="h-full rounded-l-full" style={{ width: `${presentPct}%`, backgroundColor: '#0d9488' }} />
                  <div className="h-full rounded-r-full bg-rose-200" style={{ width: `${absentPct}%` }} />
                </div>
              </div>
              <div className="flex justify-between mt-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                <span>{presentPct}% PRESENT</span>
                <span>{absentPct}% ABSENT</span>
              </div>
            </div>
          </div>

          {/* Bottom section: Department Mix + Recently Boarded */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Department Mix */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Department Mix</h2>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
                  </svg>
                </button>
              </div>
              {Object.keys(deptCounts).length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">No department data yet</p>
              ) : (
                <div className="flex items-end gap-3 h-40">
                  {Object.entries(deptCounts).map(([dept, count], i) => (
                    <div key={dept} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full max-w-[40px] rounded-t-md transition-all"
                        style={{
                          height: `${(count / maxDeptCount) * 100}%`,
                          minHeight: '8px',
                          backgroundColor: deptColors[i % deptColors.length]
                        }}
                      />
                      <p className="text-[10px] text-slate-500 mt-2 text-center uppercase tracking-wider w-full" title={dept}>
                        {dept}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recently Boarded */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Recently Boarded</h2>
                <Link to="/employees" className="text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">View All Directory</Link>
              </div>
              {recentEmployees.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">No employees yet</p>
              ) : (
                <div className="space-y-3">
                  {recentEmployees.map((emp) => (
                    <div key={emp.id} className="flex items-center gap-3 py-2">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ backgroundColor: getAvatarColor(emp.full_name) }}>
                        {getInitials(emp.full_name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{emp.full_name}</p>
                        <p className="text-xs text-slate-400 truncate">{emp.department}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">Joined</p>
                        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                          {emp.created_at ? new Date(emp.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      ) : null}
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
