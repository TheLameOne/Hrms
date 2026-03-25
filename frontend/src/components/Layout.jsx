import { NavLink, Outlet, useLocation, Link } from 'react-router-dom'
import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'

const navItems = [
  { to: '/', label: 'Dashboard', icon: DashboardIcon },
  { to: '/employees', label: 'Employees', icon: EmployeesIcon },
  { to: '/attendance', label: 'Attendance', icon: AttendanceIcon },
]

function DashboardIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1m-2 0h2" />
    </svg>
  )
}

function EmployeesIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function AttendanceIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  )
}

function getBreadcrumb(pathname) {
  if (pathname === '/') return [{ label: 'Home' }, { label: 'Dashboard' }]
  if (pathname === '/employees') return [{ label: 'Home', to: '/' }, { label: 'Employees' }]
  if (pathname === '/employees/add') return [{ label: 'Home', to: '/' }, { label: 'Employees', to: '/employees' }, { label: 'Add Employee' }]
  if (pathname === '/attendance') return [{ label: 'Home', to: '/' }, { label: 'Attendance' }]
  if (pathname.match(/\/employees\/\d+\/attendance/)) return [{ label: 'Home', to: '/' }, { label: 'Employees', to: '/employees' }, { label: 'Employee Detail' }]
  return [{ label: 'Home' }]
}

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const breadcrumbs = getBreadcrumb(location.pathname)
  const { dark, toggle } = useTheme()

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-slate-900">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Dark Navy */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-60 flex flex-col transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ backgroundColor: '#0a1628' }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-5 gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: '#0d9488' }}>
            A
          </div>
          <div>
            <h1 className="text-white font-bold text-base leading-tight">HRMS Lite</h1>
            <p className="text-slate-400 text-[10px] uppercase tracking-wider">Internal Admin</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 mt-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon />
                  <span>{item.label}</span>
                  {isActive && <div className="ml-auto w-1 h-5 rounded-full" style={{ backgroundColor: '#0d9488' }} />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Quick Add */}
        <div className="px-3 mb-3">
          <Link
            to="/employees/add"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-white text-sm font-semibold transition-colors"
            style={{ backgroundColor: '#0d9488' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#0b7a70'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#0d9488'}
          >
            + Quick Add
          </Link>
        </div>


      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-2">
            <button
              className="lg:hidden p-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              onClick={() => setSidebarOpen(true)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            {/* Breadcrumb */}
            <nav className="flex items-center text-sm">
              {breadcrumbs.map((crumb, i) => (
                <span key={i} className="flex items-center">
                  {i > 0 && <span className="mx-1.5 text-slate-300 dark:text-slate-600">›</span>}
                  {crumb.to ? (
                    <Link to={crumb.to} className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">{crumb.label}</Link>
                  ) : (
                    <span className="text-slate-800 dark:text-white font-medium">{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggle}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {dark ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-700">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">Admin User</p>
                <p className="text-[10px] text-slate-400">Executive Mode</p>
              </div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: '#0d9488' }}>
                AU
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="py-3 px-6 text-center text-xs text-slate-400 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          © 2026 HRMS Lite Enterprise. All rights reserved.
        </footer>
      </div>
    </div>
  )
}
