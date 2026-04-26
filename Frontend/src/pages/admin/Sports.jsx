import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Dumbbell, FileSpreadsheet, Loader2, Pencil, Search, Trash2, UserPlus, X } from "lucide-react";
import { sportMembersApi } from "../../services/sportMembersApi";
import { useTheme } from "../../context/ThemeContext";
import { exportToExcel } from "../../lib/exportExcel";

const Sports = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [detail, setDetail] = useState(null);
  const { isDark } = useTheme();

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await sportMembersApi.getAll();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Could not load sports members");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((m) =>
      [m.name, m.phone, m.email, m.sport, m.team, m.position, m.status]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [query, rows]);

  const onDelete = async (id, name) => {
    if (!window.confirm(`Delete sports member "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await sportMembersApi.remove(id);
      setRows((r) => r.filter((x) => x._id !== id));
      setDetail((d) => (d && d._id === id ? null : d));
    } catch (e) {
      alert(e.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const statusBadge = (status) => {
    if (status === "active") return "bg-emerald-50 text-emerald-700";
    if (status === "injured") return "bg-amber-50 text-amber-700";
    return "bg-gray-100 text-gray-600";
  };

  const payExportLabel = (s) => (s === "paid" ? "Paid" : s === "partial" ? "Partial" : "Not paid");

  const exportSportsExcel = () => {
    exportToExcel(
      filtered.map((m) => ({
        Name: m.name || "",
        Email: m.email || "",
        Phone: m.phone || "",
        Sport: m.sport || "",
        Team: m.team || "",
        Position: m.position || "",
        Status: m.status || "",
        "Fee payment": payExportLabel(m.finance_payment_status),
        "Joined date": m.joined_date
          ? new Date(m.joined_date).toLocaleDateString(undefined, { dateStyle: "medium" })
          : "",
      })),
      { fileName: "sports-members", sheetName: "Sports members" }
    );
  };

  return (
    <div className={`min-h-screen pb-12 ${isDark ? "bg-gray-950 text-gray-100" : "bg-[#F9FAFB] text-gray-800"}`}>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-brand">Sports section</p>
          <h1 className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Sports members</h1>
          <p className={`mt-2 text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Add, edit, delete, and view all sports members in one place.
          </p>
        </div>
        <Link
          to="/admin/sports/new"
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-dark"
        >
          <UserPlus size={18} />
          Add sports member
        </Link>
      </div>

      <div
        className={`mb-6 rounded-2xl border p-4 ${
          isDark ? "border-gray-800 bg-gray-900/70" : "border-gray-100 bg-white"
        }`}
      >
        <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-gray-300" : "text-gray-500"}`}>
          Theme mode
        </p>
        <p className={`mt-1 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Dark mode is now global. Use the sidebar toggle to apply it across the full admin system.
        </p>
      </div>

      <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div className="relative max-w-md flex-1">
          <Search className={`absolute left-3 top-1/2 size-4 -translate-y-1/2 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, sport, team, phone..."
            className={`w-full rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 ${
              isDark
                ? "border border-gray-700 bg-gray-900 text-gray-100 placeholder:text-gray-500"
                : "border border-gray-200 bg-white"
            }`}
          />
        </div>
        <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto">
          <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-400"}`}>
            {filtered.length} of {rows.length} shown
          </p>
          <button
            type="button"
            onClick={exportSportsExcel}
            disabled={loading || filtered.length === 0}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm disabled:cursor-not-allowed disabled:opacity-50 ${
              isDark
                ? "border border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700"
                : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <FileSpreadsheet size={16} />
            Export Excel
          </button>
        </div>
      </div>

      {error && <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className={`hidden overflow-hidden rounded-2xl border shadow-sm md:block ${isDark ? "border-gray-800 bg-gray-900" : "border-gray-100 bg-white"}`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className={`border-b ${isDark ? "border-gray-800 bg-gray-900" : "border-gray-100 bg-gray-50/80"}`}>
              <tr className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-gray-400" : "text-gray-400"}`}>
                <th className="px-4 py-3 pl-6">Name</th>
                <th className="px-4 py-3">Sport</th>
                <th className="px-4 py-3">Team</th>
                <th className="px-4 py-3">Position</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && (
                <tr>
                  <td colSpan={7} className={`px-6 py-16 text-center ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    <Loader2 className="mx-auto mb-2 size-6 animate-spin text-brand" />
                    Loading sports members...
                  </td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className={`px-6 py-16 text-center ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    No sports members yet.{" "}
                    <Link to="/admin/sports/new" className="font-semibold text-brand hover:underline">
                      Add the first member
                    </Link>
                    .
                  </td>
                </tr>
              )}
              {!loading &&
                filtered.map((m) => (
                  <tr key={m._id} className={`cursor-pointer ${isDark ? "hover:bg-gray-800/60" : "hover:bg-gray-50/80"}`} onClick={() => setDetail(m)}>
                    <td className={`px-4 py-3 pl-6 font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{m.name || "—"}</td>
                    <td className="px-4 py-3">{m.sport || "—"}</td>
                    <td className="px-4 py-3">{m.team || "—"}</td>
                    <td className="px-4 py-3">{m.position || "—"}</td>
                    <td className="px-4 py-3">{m.phone || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${statusBadge(m.status)}`}>
                        {m.status || "active"}
                      </span>
                    </td>
                    <td className="px-4 py-3 pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-1">
                        <Link to={`/admin/sports/${m._id}/edit`} className="inline-flex rounded-lg p-2 text-brand hover:bg-brand-soft">
                          <Pencil size={18} />
                        </Link>
                        <button
                          type="button"
                          disabled={deletingId === m._id}
                          onClick={() => onDelete(m._id, m.name)}
                          className="inline-flex rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          {deletingId === m._id ? <Loader2 className="size-[18px] animate-spin" /> : <Trash2 size={18} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 md:hidden">
        {loading && (
          <div className={`rounded-2xl border p-6 text-center ${isDark ? "border-gray-800 bg-gray-900 text-gray-400" : "border-gray-100 bg-white text-gray-500"}`}>
            <Loader2 className="mx-auto mb-2 size-6 animate-spin text-brand" />
            Loading sports members...
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className={`rounded-2xl border p-6 text-center ${isDark ? "border-gray-800 bg-gray-900 text-gray-400" : "border-gray-100 bg-white text-gray-500"}`}>
            No sports members yet.
          </div>
        )}
        {!loading &&
          filtered.map((m) => (
            <div key={m._id} className={`rounded-2xl border p-4 shadow-sm ${isDark ? "border-gray-800 bg-gray-900" : "border-gray-100 bg-white"}`}>
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <p className={`text-base font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{m.name || "—"}</p>
                  <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>{m.sport || "—"}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${statusBadge(m.status)}`}>{m.status || "active"}</span>
              </div>
              <p className="text-sm"><span className={isDark ? "text-gray-400" : "text-gray-500"}>Team:</span> {m.team || "—"}</p>
              <p className="text-sm"><span className={isDark ? "text-gray-400" : "text-gray-500"}>Position:</span> {m.position || "—"}</p>
              <p className="text-sm"><span className={isDark ? "text-gray-400" : "text-gray-500"}>Phone:</span> {m.phone || "—"}</p>
              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDetail(m)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${isDark ? "border-gray-700 bg-gray-800 text-gray-200" : "border-gray-200 bg-white text-gray-700"}`}
                >
                  View
                </button>
                <Link to={`/admin/sports/${m._id}/edit`} className="rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white">
                  Edit
                </Link>
                <button
                  type="button"
                  disabled={deletingId === m._id}
                  onClick={() => onDelete(m._id, m.name)}
                  className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                >
                  {deletingId === m._id ? "..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
      </div>

      {detail && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          <button
            type="button"
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-[1px]"
            onClick={() => setDetail(null)}
            aria-label="Close details"
          />
          <div className={`relative w-full max-w-md rounded-2xl border p-5 shadow-xl ${isDark ? "border-gray-700 bg-gray-900 text-gray-100" : "border-gray-100 bg-white"}`}>
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-brand">Sports member</p>
                <h2 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{detail.name || "—"}</h2>
                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>{detail.sport || "No sport set"}</p>
              </div>
              <button
                type="button"
                className={`rounded-lg p-2 ${isDark ? "text-gray-400 hover:bg-gray-800" : "text-gray-500 hover:bg-gray-100"}`}
                onClick={() => setDetail(null)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <Field label="Team" value={detail.team} />
              <Field label="Position" value={detail.position} />
              <Field label="Phone" value={detail.phone} />
              <Field label="Email" value={detail.email} />
              <Field label="Address" value={detail.address} />
              <Field label="Status" value={detail.status} />
              <Field label="Notes" value={detail.notes} />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Link
                to={`/admin/sports/${detail._id}/edit`}
                onClick={() => setDetail(null)}
                className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
              >
                Edit member
              </Link>
              <button
                type="button"
                onClick={() => setDetail(null)}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={`mt-8 flex items-center gap-2 rounded-xl border px-4 py-3 text-xs ${
          isDark ? "border-gray-800 bg-gray-900 text-gray-400" : "border-gray-100 bg-white text-gray-500"
        }`}
      >
        <Dumbbell size={16} className="text-brand" />
        Tip: click any row to quickly view the full sports member profile.
      </div>
    </div>
  );
};

function Field({ label, value }) {
  const display = value != null && String(value).trim() !== "" ? String(value) : "—";
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</p>
      <p className="font-medium">{display}</p>
    </div>
  );
}

export default Sports;
