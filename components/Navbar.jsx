import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-white border-b border-slate-200 px-6 md:px-10 py-3 flex items-center justify-between relative">

      {/* Logo */}
      <Link to="/dashboard" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
          <span className="text-white font-bold text-sm">A</span>
        </div>
        <span className="font-semibold text-lg text-slate-900">TaskFlow</span>
      </Link>

      {/* Nav links (desktop) */}
      <nav className="hidden md:flex items-center gap-1">
        <Link
          to="/dashboard"
          className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
        >
          Tasks
        </Link>
        <Link
          to="/analytics"
          className="px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
        >
          Analytics
        </Link>
        <Link
          to="/settings"
          className="px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
        >
          Settings
        </Link>
      </nav>

      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen((v) => !v)}
        className="md:hidden ml-2 p-2 rounded-md hover:bg-slate-100 transition"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* User menu */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-slate-100 transition"
        >
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-medium text-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <span className="hidden sm:block text-sm font-medium text-slate-700">
            {user?.name || 'User'}
          </span>
          <span className="text-slate-400 text-xs">▼</span>
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-10">
            <div className="px-4 py-2 border-b border-slate-100">
              <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
            <Link
              to="/settings"
              className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
            >
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
            >
              Log out
            </button>
          </div>
        )}
      </div>
      {/* Mobile nav (small screens) */}
      {mobileOpen && (
        <nav className="md:hidden absolute left-0 right-0 top-full bg-white border-t border-slate-200 shadow-md z-20">
          <div className="flex flex-col py-2">
            <Link
              to="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
            >
              Tasks
            </Link>
            <Link
              to="/analytics"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
            >
              Analytics
            </Link>
            <Link
              to="/settings"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
            >
              Settings
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}