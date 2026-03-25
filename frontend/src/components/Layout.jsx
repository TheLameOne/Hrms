import { NavLink, Outlet, useLocation, Link } from 'react-router-dom'
import { useState } from 'react'

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

  return (
    <div className="min-h-screen flex bg-slate-100">
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

        {/* Bottom links */}
        <div className="px-3 pb-5 space-y-1 border-t border-white/10 pt-3">
          <div className="flex items-center gap-3 px-3 py-2 text-slate-400 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-slate-400 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Support
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-2">
            <button
              className="lg:hidden p-2 rounded-md text-slate-500 hover:bg-slate-100"
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
                  {i > 0 && <span className="mx-1.5 text-slate-300">›</span>}
                  {crumb.to ? (
                    <Link to={crumb.to} className="text-slate-500 hover:text-slate-700">{crumb.label}</Link>
                  ) : (
                    <span className="text-slate-800 font-medium">{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-slate-700">Admin User</p>
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
        <footer className="py-3 px-6 text-center text-xs text-slate-400 border-t border-slate-200 bg-white">
          © 2026 HRMS Lite Enterprise. All rights reserved.
        </footer>
      </div>
    </div>
  )
}
