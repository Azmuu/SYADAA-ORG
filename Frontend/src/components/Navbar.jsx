import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, Settings, ChevronDown } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="h-20 bg-white border-b flex items-center justify-between px-8">
      
      {/* 🔥 LEFT LINKS */}
      <div className="flex gap-6 font-semibold">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/login">Login</Link>
      </div>

      {/* Search */}
      <div className="relative w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Search..." 
          className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl outline-none"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <Bell size={20} />
        <Settings size={20} />
        <ChevronDown size={16} />
      </div>
    </nav>
  );
};

export default Navbar;