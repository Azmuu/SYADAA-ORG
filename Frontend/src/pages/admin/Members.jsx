import React from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  ArrowUpDown, 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight,
  ClipboardList,
  ShieldCheck,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';

const Members = () => {
  return (
    <div className="p-8 bg-[#F9FAFB] min-h-screen font-sans text-gray-800">
      
      {/* Top Search Bar (Sida sawirka sare ku jirta) */}
      <div className="flex justify-between items-center mb-8">
        <div className="relative w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search the archive..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-green-600 transition"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-bold">Admin User</p>
            <p className="text-[10px] text-gray-500 uppercase">System Lead</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
            <img src="https://ui-avatars.com/api/?name=Admin+User&background=065F46&color=fff" alt="avatar" />
          </div>
        </div>
      </div>

      {/* Title & Add Member Section */}
      <header className="flex justify-between items-end mb-8">
        <div>
          <p className="text-[10px] font-bold text-green-700 uppercase tracking-widest mb-1">System Registry</p>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Member Directory</h1>
          <p className="text-gray-500 text-sm mt-3 max-w-2xl leading-relaxed">
            Oversee and manage the diverse community that forms the backbone of SYADA. 
            Access full profiles, historical contributions, and status updates.
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-[#065F46] text-white rounded-lg text-sm font-bold hover:bg-opacity-90 transition shadow-sm">
          <UserPlus size={18} />
          Add New Member
        </button>
      </header>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative">
           <div className="flex justify-between items-start">
              <div className="bg-green-50 p-3 rounded-lg text-green-700"><Users size={24}/></div>
              <span className="text-[10px] font-bold text-green-600">+12% vs last month</span>
           </div>
           <p className="text-[10px] font-bold text-gray-400 uppercase mt-4 tracking-wider">Total Active Members</p>
           <h2 className="text-3xl font-black text-gray-900">1,284</h2>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative">
           <div className="flex justify-between items-start">
              <div className="bg-orange-50 p-3 rounded-lg text-orange-600"><ClipboardList size={24}/></div>
              <span className="text-[10px] font-bold text-orange-600">Priority Processing</span>
           </div>
           <p className="text-[10px] font-bold text-gray-400 uppercase mt-4 tracking-wider">New Requests</p>
           <h2 className="text-3xl font-black text-gray-900">42</h2>
        </div>

        <div className="bg-[#065F46] p-6 rounded-xl text-white relative overflow-hidden">
           <div className="relative z-10">
              <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Directory Health</p>
              <h2 className="text-3xl font-black mt-1">98.4%</h2>
              <div className="mt-6 flex items-center gap-2 text-[10px] opacity-90">
                <CheckCircle2 size={14}/>
                All records synchronized with core ledger
              </div>
           </div>
           {/* Decorative Wave Design */}
           <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
              <Users size={120} />
           </div>
        </div>
      </div>

      {/* Directory Table Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-10">
        <div className="p-6 flex justify-between items-center border-b border-gray-50">
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold hover:bg-gray-100 transition">
              <Filter size={14}/> Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold hover:bg-gray-100 transition">
              <ArrowUpDown size={14}/> Sort
            </button>
          </div>
          <p className="text-[11px] text-gray-400 font-medium">Showing 1-10 of 1,284 records</p>
        </div>

        <table className="w-full text-left">
          <thead className="bg-gray-50/50">
            <tr className="text-[10px] uppercase font-bold text-gray-400 tracking-widest border-b border-gray-50">
              <th className="px-8 py-4">Member</th>
              <th className="px-8 py-4">Program / Role</th>
              <th className="px-8 py-4">Joined</th>
              <th className="px-8 py-4">Status</th>
              <th className="px-8 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            <MemberRow 
              name="Amari Okafor" email="amari.o@syada.org" program="Youth Mentorship" 
              date="Oct 24, 2022" status="ACTIVE" statusBg="bg-green-100 text-green-700"
              img="https://i.pravatar.cc/150?u=amari"
            />
            <MemberRow 
              name="Layla Hassan" email="l.hassan@archive.syada" program="Heritage Council" 
              date="Jan 12, 2024" status="PENDING" statusBg="bg-orange-100 text-orange-700"
              img="https://i.pravatar.cc/150?u=layla"
            />
            <MemberRow 
              name="Marcus Chen" email="m.chen@community.net" program="Digital Literacy" 
              date="Mar 05, 2023" status="ACTIVE" statusBg="bg-green-100 text-green-700"
              img="https://i.pravatar.cc/150?u=marcus"
            />
            <MemberRow 
              name="Elena Rodriguez" email="elena.r@syada.org" program="Admin Support" 
              date="Nov 19, 2021" status="INACTIVE" statusBg="bg-gray-100 text-gray-500"
              img="https://i.pravatar.cc/150?u=elena"
            />
          </tbody>
        </table>

        {/* Pagination & Footer */}
        <div className="p-6 flex justify-between items-center bg-white border-t border-gray-50">
          <div className="flex gap-2">
            <button className="p-2 border border-gray-100 rounded-lg hover:bg-gray-50"><ChevronLeft size={16}/></button>
            {[1, 2, 3, '...', 128].map((n, i) => (
              <button key={i} className={`w-8 h-8 rounded-lg text-xs font-bold transition ${n === 1 ? 'bg-[#065F46] text-white' : 'hover:bg-gray-100 text-gray-500'}`}>
                {n}
              </button>
            ))}
            <button className="p-2 border border-gray-100 rounded-lg hover:bg-gray-50"><ChevronRight size={16}/></button>
          </div>
          <p className="text-[10px] font-bold text-gray-300 tracking-widest uppercase">Records Management System v2.4.1</p>
        </div>
      </div>

      {/* Bottom Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-md transition group">
           <h3 className="text-xl font-bold text-gray-900 mb-2">Member Growth Insights</h3>
           <p className="text-sm text-gray-500 mb-6 leading-relaxed">
             Analyze the trajectory of community engagement and onboarding efficiency over the last quarter.
           </p>
           <button className="flex items-center gap-2 text-xs font-bold text-green-800 hover:gap-3 transition-all">
             View Analytics Report <TrendingUp size={14}/>
           </button>
        </div>

        <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-md transition">
           <h3 className="text-xl font-bold text-gray-900 mb-2">Audit Compliance</h3>
           <p className="text-sm text-gray-500 mb-6 leading-relaxed">
             All member data is encrypted and handled according to the updated 2024 privacy framework.
           </p>
           <button className="flex items-center gap-2 text-xs font-bold text-green-800 hover:gap-3 transition-all">
             Review Protocol <ShieldCheck size={14}/>
           </button>
        </div>
      </div>

    </div>
  );
};

// Helper Component for Table Rows
const MemberRow = ({ name, email, program, date, status, statusBg, img }) => (
  <tr className="hover:bg-gray-50/50 transition">
    <td className="px-8 py-5">
      <div className="flex items-center gap-3">
        <img src={img} alt={name} className="w-9 h-9 rounded-full object-cover border border-gray-100" />
        <div>
          <h4 className="text-sm font-bold text-gray-900">{name}</h4>
          <p className="text-[10px] text-gray-400">{email}</p>
        </div>
      </div>
    </td>
    <td className="px-8 py-5">
      <div className="flex items-center gap-2 text-[11px] font-bold text-gray-700">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
        {program}
      </div>
    </td>
    <td className="px-8 py-5 text-xs text-gray-500 font-medium">{date}</td>
    <td className="px-8 py-5">
      <span className={`text-[10px] font-black px-2.5 py-1 rounded ${statusBg} tracking-wider`}>
        {status}
      </span>
    </td>
    <td className="px-8 py-5 text-center text-gray-300">
      <button className="hover:text-gray-600 transition"><MoreHorizontal size={20}/></button>
    </td>
  </tr>
);

export default Members;