import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getEmployee, getAttendance, markAttendance } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import ErrorAlert from '../components/ErrorAlert'

export default function EmployeeAttendance() {
  const { id } = useParams()
  const [employee, setEmployee] = useState(null)
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Mark attendance form
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [status, setStatus] = useState('Present')
  const [marking, setMarking] = useState(false)
  const [markError, setMarkError] = useState(null)

  // Date filter (bonus)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const fetchData = async (filters = {}) => {
    setLoading(true)
    setError(null)
    try {
      const [empRes, attRes] = await Promise.all([
        getEmployee(id),
        getAttendance(id, filters),
      ])
      setEmployee(empRes.data)
      setRecords(attRes.data)
    } catch {
      setError('Failed to load attendance data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [id])

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
    setMarkError(null)
    try {
      await markAttendance({ employee_id: parseInt(id), date, status })
      // Refresh records
      const attRes = await getAttendance(id)
      setRecords(attRes.data)
      setDate(new Date().toISOString().split('T')[0])
    } catch (err) {
      const detail = err.response?.data?.detail
      setMarkError(detail || 'Failed to mark attendance.')
    } finally {
      setMarking(false)
    }
  }

  // Bonus: count present days
  const presentCount = records.filter((r) => r.status === 'Present').length
  const absentCount = records.filter((r) => r.status === 'Absent').length

  if (loading && !employee) return <LoadingSpinner />
  if (error && !employee) return <ErrorAlert message={error} onRetry={() => fetchData()} />

  return (
    <div>
      <div className="mb-6">
        <Link to="/employees" className="text-sm text-indigo-600 hover:text-indigo-800">
          ← Back to Employees
        </Link>
        {employee && (
          <div className="mt-2">
            <h1 className="text-2xl font-bold text-gray-900">{employee.full_name}</h1>
            <p className="text-sm text-gray-500">
              {employee.employee_id} · {employee.department} · {employee.email}
            </p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{records.length}</p>
          <p className="text-xs text-gray-500 mt-1">Total Records</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{presentCount}</p>
          <p className="text-xs text-gray-500 mt-1">Present Days</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{absentCount}</p>
          <p className="text-xs text-gray-500 mt-1">Absent Days</p>
        </div>
      </div>

      {/* Mark Attendance Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Mark Attendance</h2>
        {markError && <ErrorAlert message={markError} />}
        <form onSubmit={handleMarkAttendance} className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={marking}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {marking ? 'Marking...' : 'Mark'}
          </button>
        </form>
      </div>

      {/* Date Filter (bonus) */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Filter by Date</h2>
        <form onSubmit={handleFilter} className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200"
          >
            Apply
          </button>
          {(startDate || endDate) && (
            <button
              type="button"
              onClick={clearFilter}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Attendance Records Table */}
      {loading ? (
        <LoadingSpinner />
      ) : records.length === 0 ? (
        <EmptyState
          title="No attendance records"
          message="Mark attendance above to get started."
        />
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {records.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        record.status === 'Present'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
