import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logoMark from '../assets/logo.jpeg';

const navClass = ({ isActive }) =>
  `text-sm font-medium tracking-tight transition-colors relative py-1 ${
    isActive ? 'text-brand' : 'text-neutral-500 hover:text-brand'
  }`;

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-brand/10 bg-white/95 backdrop-blur-md">
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
          <NavLink to="/" end className={navClass}>
            {({ isActive }) => (
              <span className="relative inline-block py-1">
                Home
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-brand" />
                )}
              </span>
            )}
          </NavLink>
          <NavLink to="/about" className={navClass}>
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
            className="text-sm font-medium tracking-tight text-neutral-500 transition-colors hover:text-brand"
          >
            Activities
          </Link>
          <NavLink to="/contact" className={navClass}>
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

        <div className="hidden items-center gap-6 md:flex">
          <Link to="/login" className="text-sm font-medium text-neutral-600 transition-colors hover:text-brand">
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
          className="flex rounded-full p-2 text-neutral-700 md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-brand/10 bg-white px-5 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <Link to="/" className="text-sm font-medium text-neutral-800" onClick={() => setOpen(false)}>
              Home
            </Link>
            <Link to="/about" className="text-sm font-medium text-neutral-800" onClick={() => setOpen(false)}>
              About
            </Link>
            <Link to="/#activities" className="text-sm font-medium text-neutral-800" onClick={() => setOpen(false)}>
              Activities
            </Link>
            <Link to="/contact" className="text-sm font-medium text-neutral-800" onClick={() => setOpen(false)}>
              Contact
            </Link>
            <Link to="/login" className="text-sm font-medium text-neutral-600" onClick={() => setOpen(false)}>
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
