import React from 'react';
import { Link } from 'react-router-dom';
import {  Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white pt-20 pb-10 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* 1. Logo & About */}
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <img 
                src="/src/assets/logo.jpeg" 
                alt="SYADA Logo" 
                className="w-20 h-20 object-contain rounded-xl" 
              />
              <div className="flex flex-col">
                <span className="font-black text-2xl tracking-tighter leading-none text-[#065F46]">SYADA ORG</span>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Awareness & Development</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
              Waxaan nahay urur u taagan xoojinta iyo horumarinta dhallinyarada Soomaaliyeed.
            </p>
          </div>

          {/* 2. Quick Links */}
          <div className="md:col-span-4">
            <h4 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest">Navigation</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-sm text-gray-500 hover:text-[#065F46]">Home</Link></li>
              <li><Link to="/about" className="text-sm text-gray-500 hover:text-[#065F46]">About Us</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-500 hover:text-[#065F46]">Contact</Link></li>
            </ul>
          </div>

          {/* 3. Contact */}
          <div className="md:col-span-4">
            <h4 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest">Contact Us</h4>
            <div className="text-sm text-gray-500 space-y-3">
              <p className="flex items-center gap-2"><Mail size={16} /> SYADAORG2030@gmail.com</p>
              <p className="flex items-center gap-2"><Phone size={16} /> +252 61 9989515</p>
            </div>
          </div>

        </div>

        <div className="pt-10 border-t border-gray-50 text-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
            © 2026 SYADA ORGANIZATION. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;