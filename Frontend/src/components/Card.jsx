import React from 'react';

// 1. StatCard: Waxaa loo isticmaalaa Dashboard-ka iyo Finance-ga
export const StatCard = ({ icon, label, value, trend, isPositive }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className="rounded-xl bg-brand-soft p-3 text-brand">
        {icon}
      </div>
      {trend && (
        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
          isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
        }`}>
          {trend}
        </span>
      )}
    </div>
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">{label}</p>
    <h3 className="text-2xl font-black text-gray-900 mt-1">{value}</h3>
  </div>
);

// 2. DataCard: Waxaa loo isticmaalaa in lagu dhex rido Tables-ka ama Charts-ka
export const DataCard = ({ title, subtitle, children, footerAction }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
    <div className="p-6 border-b border-gray-50 flex justify-between items-center">
      <div>
        <h3 className="font-bold text-gray-900">{title}</h3>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
      {footerAction && (
        <button className="text-[10px] font-bold uppercase text-brand hover:underline">
          {footerAction}
        </button>
      )}
    </div>
    <div className="p-6 flex-1">
      {children}
    </div>
  </div>
);