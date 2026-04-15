import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const PrivateRoute = () => {
  // Halkan ka hubi haddii qofku leeyahay Token ama uu Login yahay
  const isAuthenticated = localStorage.getItem('token'); 

  return isAuthenticated ? (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar-ka wuxuu u muuqanayaa dhamaan boggaga Admin-ka */}
      <Sidebar /> 
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <Outlet /> {/* Halkan waxaa ku dhex furmaya Dashboard, Members, iwm */}
        </main>
      </div>
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;