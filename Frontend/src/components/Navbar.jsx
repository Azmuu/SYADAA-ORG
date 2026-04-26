import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Moon, Sun } from 'lucide-react';
import logoMark from '../assets/logo.jpeg';
import { useTheme } from '../context/ThemeContext';

const navClass = (isDark) => ({ isActive }) =>
  `text-sm font-medium tracking-tight transition-colors relative py-1 ${
    isActive ? 'text-brand' : isDark ? 'text-gray-300 hover:text-brand' : 'text-neutral-500 hover:text-brand'
  }`;

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-md ${
        isDark ? 'border-gray-800 bg-gray-900/95' : 'border-brand/10 bg-white/95'
      }`}
    >
      <nav className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2.5" onClick={() => setOpen(false)}>
          <img
            src={logoMark}
            alt=""
            className="h-10 w-10 rounded-full object-cover shadow-sm ring-2 ring-brand/20"
            width={40}
            height={40}
          />
          <span className="text-xl font-semibold tracking-tight text-brand">SYADA</span>
        </Link>

        <div className="hidden items-center gap-10 md:flex">
          <NavLink to="/" end className={navClass(isDark)}>
            {({ isActive }) => (
              <span className="relative inline-block py-1">
                Home
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-brand" />
                )}
              </span>
            )}
          </NavLink>
          <NavLink to="/about" className={navClass(isDark)}>
            {({ isActive }) => (
              <span className="relative inline-block py-1">
                About
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-brand" />
                )}
              </span>
            )}
          </NavLink>
          <Link
            to="/#activities"
            className={`text-sm font-medium tracking-tight transition-colors hover:text-brand ${
              isDark ? 'text-gray-300' : 'text-neutral-500'
            }`}
          >
            Activities
          </Link>
          <NavLink to="/contact" className={navClass(isDark)}>
            {({ isActive }) => (
              <span className="relative inline-block py-1">
                Contact
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-brand" />
                )}
              </span>
            )}
          </NavLink>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <button
            type="button"
            onClick={toggleTheme}
            className={`rounded-full p-2 transition-colors ${
              isDark ? 'text-amber-200/90 hover:bg-white/10' : 'text-neutral-600 hover:bg-brand-soft/50'
            }`}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <Link
            to="/login"
            className={`text-sm font-medium transition-colors hover:text-brand ${isDark ? 'text-gray-300' : 'text-neutral-600'}`}
          >
            Login
          </Link>
          <Link
            to="/contact"
            className="rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-dark"
          >
            Join us
          </Link>
        </div>

        <button
          type="button"
          className={`flex rounded-full p-2 md:hidden ${isDark ? 'text-gray-200' : 'text-neutral-700'}`}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div
          className={`border-t px-5 py-4 md:hidden ${
            isDark ? 'border-gray-800 bg-gray-900 text-gray-100' : 'border-brand/10 bg-white'
          }`}
        >
          <div className="flex flex-col gap-4">
            <Link to="/" className={`text-sm font-medium ${isDark ? 'text-gray-100' : 'text-neutral-800'}`} onClick={() => setOpen(false)}>
              Home
            </Link>
            <Link to="/about" className={`text-sm font-medium ${isDark ? 'text-gray-100' : 'text-neutral-800'}`} onClick={() => setOpen(false)}>
              About
            </Link>
            <Link to="/#activities" className={`text-sm font-medium ${isDark ? 'text-gray-100' : 'text-neutral-800'}`} onClick={() => setOpen(false)}>
              Activities
            </Link>
            <Link to="/contact" className={`text-sm font-medium ${isDark ? 'text-gray-100' : 'text-neutral-800'}`} onClick={() => setOpen(false)}>
              Contact
            </Link>
            <div className="flex items-center justify-between gap-2">
              <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-neutral-500'}`}>Theme</span>
              <button
                type="button"
                onClick={() => {
                  toggleTheme();
                }}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${
                  isDark ? 'bg-white/10 text-amber-200' : 'bg-brand-soft/80 text-neutral-800'
                }`}
                aria-pressed={isDark}
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
                {isDark ? 'Light' : 'Dark'}
              </button>
            </div>
            <Link to="/login" className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-neutral-600'}`} onClick={() => setOpen(false)}>
              Login
            </Link>
            <Link
              to="/contact"
              className="rounded-full bg-brand py-3 text-center text-sm font-medium text-white hover:bg-brand-dark"
              onClick={() => setOpen(false)}
            >
              Join us
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
