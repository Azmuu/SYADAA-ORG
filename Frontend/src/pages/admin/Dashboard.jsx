import React from 'react';
import { 
  Users, 
  Rocket, 
  Wallet, 
  Search, 
  Bell, 
  Settings, 
  UserPlus, 
  RefreshCcw, 
  FileEdit, 
  CheckCircle,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="p-8 bg-[#F9FAFB] min-h-screen font-sans text-gray-800">
      
      {/* Search and Profile Header */}
      <div className="flex justify-between items-center mb-10">
        <div className="relative w-1/2 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search the archive..." 
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-green-600 outline-none transition"
          />
        </div>
        <div className="flex items-center gap-6">
          <button className="text-gray-400 hover:text-gray-600 relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <Settings size={20} />
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="text-right">
              <p className="text-sm font-bold leading-none">Admin User</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Chief Archivist</p>
            </div>
            <img 
              src="https://ui-avatars.com/api/?name=Admin+User&background=065F46&color=fff" 
              className="w-9 h-9 rounded-full border border-gray-200" 
              alt="Profile"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Content (3 Columns) */}
        <div className="lg:col-span-3 space-y-8">
          
          <div>
            <h1 className="text-3xl font-black text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Welcome back. Here is the latest state of the SYADA ecosystem.</p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
              icon={<Users size={20} className="text-green-600"/>} 
              label="Total Members" 
              value="2,482" 
              trend="+12.5%" 
              trendUp={true}
            />
            <StatCard 
              icon={<Rocket size={20} className="text-green-700"/>} 
              label="Active Projects" 
              value="34" 
              trend="Stable" 
              trendUp={null}
            />
            <StatCard 
              icon={<Wallet size={20} className="text-green-800"/>} 
              label="Available Funds" 
              value="$142,800" 
              trend="+4.2%" 
              trendUp={true}
            />
          </div>

          {/* Membership Growth Chart Area */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="font-bold text-gray-900">Membership Growth</h3>
                <p className="text-xs text-gray-400 mt-1">Visual tracking of new archive enrollments</p>
              </div>
              <div className="flex bg-gray-50 p-1 rounded-lg">
                <button className="px-4 py-1.5 text-[10px] font-bold text-gray-400">6 MONTHS</button>
                <button className="px-4 py-1.5 text-[10px] font-bold bg-[#065F46] text-white rounded-md shadow-sm">1 YEAR</button>
              </div>
            </div>
            
            {/* Chart Bars */}
            <div className="h-64 flex items-end justify-between gap-4 px-2">
              {[
                { m: 'JAN', h: '35%', opacity: 'bg-green-50' },
                { m: 'FEB', h: '45%', opacity: 'bg-green-100' },
                { m: 'MAR', h: '40%', opacity: 'bg-green-200' },
                { m: 'APR', h: '55%', opacity: 'bg-green-300' },
                { m: 'MAY', h: '65%', opacity: 'bg-green-400' },
                { m: 'JUN', h: '60%', opacity: 'bg-green-500' },
                { m: 'JUL', h: '85%', opacity: 'bg-green-800' },
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-4">
                  <div className={`w-full rounded-t-lg transition-all duration-500 ${bar.opacity}`} style={{ height: bar.h }}></div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{bar.m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Two Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#065F46] p-8 rounded-2xl text-white relative overflow-hidden group">
               <h3 className="text-2xl font-bold mb-3">Expand the Network</h3>
               <p className="text-sm opacity-80 mb-8 max-w-[200px] leading-relaxed">
                 Strategic growth phase 2 is now active. Review proposals for the 2024 expansion.
               </p>
               <button className="bg-white text-[#065F46] px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-100 transition shadow-lg">
                 Open Proposals
               </button>
               <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:scale-110 transition-transform">
                  <Users size={160} />
               </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm relative">
               <div className="flex justify-between items-start mb-6">
                  <span className="bg-green-50 text-green-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">Security</span>
                  <span className="text-[10px] text-gray-400 font-bold">12H AGO</span>
               </div>
               <h3 className="text-xl font-bold text-gray-900 mb-2">System Integrity Report</h3>
               <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                 All database nodes are operational and encrypted. No anomalies detected.
               </p>
               <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <img src="https://i.pravatar.cc/150?u=1" className="w-8 h-8 rounded-full border-2 border-white shadow-sm" alt="t1" />
                    <img src="https://i.pravatar.cc/150?u=2" className="w-8 h-8 rounded-full border-2 border-white shadow-sm" alt="t2" />
                  </div>
                  <span className="text-xs text-gray-400 font-medium ml-2">2 technicians online</span>
               </div>
            </div>
          </div>

        </div>

        {/* Right Sidebar (1 Column) */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-gray-900">Recent Activity</h3>
              <button className="text-[10px] font-bold text-green-700 uppercase tracking-tighter">View All</button>
            </div>
            
            <div className="space-y-8">
              <ActivityRow icon={<UserPlus size={16}/>} color="bg-green-50 text-green-600" title="New Member Approved" sub="Sarah Jenkins has joined the Regional Directory." time="2 MINUTES AGO" />
              <ActivityRow icon={<RefreshCcw size={16}/>} color="bg-yellow-50 text-yellow-600" title="Budget Reallocated" sub="$4,200 moved to 'Community Outreach' project." time="1 HOUR AGO" />
              <ActivityRow icon={<FileEdit size={16}/>} color="bg-blue-50 text-blue-600" title="Charter Updated" sub="Section 4.2 of the archive guidelines was modified." time="5 HOURS AGO" />
              <ActivityRow icon={<CheckCircle size={16}/>} color="bg-green-50 text-green-600" title="Project Completed" sub="'Archive Digitalization' hit 100% completion." time="YESTERDAY" />
            </div>

            {/* Verification Box */}
            <div className="mt-12 bg-gray-50 border border-gray-100 rounded-xl p-6 text-center">
               <div className="bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="text-gray-500" size={20}/>
               </div>
               <h4 className="text-sm font-bold text-gray-900">Pending Verifications</h4>
               <p className="text-[11px] text-gray-500 mt-2 mb-6">There are 12 new members waiting for archival approval.</p>
               <button className="w-full bg-white border border-gray-200 py-2.5 rounded-lg text-xs font-bold hover:bg-gray-50 transition shadow-sm">
                 Start Approval Flow
               </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({ icon, label, value, trend, trendUp }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
      <div className={`flex items-center text-[10px] font-bold ${trendUp === true ? 'text-green-600' : trendUp === false ? 'text-red-500' : 'text-gray-400'}`}>
        {trend} {trendUp !== null && <span className="ml-1">📈</span>}
      </div>
    </div>
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
    <h4 className="text-2xl font-black text-gray-900 mt-1">{value}</h4>
  </div>
);

const ActivityRow = ({ icon, color, title, sub, time }) => (
  <div className="flex gap-4">
    <div className={`${color} w-9 h-9 shrink-0 rounded-lg flex items-center justify-center`}>
      {icon}
    </div>
    <div className="space-y-1">
      <h4 className="text-xs font-bold text-gray-900">{title}</h4>
      <p className="text-[11px] text-gray-500 leading-snug">{sub}</p>
      <p className="text-[9px] font-bold text-gray-300 uppercase tracking-tighter">{time}</p>
    </div>
  </div>
);

export default Dashboard;