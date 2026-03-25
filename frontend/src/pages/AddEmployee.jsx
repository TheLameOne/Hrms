import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createEmployee } from '../services/api'
import ErrorAlert from '../components/ErrorAlert'

export default function AddEmployee() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    department: '',
  })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const errs = {}
    if (!form.employee_id.trim()) errs.employee_id = 'Employee ID is required.'
    if (!form.full_name.trim()) errs.full_name = 'Full name is required.'
    if (!form.email.trim()) {
      errs.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Enter a valid email address.'
    }
    if (!form.department.trim()) errs.department = 'Department is required.'
    return errs
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setSubmitting(true)
    setApiError(null)
    try {
      await createEmployee(form)
      navigate('/employees')
    } catch (err) {
      const detail = err.response?.data?.detail
      setApiError(detail || 'Failed to create employee. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const fields = [
    { name: 'employee_id', label: 'Employee ID', placeholder: 'e.g. EMP001' },
    { name: 'full_name', label: 'Full Name', placeholder: 'e.g. John Doe' },
    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'e.g. john@company.com' },
    { name: 'department', label: 'Department', placeholder: 'e.g. Engineering' },
  ]

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <Link to="/employees" className="text-sm text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300">
          ← Back to Employees
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">Add New Employee</h1>
      </div>

      {apiError && <ErrorAlert message={apiError} />}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 space-y-5">
        {fields.map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
              {field.label}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={field.type || 'text'}
              value={form[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-slate-700 dark:text-white dark:placeholder-slate-500 ${
                errors[field.name] ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-slate-600'
              }`}
            />
            {errors[field.name] && (
              <p className="mt-1 text-xs text-red-600">{errors[field.name]}</p>
            )}
          </div>
        ))}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-teal-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Creating...' : 'Create Employee'}
          </button>
          <Link
            to="/employees"
            className="px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
