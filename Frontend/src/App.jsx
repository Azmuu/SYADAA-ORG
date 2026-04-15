import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Layouts
import AdminLayout from './layouts/AdminLayout';

// Components
import Navbar from './components/Navbar';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Login from './auth/Login';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import Members from './pages/admin/Members';
import Finance from './pages/admin/Finance';
import Reports from './pages/admin/Reports';

// 🔥 Component-kan wuxuu xukumaa muuqashada Navbar-ka
const NavigationWrapper = () => {
  const location = useLocation();
  
  // Haddii URL-ku uu ka bilaawdo "/admin", Navbar-ka ma soo baxayo (null)
  // Sidoo kale haddii aad rabto in bogga Login-ka uusan ka muuqan, ku dar: || location.pathname === '/login'
  const isHideNavbar = location.pathname.startsWith('/admin');

  return !isHideNavbar ? <Navbar /> : null;
};

function App() {
  return (
    <Router>
      {/* NavigationWrapper wuxuu ku dhex jiraa Router gudahiisa 
         si uu u isticmaali karo useLocation()
      */}
      <NavigationWrapper />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Routes - Marka halkan la joogo Navbar-ku waa qarsoon yahay */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="members" element={<Members />} />
          <Route path="finance" element={<Finance />} />
          <Route path="reports" element={<Reports />} />
        </Route>

        {/* Not found - Ku celi Home haddii link khaldan la qoro */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;