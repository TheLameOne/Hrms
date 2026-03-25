import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getDashboardSummary } from '../services/api'
import SummaryCard from '../components/SummaryCard'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorAlert from '../components/ErrorAlert'

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchSummary = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getDashboardSummary()
      setSummary(res.data)
    } catch {
      setError('Failed to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSummary()
  }, [])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your HR operations</p>
      </div>

      {error && <ErrorAlert message={error} onRetry={fetchSummary} />}

      {loading ? (
        <LoadingSpinner />
      ) : summary ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <SummaryCard
              title="Total Employees"
              value={summary.total_employees}
              icon="👥"
              color="indigo"
            />
            <SummaryCard
              title="Present Today"
              value={summary.present_today}
              icon="✅"
              color="green"
            />
            <SummaryCard
              title="Absent Today"
              value={summary.absent_today}
              icon="❌"
              color="red"
            />
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/employees/add"
                className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                + Add Employee
              </Link>
              <Link
                to="/employees"
                className="bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                View All Employees
              </Link>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
