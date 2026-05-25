import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Activity,
  Wallet,
  FolderOpen,
  LogOut,
  Dumbbell,
  Moon,
  Sun,
  X,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const subLinkClass = (isDark, isActive) =>
  `block rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
    isActive
      ? 'bg-brand-soft text-brand'
      : isDark
        ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
        : 'text-gray-600 hover:bg-gray-100'
  }`;

const Sidebar = ({ mobileOpen = false, onClose = () => {} }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const path = location.pathname;

  const shouldOpenMembers = path.startsWith('/admin/members');
  const shouldOpenFinance = path.startsWith('/admin/finance') || path === '/admin/members/finance';
  const shouldOpenSports = path.startsWith('/admin/sports');

  const [membersOpen, setMembersOpen] = useState(shouldOpenMembers);
  const [financeOpen, setFinanceOpen] = useState(shouldOpenFinance);
  const [sportsOpen, setSportsOpen] = useState(shouldOpenSports);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    onClose();
  };

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          aria-label="Close sidebar backdrop"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r p-6 transition-transform duration-200 ease-out lg:static lg:z-auto lg:w-64 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-[#F9FAFB] border-gray-100'}`}
      >
        <div className="mb-5 flex items-center justify-end lg:hidden">
          <button
            type="button"
            onClick={onClose}
            className={`rounded-lg p-2 ${isDark ? "text-gray-300 hover:bg-gray-800" : "text-gray-500 hover:bg-gray-100"}`}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex h-full flex-col">
          <div className="mb-8 flex items-center gap-3 pl-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-black text-sm font-bold italic text-white">A</div>
            <div>
              <h2 className={`text-sm font-black leading-none ${isDark ? 'text-white' : 'text-gray-900'}`}>The Archive</h2>
              <p className={`mt-1 text-[10px] font-bold uppercase tracking-tighter ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Admin Portal
              </p>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            <NavLink
              to="/admin/dashboard"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                  isActive
                    ? 'border-r-4 border-brand bg-brand-soft text-brand'
                    : isDark
                      ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                      : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                }`
              }
            >
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>

            <div>
              <button
                type="button"
                onClick={() => setMembersOpen((o) => !o)}
                className={`flex w-full items-center justify-between gap-2 rounded-xl px-4 py-3 text-left text-sm font-bold ${
                  isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
                aria-expanded={membersOpen}
              >
                <span className="flex items-center gap-3">
                  <Users size={18} />
                  Members
                </span>
                {membersOpen ? <ChevronDown size={16} className="shrink-0 opacity-70" /> : <ChevronRight size={16} className="shrink-0 opacity-70" />}
              </button>
              {membersOpen && (
                <div className={`ml-2 space-y-0.5 border-l-2 py-1 pl-3 ${isDark ? 'border-gray-700' : 'border-brand/25'}`}>
                  <NavLink
                    to="/admin/members/new"
                    onClick={onClose}
                    className={({ isActive }) => subLinkClass(isDark, isActive)}
                  >
                    <span className="flex items-center gap-2">
                      <UserPlus size={16} className="opacity-80" />
                      Register member
                    </span>
                  </NavLink>
                  <NavLink
                    to="/admin/members/all"
                    onClick={onClose}
                    end
                    className={({ isActive }) => subLinkClass(isDark, isActive)}
                  >
                    View all members
                  </NavLink>
                </div>
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={() => setFinanceOpen((o) => !o)}
                className={`flex w-full items-center justify-between gap-2 rounded-xl px-4 py-3 text-left text-sm font-bold ${
                  isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
                aria-expanded={financeOpen}
              >
                <span className="flex items-center gap-3">
                  <Wallet size={18} />
                  Finance
                </span>
                {financeOpen ? <ChevronDown size={16} className="shrink-0 opacity-70" /> : <ChevronRight size={16} className="shrink-0 opacity-70" />}
              </button>
              {financeOpen && (
                <div className={`ml-2 space-y-0.5 border-l-2 py-1 pl-3 ${isDark ? 'border-gray-700' : 'border-brand/25'}`}>
                  <NavLink
                    to="/admin/finance/all"
                    onClick={onClose}
                    className={({ isActive }) => subLinkClass(isDark, isActive)}
                  >
                    Revenue & expenses
                  </NavLink>
                  <NavLink
                    to="/admin/finance/sports"
                    onClick={onClose}
                    className={({ isActive }) => subLinkClass(isDark, isActive)}
                  >
                    Sports finance (ledger)
                  </NavLink>
                  <NavLink
                    to="/admin/members/finance"
                    onClick={onClose}
                    className={({ isActive }) => subLinkClass(isDark, isActive)}
                  >
                    <span className="flex items-center gap-2">
                      <Users size={16} className="opacity-80" />
                      Finance members (payments)
                    </span>
                  </NavLink>
                </div>
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={() => setSportsOpen((o) => !o)}
                className={`flex w-full items-center justify-between gap-2 rounded-xl px-4 py-3 text-left text-sm font-bold ${
                  isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
                aria-expanded={sportsOpen}
              >
                <span className="flex items-center gap-3">
                  <Dumbbell size={18} />
                  Sports members
                </span>
                {sportsOpen ? <ChevronDown size={16} className="shrink-0 opacity-70" /> : <ChevronRight size={16} className="shrink-0 opacity-70" />}
              </button>
              {sportsOpen && (
                <div className={`ml-2 space-y-0.5 border-l-2 py-1 pl-3 ${isDark ? 'border-gray-700' : 'border-brand/25'}`}>
                  <NavLink
                    to="/admin/sports"
                    end
                    onClick={onClose}
                    className={({ isActive }) => subLinkClass(isDark, isActive)}
                  >
                    View all
                  </NavLink>
                  <NavLink
                    to="/admin/sports/new"
                    onClick={onClose}
                    className={({ isActive }) => subLinkClass(isDark, isActive)}
                  >
                    <span className="flex items-center gap-2">
                      <UserPlus size={16} className="opacity-80" />
                      Add sports member
                    </span>
                  </NavLink>
                </div>
              )}
            </div>

            <NavLink
              to="/admin/reports"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                  isActive
                    ? 'border-r-4 border-brand bg-brand-soft text-brand'
                    : isDark
                      ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                      : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                }`
              }
            >
              <Activity size={18} />
              Activity logs
            </NavLink>

            <NavLink
              to="/admin/resources"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                  isActive
                    ? 'border-r-4 border-brand bg-brand-soft text-brand'
                    : isDark
                      ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                      : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                }`
              }
            >
              <FolderOpen size={18} />
              Resources
            </NavLink>
          </nav>

          <button
            type="button"
            onClick={toggleTheme}
            className={`mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-colors ${
              isDark ? 'bg-gray-800 text-gray-100 hover:bg-gray-700' : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            {isDark ? 'Light mode' : 'Dark mode'}
          </button>

          <button
            onClick={handleLogout}
            className={`mt-auto flex items-center gap-3 px-4 py-3 text-sm font-bold transition-colors ${
              isDark ? 'text-gray-400 hover:text-red-400' : 'text-gray-400 hover:text-red-500'
            }`}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
