import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Activity, Wallet, FolderOpen, LogOut } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Member Directory', path: '/admin/members', icon: <Users size={18} /> },
    { name: 'Activity Logs', path: '/admin/reports', icon: <Activity size={18} /> },
    { name: 'Financials', path: '/admin/finance', icon: <Wallet size={18} /> },
    { name: 'Resources', path: '#', icon: <FolderOpen size={18} /> },
  ];

  return (
    <div className="w-64 h-full bg-[#F9FAFB] border-r border-gray-100 flex flex-col p-6">
      <div className="flex items-center gap-3 mb-12 pl-2">
        <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-white font-bold italic">A</div>
        <div>
          <h2 className="text-sm font-black text-gray-900 leading-none">The Archive</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-tighter">Admin Portal</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                isActive 
                ? 'bg-[#EBF5F1] text-[#065F46] border-r-4 border-[#065F46]' 
                : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

      <button 
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 text-gray-400 font-bold text-sm hover:text-red-500 transition-colors mt-auto"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;