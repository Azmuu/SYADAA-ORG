import React from 'react';
import { 
  Download, 
  Wifi, 
  Utensils, 
  Megaphone, 
  GraduationCap, 
  Calendar,
  FileText
} from 'lucide-react';

const Finance = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Finance & Analytics</h1>
          <div className="flex gap-4 mt-2 text-sm text-gray-500">
            <span className="text-green-700 border-b-2 border-green-700 pb-1 cursor-pointer">Overview</span>
            <span className="hover:text-green-700 cursor-pointer">Expenses</span>
            <span className="hover:text-green-700 cursor-pointer">Allocations</span>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-[#1a5336] text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition">
          <Download size={18} />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Chart and Transactions */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Chart Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Quarterly Performance</p>
                <h2 className="text-xl font-bold text-gray-800 mt-1">Budget Allocation vs. Actual Spending</h2>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">$248,500.00</p>
                <p className="text-[10px] text-gray-400">Total Managed Funds</p>
              </div>
            </div>
            {/* Placeholder for Chart */}
            <div className="h-48 w-full bg-gray-50 rounded-lg flex items-end justify-around p-4 gap-2">
              {[60, 80, 40, 95, 70].map((height, i) => (
                <div key={i} className="w-full max-w-[60px] flex flex-col justify-end gap-1">
                  <div className="bg-green-100 w-full rounded-t-sm" style={{ height: '20%' }}></div>
                  <div className="bg-[#1a5336] w-full rounded-sm" style={{ height: `${height}%` }}></div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-800">Recent Transactions</h3>
              <button className="text-xs text-green-700 font-semibold">View All History</button>
            </div>
            
            <div className="space-y-4">
              <TransactionRow icon={<Wifi size={18}/>} title="SomNet Solutions" sub="Infrastructure & Utility" amount="-$1,240.00" date="24 OCT 2024" />
              <TransactionRow icon={<Utensils size={18}/>} title="Heritage Catering" sub="Youth Summit Events" amount="-$890.50" date="22 OCT 2024" />
              <TransactionRow icon={<Megaphone size={18}/>} title="Global Media Agency" sub="Awareness Campaign Marketing" amount="-$3,400.00" date="20 OCT 2024" />
              <TransactionRow icon={<GraduationCap size={18}/>} title="Scholarship Disbursement" sub="Education Initiatives" amount="-$12,000.00" date="18 OCT 2024" color="text-green-700" />
            </div>
          </div>
        </div>

        {/* Right Column: Liquidity, Audits, Utilization */}
        <div className="space-y-6">
          
          {/* Liquidity Card */}
          <div className="bg-[#1a5336] text-white p-6 rounded-xl relative overflow-hidden">
            <p className="text-sm opacity-80 flex items-center gap-2">
              <span className="p-1 bg-white/20 rounded">💰</span> Available Liquidity
            </p>
            <h2 className="text-3xl font-bold mt-2">$42,120</h2>
            <div className="mt-4 inline-flex items-center text-[10px] bg-white/10 px-2 py-1 rounded">
              📈 +12.4% from last month
            </div>
          </div>

          {/* Upcoming Audits */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800">Upcoming Audits</h3>
              <Calendar size={16} className="text-gray-400" />
            </div>
            <div className="space-y-4">
              <AuditRow day="14" title="Youth Empowerment Fund" sub="External Audit Review" bg="bg-yellow-100 text-yellow-700" />
              <AuditRow day="22" title="Operational Expense Prep" sub="Internal Compliance" bg="bg-gray-100 text-gray-700" />
            </div>
          </div>

          {/* Custom Report Card */}
          <div className="bg-gray-100 p-6 rounded-xl text-center flex flex-col items-center">
             <div className="bg-white p-3 rounded-lg shadow-sm mb-4">
                <FileText className="text-green-800" />
             </div>
             <h3 className="font-bold text-gray-800">Generate Custom Report</h3>
             <p className="text-[11px] text-gray-500 mt-2 px-4">Select specific parameters to build a comprehensive financial overview.</p>
             <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button className="bg-white text-[10px] px-3 py-1.5 rounded-full shadow-sm hover:bg-gray-50">Monthly Summary</button>
                <button className="bg-white text-[10px] px-3 py-1.5 rounded-full shadow-sm hover:bg-gray-50">Donor Impact</button>
                <button className="bg-white text-[10px] px-3 py-1.5 rounded-full shadow-sm hover:bg-gray-50">Audit Ready</button>
             </div>
          </div>

          {/* Budget Utilization */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">Budget Utilization</h3>
            <div className="space-y-4">
              <ProgressRow label="Project Operations" percent={82} color="bg-green-800" />
              <ProgressRow label="Marketing & Awareness" percent={45} color="bg-yellow-500" />
              <ProgressRow label="Staffing & Admin" percent={67} color="bg-gray-400" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Helper Components for Cleaner Code
const TransactionRow = ({ icon, title, sub, amount, date, color = "text-gray-900" }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
    <div className="flex items-center gap-4">
      <div className="p-2 bg-gray-100 rounded-lg text-gray-600">{icon}</div>
      <div>
        <h4 className="text-sm font-bold text-gray-800">{title}</h4>
        <p className="text-[10px] text-gray-400">{sub}</p>
      </div>
    </div>
    <div className="text-right">
      <p className={`text-sm font-bold ${color}`}>{amount}</p>
      <p className="text-[10px] text-gray-400 uppercase">{date}</p>
    </div>
  </div>
);

const AuditRow = ({ day, title, sub, bg }) => (
  <div className="flex items-center gap-4">
    <div className={`${bg} h-12 w-12 rounded-lg flex items-center justify-center font-bold text-lg`}>{day}</div>
    <div>
      <h4 className="text-xs font-bold text-gray-800">{title}</h4>
      <p className="text-[10px] text-gray-400">{sub}</p>
    </div>
  </div>
);

const ProgressRow = ({ label, percent, color }) => (
  <div>
    <div className="flex justify-between text-[11px] mb-1">
      <span className="font-medium text-gray-700">{label}</span>
      <span className="text-gray-400">{percent}%</span>
    </div>
    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
      <div className={`${color} h-full`} style={{ width: `${percent}%` }}></div>
    </div>
  </div>
);

export default Finance;