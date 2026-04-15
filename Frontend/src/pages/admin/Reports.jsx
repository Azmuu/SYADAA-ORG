import React from 'react';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  Plus, 
  Download, 
  Search, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  TrendingUp
} from 'lucide-react';

const Reports = () => {
  return (
    <div className="p-8 bg-[#F9FAFB] min-h-screen font-sans">
      
      {/* Header Section */}
      <header className="flex justify-between items-start mb-8">
        <div>
          <p className="text-[10px] font-bold text-green-700 uppercase tracking-widest mb-1">Institutional Intelligence</p>
          <h1 className="text-3xl font-extrabold text-gray-900">The Reports Archive</h1>
          <p className="text-gray-500 text-sm mt-2 max-w-xl">
            Comprehensive insights and institutional audits generated from SYADA's community interaction data.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
            <Download size={16} />
            Export All
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#065F46] text-white rounded-lg text-sm font-semibold hover:bg-opacity-90 transition shadow-sm">
            <Plus size={18} />
            Generate New Report
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<FileText size={20} className="text-green-600"/>} label="Total Reports" value="1,284" badge="+12%" />
        <StatCard icon={<ClipboardCheck size={20} className="text-orange-500"/>} label="Pending Audits" value="24" />
        <StatCard icon={<CheckCircle size={20} className="text-blue-500"/>} label="Completion Rate" value="98.2%" badge="Target Met" badgeColor="bg-green-50 text-green-600" />
        <StatCard icon={<Clock size={20} className="text-gray-600"/>} label="Avg. Lead Time" value="4.2h" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Report Generation Activity Chart Placeholder */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-gray-800">Report Generation Activity</h3>
            <div className="flex gap-4 text-[10px] uppercase font-bold text-gray-400">
               <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-100"></span> 2023</span>
               <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#065F46]"></span> 2024</span>
            </div>
          </div>
          <div className="h-48 flex items-end justify-between px-2">
            {[ 
              {m: 'JAN', h: 60}, {m: 'FEB', h: 50}, {m: 'MAR', h: 75}, 
              {m: 'APR', h: 90}, {m: 'MAY', h: 65}, {m: 'JUN', h: 95}, {m: 'JUL', h: 80}
            ].map((bar, i) => (
              <div key={i} className="flex flex-col items-center gap-3 w-full">
                <div className="w-10 bg-gray-100 rounded-t-sm relative" style={{height: '100px'}}>
                   <div className="absolute bottom-0 w-full bg-[#065F46] rounded-t-sm" style={{height: `${bar.h}%`}}></div>
                </div>
                <span className="text-[10px] text-gray-400 font-bold">{bar.m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-[#065F46] text-white p-8 rounded-xl relative overflow-hidden flex flex-col justify-between">
           <div>
              <h3 className="text-lg font-bold">Category Distribution</h3>
              <p className="text-xs opacity-70 mt-1">Current year allocation</p>
              
              <div className="mt-8 space-y-6">
                <DistributionRow label="Financial" percent={42} />
                <DistributionRow label="Membership" percent={35} />
                <DistributionRow label="Project Audits" percent={23} />
              </div>
           </div>
           <button className="flex items-center gap-2 text-xs font-semibold mt-8 opacity-90 hover:opacity-100 transition">
             View Full Detailed Metrics <TrendingUp size={14}/>
           </button>
        </div>
      </div>

      {/* Recent Reports Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Recent Reports</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Filter archive..." 
              className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm w-64 focus:ring-1 focus:ring-green-500"
            />
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-gray-50/50">
            <tr className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              <th className="px-6 py-4">Report Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Date Generated</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            <TableRow name="Q3 Community Impact Audit" cat="PROJECT" date="Oct 14, 2024" status="Verified" statusColor="text-green-600 bg-green-50" />
            <TableRow name="Annual Treasury Reconciliation" cat="FINANCIAL" date="Oct 12, 2024" status="Verified" statusColor="text-green-600 bg-green-50" />
            <TableRow name="Member Retention Analysis" cat="MEMBERSHIP" date="Oct 11, 2024" status="Processing" statusColor="text-orange-500 bg-orange-50" />
            <TableRow name="Community Outreach Summary" cat="PROJECT" date="Oct 09, 2024" status="Verified" statusColor="text-green-600 bg-green-50" />
            <TableRow name="Grant Allocation Ledger" cat="FINANCIAL" date="Oct 05, 2024" status="Archived" statusColor="text-gray-500 bg-gray-100" />
          </tbody>
        </table>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-50 flex justify-between items-center bg-gray-50/30">
          <p className="text-xs text-gray-500">Showing 5 of 1,284 reports</p>
          <div className="flex gap-2">
            <button className="p-1 border border-gray-200 rounded hover:bg-white text-gray-400"><ChevronLeft size={18}/></button>
            <button className="p-1 border border-gray-200 rounded hover:bg-white text-gray-400"><ChevronRight size={18}/></button>
          </div>
        </div>
      </div>

    </div>
  );
};

// Sub-components
const StatCard = ({ icon, label, value, badge, badgeColor = "bg-green-100 text-green-700" }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
    {badge && (
      <span className={`absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
        {badge}
      </span>
    )}
    <div className="bg-gray-50 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
      {icon}
    </div>
    <p className="text-xs font-medium text-gray-400">{label}</p>
    <h4 className="text-2xl font-bold text-gray-900 mt-1">{value}</h4>
  </div>
);

const DistributionRow = ({ label, percent }) => (
  <div className="w-full">
    <div className="flex justify-between text-[11px] font-bold mb-2 uppercase tracking-wide">
      <span>{label}</span>
      <span>{percent}%</span>
    </div>
    <div className="w-full bg-white/20 h-1 rounded-full">
      <div className="bg-white h-full rounded-full" style={{width: `${percent}%`}}></div>
    </div>
  </div>
);

const TableRow = ({ name, cat, date, status, statusColor }) => (
  <tr className="hover:bg-gray-50/50 transition">
    <td className="px-6 py-4 flex items-center gap-3">
      <div className="p-2 bg-green-50 text-green-700 rounded-lg"><FileText size={14}/></div>
      <span className="text-sm font-bold text-gray-800">{name}</span>
    </td>
    <td className="px-6 py-4">
      <span className="text-[10px] font-extrabold px-2 py-1 bg-gray-100 text-gray-500 rounded">{cat}</span>
    </td>
    <td className="px-6 py-4 text-xs text-gray-500">{date}</td>
    <td className="px-6 py-4">
      <div className="flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full ${statusColor.split(' ')[0].replace('text', 'bg')}`}></div>
        <span className={`text-[11px] font-bold ${statusColor.split(' ')[0]}`}>{status}</span>
      </div>
    </td>
    <td className="px-6 py-4 text-center">
      <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={16}/></button>
    </td>
  </tr>
);

export default Reports;