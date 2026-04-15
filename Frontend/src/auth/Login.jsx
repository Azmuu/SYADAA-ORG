import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Fingerprint, QrCode, ArrowRight } from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Tusaale ahaan: Token-ka halkan ayaan ku kaydinaynaa
    localStorage.setItem('token', 'fake-admin-token');
    navigate('/admin/dashboard');
  };

  return (
    <div className="flex min-h-screen bg-white font-sans">
      {/* Left Side: Artwork */}
      <div className="hidden lg:flex lg:w-3/5 bg-[#065F46] relative overflow-hidden p-16 flex-col justify-end">
        {/* Placeholder for the Character Illustration */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#043d2d] to-transparent z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?auto=format&fit=crop&w=1000" 
          className="absolute inset-0 w-full h-full object-cover opacity-60" 
          alt="Documenting the Future"
        />
        
        <div className="relative z-20 max-w-xl">
          <h1 className="text-6xl font-black text-white leading-tight mb-6">
            Documenting the <br /> Future of Somalia.
          </h1>
          <p className="text-green-50/70 text-lg mb-10 leading-relaxed">
            Access the SYADA digital archive. A curated platform for community empowerment and historical preservation.
          </p>
          <div className="flex items-center gap-4">
            <div className="h-[2px] w-12 bg-green-200/30"></div>
            <span className="text-[10px] font-bold text-green-200/50 uppercase tracking-[0.3em]">The Empowered Archive</span>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-2/5 flex flex-col items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md">
          <div className="mb-12">
             <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mb-8">
                <span className="text-[#E67E22] font-black italic text-xl">SYADA</span>
             </div>
             <h2 className="text-3xl font-black text-gray-900 mb-2">Welcome Back</h2>
             <p className="text-gray-400 text-sm font-medium">Please enter your credentials to access the portal.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">Email Address</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#065F46] transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  placeholder="name@organization.so"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#065F46] outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Password</label>
                <button type="button" className="text-[10px] font-bold text-[#065F46] hover:underline uppercase tracking-tighter">Forgot Password?</button>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#065F46] transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 pl-12 pr-12 text-sm focus:ring-2 focus:ring-[#065F46] outline-none transition-all"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#065F46] text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#043d2d] transition-all shadow-lg shadow-green-900/10"
            >
              Sign In <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-gray-50 text-center">
            <p className="text-xs text-gray-400 font-medium">
              Don't have an account? <button className="text-[#065F46] font-bold hover:underline">Request Access</button>
            </p>
            <div className="flex justify-center gap-4 mt-8">
              <button className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-[#065F46] transition shadow-sm"><Fingerprint size={20}/></button>
              <button className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-[#065F46] transition shadow-sm"><QrCode size={20}/></button>
            </div>
          </div>

          <div className="mt-12 flex justify-center gap-6">
            <button className="text-[10px] font-bold text-gray-300 hover:text-gray-500 uppercase tracking-widest">Privacy</button>
            <button className="text-[10px] font-bold text-gray-300 hover:text-gray-500 uppercase tracking-widest">Terms</button>
            <button className="text-[10px] font-bold text-gray-300 hover:text-gray-500 uppercase tracking-widest">Support</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;