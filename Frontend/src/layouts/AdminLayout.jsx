import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const AdminLayout = () => {
  // Hubi haddii qofku Login yahay
  const isAuthenticated = localStorage.getItem('token');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-[#F9FAFB] overflow-hidden">
      {/* Midig: Sidebar (Had iyo jeer taagan) */}
      <Sidebar />

      {/* Bidix: Qaybta weyn */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />
        
        {/* Halkan waxaa ku dhex furmaya boggaga Dashboard, Members, iwm */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;