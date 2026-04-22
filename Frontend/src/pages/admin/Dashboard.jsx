import React, { useEffect, useState } from "react";
import {
  Users,
  Wallet,
  Search,
  Bell,
  Settings,
  UserPlus,
  RefreshCcw,
  FileEdit,
  CheckCircle,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { dashboardApi } from "../../services/dashboardApi";

const fmtMoney = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
    Number(n) || 0
  );

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) setUser(JSON.parse(raw));
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await dashboardApi.getSummary();
        if (!cancelled) setSummary(data);
      } catch (e) {
        if (!cancelled) setError(e.message || "Could not load dashboard");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const displayName = user?.full_name || user?.email || "Admin";

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-8 font-sans text-gray-800">
      <div className="mb-10 flex items-center justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search the archive…"
            className="w-full rounded-lg border border-gray-100 bg-white py-2 pl-10 pr-4 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-brand"
          />
        </div>
        <div className="flex items-center gap-6">
          <button type="button" className="relative text-gray-400 hover:text-gray-600">
            <Bell size={20} />
            <span className="absolute -right-1 -top-1 size-2 rounded-full border-2 border-white bg-green-500" />
          </button>
          <button type="button" className="text-gray-400 hover:text-gray-600">
            <Settings size={20} />
          </button>
          <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
            <div className="text-right">
              <p className="text-sm font-bold leading-none">{displayName}</p>
              <p className="mt-1 text-[10px] font-bold uppercase text-gray-400">{user?.role || "admin"}</p>
            </div>
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0d7a52&color=fff`}
              className="size-9 rounded-full border border-gray-200"
              alt=""
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="space-y-8 lg:col-span-3">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">Live counts from your MongoDB-backed API.</p>
          </div>

          {error && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <StatCard
              icon={<Users size={20} className="text-green-600" />}
              label="Total members"
              value={loading ? "…" : String(summary?.memberCount ?? 0)}
              trend={summary?.pendingMembers ? `${summary.pendingMembers} pending` : "—"}
              trendUp={null}
            />
            <StatCard
              icon={<FileEdit size={20} className="text-orange-600" />}
              label="Reports on file"
              value={loading ? "…" : String(summary?.reportCount ?? 0)}
              trend="From /api/reports"
              trendUp={null}
            />
            <StatCard
              icon={<Wallet size={20} className="text-green-800" />}
              label="Net balance (finance)"
              value={loading ? "…" : fmtMoney(summary?.balance ?? 0)}
              trend={loading ? "" : `In ${fmtMoney(summary?.income || 0)} · Out ${fmtMoney(summary?.expense || 0)}`}
              trendUp={summary?.balance >= 0 ? true : false}
            />
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-gray-900">Quick actions</h3>
                <p className="mt-1 text-xs text-gray-400">All data requires a valid login session (JWT).</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/admin/members/new"
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-dark"
              >
                <UserPlus size={18} />
                Register member
              </Link>
              <Link
                to="/admin/members"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50"
              >
                <Users size={18} />
                Member directory
              </Link>
              <Link
                to="/admin/finance"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50"
              >
                <Wallet size={18} />
                Finance
              </Link>
              <Link
                to="/admin/reports"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50"
              >
                <FileEdit size={18} />
                Reports
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="group relative overflow-hidden rounded-2xl bg-brand p-8 text-white">
              <h3 className="mb-3 text-2xl font-bold">Expand the network</h3>
              <p className="mb-8 max-w-[220px] text-sm leading-relaxed opacity-80">
                Add members with full profiles, optional finance fields, and photos.
              </p>
              <Link
                to="/admin/members/new"
                className="inline-block rounded-lg bg-white px-6 py-2.5 text-sm font-bold text-brand shadow-lg hover:bg-gray-100"
              >
                New member
              </Link>
              <Users className="absolute -bottom-5 -right-5 size-40 opacity-10 transition-transform group-hover:scale-110" />
            </div>

            <div className="relative rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
              <div className="mb-6 flex items-start justify-between">
                <span className="rounded-full bg-green-50 px-3 py-1 text-[10px] font-bold uppercase tracking-tighter text-green-700">
                  API
                </span>
                <span className="text-[10px] font-bold text-gray-400">LIVE</span>
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">Backend connected</h3>
              <p className="mb-6 text-sm leading-relaxed text-gray-500">
                Dashboard summary is loaded from <code className="rounded bg-gray-100 px-1">GET /api/dashboard/summary</code>.
              </p>
              {loading && (
                <p className="flex items-center gap-2 text-xs text-gray-400">
                  <Loader2 className="size-4 animate-spin" /> Refreshing…
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-8 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">At a glance</h3>
            </div>
            <div className="space-y-6">
              <ActivityRow
                icon={<UserPlus size={16} />}
                color="bg-green-50 text-green-600"
                title="Members"
                sub={`${summary?.memberCount ?? "—"} total · ${summary?.pendingMembers ?? "—"} pending review`}
                time="LIVE DATA"
              />
              <ActivityRow
                icon={<RefreshCcw size={16} />}
                color="bg-yellow-50 text-yellow-600"
                title="Finance"
                sub={loading ? "Loading…" : `Balance ${fmtMoney(summary?.balance ?? 0)}`}
                time="LIVE DATA"
              />
              <ActivityRow
                icon={<CheckCircle size={16} />}
                color="bg-blue-50 text-blue-600"
                title="Reports"
                sub={`${summary?.reportCount ?? "—"} documents in archive`}
                time="LIVE DATA"
              />
            </div>

            <div className="mt-10 rounded-xl border border-gray-100 bg-gray-50 p-6 text-center">
              <div className="mx-auto mb-4 flex size-10 items-center justify-center rounded-full bg-gray-200">
                <ShieldCheck className="text-gray-500" size={20} />
              </div>
              <h4 className="text-sm font-bold text-gray-900">Pending members</h4>
              <p className="mb-6 mt-2 text-[11px] text-gray-500">
                {summary?.pendingMembers ?? 0} member(s) with status &quot;pending&quot; in the directory.
              </p>
              <Link
                to="/admin/members"
                className="block w-full rounded-lg border border-gray-200 bg-white py-2.5 text-xs font-bold shadow-sm hover:bg-gray-50"
              >
                Open directory
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, trend, trendUp }) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
    <div className="mb-4 flex items-start justify-between">
      <div className="rounded-lg bg-gray-50 p-2">{icon}</div>
      <div
        className={`flex items-center text-[10px] font-bold ${
          trendUp === true ? "text-green-600" : trendUp === false ? "text-red-500" : "text-gray-400"
        }`}
      >
        {trend}
      </div>
    </div>
    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
    <h4 className="mt-1 text-2xl font-black text-gray-900">{value}</h4>
  </div>
);

const ActivityRow = ({ icon, color, title, sub, time }) => (
  <div className="flex gap-4">
    <div className={`${color} flex size-9 shrink-0 items-center justify-center rounded-lg`}>{icon}</div>
    <div className="space-y-1">
      <h4 className="text-xs font-bold text-gray-900">{title}</h4>
      <p className="text-[11px] leading-snug text-gray-500">{sub}</p>
      <p className="text-[9px] font-bold uppercase tracking-tighter text-gray-300">{time}</p>
    </div>
  </div>
);

export default Dashboard;
