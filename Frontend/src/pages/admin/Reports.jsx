import React, { useCallback, useEffect, useState } from "react";
import {
  FileText,
  Plus,
  Download,
  Search,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Activity,
} from "lucide-react";
import { reportsApi } from "../../services/reportsApi";

const statusUi = {
  verified: { label: "Verified", className: "text-green-600 bg-green-50" },
  processing: { label: "Processing", className: "text-orange-600 bg-orange-50" },
  archived: { label: "Archived", className: "text-gray-600 bg-gray-100" },
};

const Reports = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    report_name: "",
    category: "PROJECT",
    status: "processing",
    summary: "",
  });
  const [activity, setActivity] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityErr, setActivityErr] = useState("");
  const [composeLoading, setComposeLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await reportsApi.getAll();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Failed to load reports");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const loadActivity = useCallback(async () => {
    setActivityLoading(true);
    setActivityErr("");
    try {
      const data = await reportsApi.getActivityFeed();
      setActivity(Array.isArray(data) ? data : []);
    } catch (e) {
      setActivityErr(e.message || "Failed to load activity");
      setActivity([]);
    } finally {
      setActivityLoading(false);
    }
  }, []);

  useEffect(() => {
    loadActivity();
  }, [loadActivity]);

  const filtered = rows.filter((r) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return `${r.report_name || ""} ${r.category || ""} ${r.summary || ""}`.toLowerCase().includes(q);
  });

  const pending = rows.filter((r) => r.status === "processing").length;

  const onDelete = async (id, name) => {
    if (!window.confirm(`Delete report "${name}"?`)) return;
    try {
      await reportsApi.remove(id);
      setRows((x) => x.filter((r) => r._id !== id));
    } catch (e) {
      alert(e.message || "Delete failed");
    }
  };

  const onCreate = async (e) => {
    e.preventDefault();
    if (!form.report_name.trim()) return;
    setCreating(true);
    try {
      const doc = await reportsApi.create({
        report_name: form.report_name.trim(),
        category: form.category,
        status: form.status,
        summary: form.summary.trim(),
      });
      setRows((x) => [doc, ...x]);
      setModal(false);
      setForm({ report_name: "", category: "PROJECT", status: "processing", summary: "" });
      loadActivity();
    } catch (err) {
      alert(err.message || "Create failed");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-8 font-sans">
      <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-brand">Institutional intelligence</p>
          <h1 className="text-3xl font-extrabold text-gray-900">Reports archive</h1>
          <p className="mt-2 max-w-xl text-sm text-gray-500">
            Reports and the activity feed use live data from MongoDB (members, finance ledger, and filed reports). Use{" "}
            <strong className="font-semibold text-gray-700">New report</strong> to save a snapshot; paste an auto-built
            summary from current totals when you open the form.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <Download size={16} />
            Export all
          </button>
          <button
            type="button"
            onClick={() => setModal(true)}
            className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95"
          >
            <Plus size={18} />
            New report
          </button>
        </div>
      </header>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      )}

      <div className="mb-6 overflow-hidden rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Activity className="size-5 text-brand" />
            <h3 className="font-bold text-gray-800">Live activity</h3>
          </div>
          <button
            type="button"
            onClick={() => loadActivity()}
            className="text-xs font-bold text-brand hover:underline"
          >
            Refresh
          </button>
        </div>
        {activityErr && <p className="mb-3 text-sm text-red-600">{activityErr}</p>}
        {activityLoading && (
          <div className="flex items-center gap-2 py-6 text-sm text-gray-500">
            <Loader2 className="size-5 animate-spin" /> Loading…
          </div>
        )}
        {!activityLoading && activity.length === 0 && (
          <p className="py-4 text-sm text-gray-500">No finance or report events yet. Add transactions under Financials.</p>
        )}
        {!activityLoading && activity.length > 0 && (
          <ul className="max-h-64 divide-y divide-gray-50 overflow-y-auto text-sm">
            {activity.map((a) => (
              <li key={`${a.kind}-${a.id}`} className="flex gap-3 py-3 first:pt-0">
                <span
                  className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-extrabold uppercase ${
                    a.kind === "financial" ? "bg-emerald-50 text-emerald-800" : "bg-blue-50 text-blue-800"
                  }`}
                >
                  {a.kind === "financial" ? "Finance" : "Report"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900">{a.title}</p>
                  <p className="text-xs text-gray-500">{a.subtitle}</p>
                  <p className="mt-0.5 text-[10px] text-gray-400">{new Date(a.at).toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<FileText size={20} className="text-green-600" />} label="Total reports" value={String(rows.length)} />
        <StatCard
          icon={<FileText size={20} className="text-orange-500" />}
          label="Pending"
          value={String(pending)}
        />
        <StatCard icon={<FileText size={20} className="text-blue-500" />} label="Verified" value={String(rows.filter((r) => r.status === "verified").length)} />
        <StatCard icon={<FileText size={20} className="text-gray-600" />} label="Archived" value={String(rows.filter((r) => r.status === "archived").length)} />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-50 p-6 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-bold text-gray-800">Recent reports</h3>
          <div className="relative max-w-xs flex-1 sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Filter…"
              className="w-full rounded-lg border-none bg-gray-50 py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-brand"
            />
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 py-16 text-gray-500">
            <Loader2 className="size-6 animate-spin" /> Loading…
          </div>
        )}

        {!loading && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-gray-50/50">
                <tr className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  <th className="px-6 py-4">Report</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 max-w-[200px]">Summary</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                      No reports match. Create one or clear the filter.
                    </td>
                  </tr>
                )}
                {filtered.map((r) => {
                  const st = statusUi[r.status] || statusUi.processing;
                  return (
                    <tr key={r._id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-green-50 p-2 text-green-700">
                            <FileText size={14} />
                          </div>
                          <span className="text-sm font-bold text-gray-800">{r.report_name || "Untitled"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded bg-gray-100 px-2 py-1 text-[10px] font-extrabold text-gray-500">
                          {r.category || "—"}
                        </span>
                      </td>
                      <td className="max-w-[220px] px-6 py-4 text-xs text-gray-600">
                        <span className="line-clamp-2 block whitespace-pre-wrap break-words">
                          {(r.summary || "").trim() || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {r.createdAt ? new Date(r.createdAt).toLocaleString() : "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${st.className}`}>{st.label}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => onDelete(r._id, r.report_name)}
                          className="inline-flex rounded-lg p-2 text-red-600 hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-gray-50 bg-gray-50/30 p-4">
          <p className="text-xs text-gray-500">
            Showing {filtered.length} of {rows.length} reports
          </p>
          <div className="flex gap-2 text-gray-400">
            <ChevronLeft size={18} />
            <ChevronRight size={18} />
          </div>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900">New report</h3>
            <form onSubmit={onCreate} className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-500">Report name</label>
                <input
                  required
                  value={form.report_name}
                  onChange={(e) => setForm((f) => ({ ...f, report_name: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand"
                  placeholder="e.g. Monthly membership summary"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-500">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand"
                >
                  <option value="PROJECT">PROJECT</option>
                  <option value="FINANCIAL">FINANCIAL</option>
                  <option value="MEMBERSHIP">MEMBERSHIP</option>
                  <option value="RESOURCES">RESOURCES</option>
                </select>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between gap-2">
                  <label className="block text-xs font-semibold text-gray-500">Summary (from live data)</label>
                  <button
                    type="button"
                    disabled={composeLoading}
                    onClick={async () => {
                      setComposeLoading(true);
                      try {
                        const res = await reportsApi.getComposePreview();
                        setForm((f) => ({ ...f, summary: res?.text || "" }));
                      } catch (err) {
                        alert(err.message || "Could not load live summary");
                      } finally {
                        setComposeLoading(false);
                      }
                    }}
                    className="text-xs font-bold text-brand hover:underline disabled:opacity-50"
                  >
                    {composeLoading ? "Loading…" : "Insert live summary"}
                  </button>
                </div>
                <textarea
                  value={form.summary}
                  onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
                  rows={8}
                  className="w-full resize-y rounded-xl border border-gray-200 px-3 py-2 font-mono text-xs outline-none focus:ring-2 focus:ring-brand"
                  placeholder="Optional. Use “Insert live summary” to pull member counts, finance totals, and recent transactions."
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-500">Initial status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand"
                >
                  <option value="processing">Processing</option>
                  <option value="verified">Verified</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModal(false)}
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
                >
                  {creating ? "Saving…" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="relative overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
    <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-gray-50">{icon}</div>
    <p className="text-xs font-medium text-gray-400">{label}</p>
    <h4 className="mt-1 text-2xl font-bold text-gray-900">{value}</h4>
  </div>
);

export default Reports;
