import React, { useCallback, useEffect, useState } from "react";
import { Users, Search, Loader2, LayoutDashboard, FileSpreadsheet } from "lucide-react";
import { getPortalMembers } from "../../services/portalApi";
import { exportToExcel } from "../../lib/exportExcel";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"];

const PortalDashboard = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchApplied, setSearchApplied] = useState("");
  const [blood, setBlood] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setSearchApplied(searchInput.trim()), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getPortalMembers({
        search: searchApplied || undefined,
        blood: blood || undefined,
      });
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Could not load directory");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [searchApplied, blood]);

  useEffect(() => {
    load();
  }, [load]);

  const statusStyle = (s) => {
    switch (s) {
      case "active":
        return "bg-emerald-50 text-emerald-800";
      case "pending":
        return "bg-amber-50 text-amber-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const exportDirectoryExcel = () => {
    exportToExcel(
      rows.map((m) => ({
        Name: m.name || "",
        Phone: m.phone || "",
        Email: m.email || "",
        Title: m.title || "",
        "Blood type": m.blood_type || "",
        Program: m.program || "",
        Status: m.status || "",
        Address: m.address || "",
      })),
      { fileName: "member-directory", sheetName: "Directory" }
    );
  };

  return (
    <div>
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2 text-brand">
          <LayoutDashboard size={20} />
          <p className="text-[10px] font-bold uppercase tracking-widest">Dashboard</p>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Member directory</h1>
        <p className="mt-2 max-w-2xl text-sm text-gray-500">
          Browse organization members. Finance details are not shown here. Use search and blood type to narrow the list.
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="relative min-w-[200px] flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search name, phone, email, title…"
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
          />
        </div>
        <div className="flex flex-col gap-1 sm:min-w-[160px]">
          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Blood type</label>
          <select
            value={blood}
            onChange={(e) => setBlood(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
          >
            <option value="">All types</option>
            {BLOOD_TYPES.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:ml-auto sm:w-auto sm:self-end">
          <p className="text-xs font-medium text-gray-400">
            {rows.length} member{rows.length !== 1 ? "s" : ""}
          </p>
          <button
            type="button"
            onClick={exportDirectoryExcel}
            disabled={loading || rows.length === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileSpreadsheet size={14} />
            Export Excel
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50/80">
              <tr className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                <th className="px-4 py-3 pl-5">Photo</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Blood</th>
                <th className="px-4 py-3">Program</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 pr-5">Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-gray-500">
                    <Loader2 className="mx-auto mb-2 size-6 animate-spin text-brand" />
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-gray-500">
                    No members match your filters.
                  </td>
                </tr>
              )}
              {!loading &&
                rows.map((m) => (
                  <tr key={m._id} className="hover:bg-gray-50/80">
                    <td className="px-4 py-3 pl-5">
                      <img
                        src={
                          m.picture ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name || "?")}&background=e8f5ef&color=0d7a52`
                        }
                        alt=""
                        className="size-9 rounded-lg border border-gray-100 object-cover"
                      />
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{m.name || "—"}</td>
                    <td className="px-4 py-3 text-gray-700">{m.phone || "—"}</td>
                    <td className="max-w-[140px] truncate px-4 py-3 text-gray-600">{m.email || "—"}</td>
                    <td className="px-4 py-3 text-gray-700">{m.title || "—"}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{m.blood_type || "—"}</td>
                    <td className="max-w-[120px] truncate px-4 py-3 text-gray-600">{m.program || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${statusStyle(m.status)}`}>
                        {m.status || "—"}
                      </span>
                    </td>
                    <td className="max-w-[160px] truncate px-4 py-3 pr-5 text-xs text-gray-500">{m.address || "—"}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-6 flex items-center gap-2 text-xs text-gray-400">
        <Users size={14} className="text-brand" />
        Finance and admin tools are only available to staff accounts.
      </p>

    </div>
  );
};

export default PortalDashboard;
