import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Menu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const STAFF_ROLES = new Set(['super_admin', 'manager', 'editor']);

const AdminLayout = () => {
  const { isDark } = useTheme();
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);
  // Hubi haddii qofku Login yahay
  const isAuthenticated = localStorage.getItem('token');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user?.role === 'member') {
      return <Navigate to="/portal" replace />;
    }
    if (user?.role && !STAFF_ROLES.has(user.role)) {
      return <Navigate to="/login" replace />;
    }
  } catch {
    /* ignore */
  }

  return (
    <div className={`flex h-screen overflow-hidden ${isDark ? 'bg-gray-950' : 'bg-[#F9FAFB]'}`}>
      {/* Midig: Sidebar (Had iyo jeer taagan) */}
      <Sidebar mobileOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

      {/* Bidix: Qaybta weyn */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header
          className={`sticky top-0 z-20 flex h-16 items-center justify-between border-b px-4 sm:px-6 lg:px-8 ${
            isDark ? 'border-gray-800 bg-gray-900/90 text-gray-100' : 'border-gray-100 bg-white/90 text-gray-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className={`rounded-lg p-2 lg:hidden ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand">SYADA Admin</p>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Responsive control center</p>
            </div>
          </div>
        </header>
        
        {/* Halkan waxaa ku dhex furmaya boggaga Dashboard, Members, iwm */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;