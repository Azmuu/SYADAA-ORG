import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Users,
  UserPlus,
  Search,
  Pencil,
  Trash2,
  Loader2,
  Wallet,
  RefreshCw,
  X,
  ZoomIn,
  ZoomOut,
  Mail,
  FileSpreadsheet,
} from "lucide-react";
import { membersApi } from "../../services/membersApi";
import { exportToExcel } from "../../lib/exportExcel";

/** Smallest value = most zoomed out (includes an extra step vs typical 3-stop controls). */
const PHOTO_ZOOM_SCALES = [1, 0.88, 0.76, 0.64, 0.52];

/** @param {{ list?: "all" | "finance" }} props */
const Members = ({ list = "all" }) => {
  const financeOnly = list === "finance";
  const location = useLocation();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [detailMember, setDetailMember] = useState(null);
  const [photoZoomIdx, setPhotoZoomIdx] = useState(0);
  const [portalNotice, setPortalNotice] = useState(null);
  const [portalCredLoading, setPortalCredLoading] = useState(false);
  const [portalCredError, setPortalCredError] = useState("");
  const [portalCredResult, setPortalCredResult] = useState(null);
  const [payUpdatingId, setPayUpdatingId] = useState(null);

  useEffect(() => {
    if (detailMember) setPhotoZoomIdx(0);
  }, [detailMember]);

  useEffect(() => {
    setPortalCredResult(null);
    setPortalCredError("");
    setPortalCredLoading(false);
  }, [detailMember?._id]);

  useEffect(() => {
    if (!detailMember) return;
    const onKey = (e) => {
      if (e.key === "Escape") setDetailMember(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [detailMember]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await membersApi.getAll();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Could not load members");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const p = location.state?.portalNotice;
    if (p != null) {
      setPortalNotice(p);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, location.state, navigate]);

  const financeMembers = useMemo(() => rows.filter((m) => m.is_finance_member), [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = financeOnly ? financeMembers : rows;
    if (!q) return pool;
    return pool.filter((m) => {
      const base = [m.name, m.email, m.phone, m.title, m.address, m.program];
      if (financeOnly) {
        base.push(m.finance_section, m.finance_payment_status);
      }
      return base.filter(Boolean).join(" ").toLowerCase().includes(q);
    });
  }, [rows, financeMembers, query, financeOnly]);

  const updatePaymentStatus = async (e, id, status) => {
    e.stopPropagation();
    e.preventDefault();
    setPayUpdatingId(id);
    try {
      const updated = await membersApi.update(id, { finance_payment_status: status });
      setRows((r) => r.map((x) => (x._id === id ? { ...x, ...updated } : x)));
      setDetailMember((d) => (d && d._id === id ? { ...d, ...updated } : d));
    } catch (err) {
      alert(err.message || "Could not update payment");
    } finally {
      setPayUpdatingId(null);
    }
  };

  const onDelete = async (id, name) => {
    if (!window.confirm(`Delete member "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await membersApi.remove(id);
      setRows((r) => r.filter((x) => x._id !== id));
      setDetailMember((d) => (d && d._id === id ? null : d));
    } catch (e) {
      alert(e.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const payStatusLabel = (s) => {
    if (s === "paid") return "Paid";
    if (s === "partial") return "Partial";
    return "Not paid";
  };

  const payStatusClass = (s) => {
    if (s === "paid") return "bg-emerald-100 text-emerald-800";
    if (s === "partial") return "bg-amber-100 text-amber-800";
    return "bg-gray-100 text-gray-600";
  };

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

  const formatDate = (v) => {
    if (v == null || v === "") return "—";
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString(undefined, { dateStyle: "medium" });
  };

  const formatDateTime = (v) => {
    if (v == null || v === "") return "—";
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  };

  const exportListExcel = () => {
    if (financeOnly) {
      exportToExcel(
        filtered.map((m) => ({
          Name: m.name || "",
          Phone: m.phone || "",
          Email: m.email || "",
          Address: m.address || "",
          "Fin. section": m.finance_section === "sports" ? "Sports" : "Members",
          "Payment status": payStatusLabel(m.finance_payment_status),
        })),
        { fileName: "finance-members", sheetName: "Finance members" }
      );
    } else {
      exportToExcel(
        filtered.map((m) => ({
          Name: m.name || "",
          Phone: m.phone || "",
          Email: m.email || "",
          Address: m.address || "",
          Title: m.title || "",
          "Blood type": m.blood_type || "",
          "Finance member": m.is_finance_member ? "Yes" : "No",
          Status: m.status || "",
        })),
        { fileName: "all-members", sheetName: "Members" }
      );
    }
  };

  const sendPortalCredentials = async () => {
    if (!detailMember?._id) return;
    setPortalCredLoading(true);
    setPortalCredError("");
    try {
      const data = await membersApi.resetPortalCredentials(detailMember._id);
      setPortalCredResult(data);
      if (import.meta.env.DEV && (data.temporaryPassword || data.etherealPreviewUrl)) {
        console.info(
          "[SYADA portal] Password reset (browser console)",
          "\n  Email:",
          detailMember.email,
          data.temporaryPassword ? `\n  Password: ${data.temporaryPassword}` : "",
          `\n  Login: ${data.loginUrl || ""}`,
          data.etherealPreviewUrl ? `\n  Ethereal: ${data.etherealPreviewUrl}` : ""
        );
      }
    } catch (e) {
      setPortalCredError(e.message || "Could not reset credentials");
      setPortalCredResult(null);
    } finally {
      setPortalCredLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-12 font-sans text-gray-800">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          {financeOnly ? (
            <>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-brand">Finance members</p>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Members with finance</h1>
              <p className="mt-2 max-w-xl text-sm text-gray-500">
                Only members who have finance enabled. Set each row to <strong className="font-medium text-gray-700">Paid</strong>,{" "}
                <strong className="font-medium text-gray-700">Partial</strong>, or <strong className="font-medium text-gray-700">Not paid</strong>.
                Paid members are added to revenue automatically.
              </p>
            </>
          ) : (
            <>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-brand">Member directory</p>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">All members</h1>
              <p className="mt-2 max-w-xl text-sm text-gray-500">
                Every registered member. Use <Link to="/admin/members/finance" className="font-semibold text-brand hover:underline">Finance members</Link> for
                payment status and quick actions.
              </p>
            </>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => load()}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          {financeOnly && (
            <Link
              to="/admin/finance/all"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
            >
              <Wallet size={16} />
              Revenue & expenses
            </Link>
          )}
          <Link
            to="/admin/members/new"
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-dark"
          >
            <UserPlus size={18} />
            Register member
          </Link>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={financeOnly ? "Search (name, phone, email)…" : "Search (name, phone, email, title…)…"}
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
          />
        </div>
        <button
          type="button"
          onClick={exportListExcel}
          disabled={loading || filtered.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FileSpreadsheet size={16} />
          Export Excel
        </button>
      </div>

      {portalNotice && (
        <div
          className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
            portalNotice.emailSent
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-amber-200 bg-amber-50 text-amber-900"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {portalNotice.emailSent ? (
                <>
                  <p className="font-medium">Member saved. Login message was sent (check Ethereal preview if you use test mail).</p>
                  {portalNotice.etherealPreviewUrl && (
                    <p className="mt-2 text-xs">
                      <a
                        href={portalNotice.etherealPreviewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-emerald-950 underline"
                      >
                        Open free test email (Ethereal)
                      </a>
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p className="font-semibold">Member saved, but the email was not sent.</p>
                  {portalNotice.mailError && (
                    <p className="mt-1 text-xs opacity-90">{portalNotice.mailError}</p>
                  )}
                  <p className="mt-2 text-xs">Share this one-time password with the member securely:</p>
                  {portalNotice.temporaryPassword && (
                    <code className="mt-1 inline-block break-all rounded bg-white/70 px-2 py-1 font-mono text-xs">
                      {portalNotice.temporaryPassword}
                    </code>
                  )}
                  {portalNotice.loginUrl && (
                    <p className="mt-2 text-xs">
                      Sign-in page:{" "}
                      <a href={portalNotice.loginUrl} className="font-semibold underline">
                        {portalNotice.loginUrl}
                      </a>
                    </p>
                  )}
                  {portalNotice.etherealPreviewUrl && (
                    <p className="mt-2 text-xs">
                      <a
                        href={portalNotice.etherealPreviewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold underline"
                      >
                        Open Ethereal preview (see the “email”)
                      </a>
                    </p>
                  )}
                </>
              )}
            </div>
            <button
              type="button"
              onClick={() => setPortalNotice(null)}
              className="shrink-0 rounded-lg p-1 text-current opacity-70 hover:opacity-100"
              aria-label="Dismiss"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
          <p className="mt-1 text-xs text-red-700">
            Ensure the API is running and set <code className="rounded bg-red-100 px-1">VITE_API_URL</code> if needed
            (default <code className="rounded bg-red-100 px-1">http://localhost:5001/api</code>).
          </p>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          {financeOnly ? (
            <table className="w-full min-w-[880px] text-left text-sm">
              <thead className="border-b border-gray-100 bg-gray-50/80">
                <tr className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  <th className="px-4 py-3 pl-6">Photo</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Fin. section</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3 min-w-[200px]">Set payment</th>
                  <th className="px-4 py-3 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading && (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center text-gray-500">
                      <Loader2 className="mx-auto mb-2 size-6 animate-spin text-brand" />
                      Loading…
                    </td>
                  </tr>
                )}
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center text-gray-500">
                      No members with finance yet. Enable <strong className="font-medium text-gray-700">Finance member</strong> when
                      registering or editing, or{" "}
                      <Link to="/admin/members/new" className="font-semibold text-brand hover:underline">
                        register a member
                      </Link>
                      .
                    </td>
                  </tr>
                )}
                {!loading &&
                  filtered.map((m) => (
                    <tr
                      key={m._id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setDetailMember(m)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setDetailMember(m);
                        }
                      }}
                      className="cursor-pointer hover:bg-gray-50/80"
                    >
                      <td className="px-4 py-3 pl-6">
                        <img
                          src={
                            m.picture ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name || "?")}&background=e8f5ef&color=0d7a52`
                          }
                          alt=""
                          className="size-10 rounded-xl border border-gray-100 object-cover"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-900">{m.name || "—"}</p>
                        <p className="text-xs text-gray-400 line-clamp-1">{m.address || m.program || ""}</p>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-700">{m.phone || "—"}</td>
                      <td className="max-w-[140px] truncate px-4 py-3 text-gray-500">{m.email || "—"}</td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {m.finance_section === "sports" ? "Sports" : "Members"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${payStatusClass(
                            m.finance_payment_status
                          )}`}
                        >
                          {payStatusLabel(m.finance_payment_status)}
                        </span>
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-wrap gap-1">
                          <button
                            type="button"
                            disabled={payUpdatingId === m._id}
                            onClick={(e) => updatePaymentStatus(e, m._id, "paid")}
                            className="rounded-lg bg-emerald-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                          >
                            Paid
                          </button>
                          <button
                            type="button"
                            disabled={payUpdatingId === m._id}
                            onClick={(e) => updatePaymentStatus(e, m._id, "partial")}
                            className="rounded-lg border border-amber-300 bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-900 hover:bg-amber-100 disabled:opacity-50"
                          >
                            Partial
                          </button>
                          <button
                            type="button"
                            disabled={payUpdatingId === m._id}
                            onClick={(e) => updatePaymentStatus(e, m._id, "unpaid")}
                            className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-[10px] font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                          >
                            Not paid
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-1">
                          <Link
                            to={`/admin/members/${m._id}/edit`}
                            className="inline-flex rounded-lg p-2 text-brand hover:bg-brand-soft"
                            title="Edit"
                          >
                            <Pencil size={18} />
                          </Link>
                          <button
                            type="button"
                            title="Delete"
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
          ) : (
            <table className="w-full min-w-[960px] text-left text-sm">
              <thead className="border-b border-gray-100 bg-gray-50/80">
                <tr className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  <th className="px-4 py-3 pl-6">Photo</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Blood</th>
                  <th className="px-4 py-3">Finance</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading && (
                  <tr>
                    <td colSpan={9} className="px-6 py-16 text-center text-gray-500">
                      <Loader2 className="mx-auto mb-2 size-6 animate-spin text-brand" />
                      Loading members…
                    </td>
                  </tr>
                )}
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-6 py-16 text-center text-gray-500">
                      No members found.{" "}
                      <Link to="/admin/members/new" className="font-semibold text-brand hover:underline">
                        Register the first member
                      </Link>
                      .
                    </td>
                  </tr>
                )}
                {!loading &&
                  filtered.map((m) => (
                    <tr
                      key={m._id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setDetailMember(m)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setDetailMember(m);
                        }
                      }}
                      className="cursor-pointer hover:bg-gray-50/80"
                    >
                      <td className="px-4 py-3 pl-6">
                        <img
                          src={
                            m.picture ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name || "?")}&background=e8f5ef&color=0d7a52`
                          }
                          alt=""
                          className="size-10 rounded-xl border border-gray-100 object-cover"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-900">{m.name || "—"}</p>
                        <p className="text-xs text-gray-400 line-clamp-1">{m.address || m.program || ""}</p>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-700">{m.phone || "—"}</td>
                      <td className="max-w-[140px] truncate px-4 py-3 text-gray-500">{m.email || "—"}</td>
                      <td className="px-4 py-3 text-gray-700">{m.title || "—"}</td>
                      <td className="px-4 py-3 text-gray-600">{m.blood_type || "—"}</td>
                      <td className="px-4 py-3">
                        {m.is_finance_member ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-bold uppercase text-brand">
                            <Wallet size={12} />
                            Yes
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${statusStyle(m.status)}`}>
                          {m.status || "pending"}
                        </span>
                      </td>
                      <td className="px-4 py-3 pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-1">
                          <Link
                            to={`/admin/members/${m._id}/edit`}
                            className="inline-flex rounded-lg p-2 text-brand hover:bg-brand-soft"
                            title="Edit"
                          >
                            <Pencil size={18} />
                          </Link>
                          <button
                            type="button"
                            title="Delete"
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
          )}
        </div>
      </div>

      <div className="mt-8 flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-3 text-xs text-gray-500">
        <Users size={16} className="text-brand" />
        {financeOnly
          ? "Click a row for full details, portal reset, and payment tools."
          : "Click a row for details. For fee payment actions (Paid / Partial / Not paid), open Finance members in the sidebar."}
      </div>

      {detailMember && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center" aria-modal="true" role="dialog">
          <button
            type="button"
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-[1px]"
            aria-label="Close member details"
            onClick={() => setDetailMember(null)}
          />
          <div className="relative flex max-h-[min(90vh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
            <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-5 py-4">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand">Member</p>
                <h2 className="truncate text-lg font-bold text-gray-900">{detailMember.name || "—"}</h2>
                <p className="truncate text-sm text-gray-500">{detailMember.title || "No title"}</p>
              </div>
              <button
                type="button"
                onClick={() => setDetailMember(null)}
                className="shrink-0 rounded-xl p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="overflow-y-auto px-5 py-4">
              <div className="mb-5 flex flex-col items-center gap-3 sm:flex-row sm:items-start">
                <div className="flex shrink-0 flex-col items-center gap-2">
                  <div className="size-24 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
                    <img
                      src={
                        detailMember.picture ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(detailMember.name || "?")}&background=e8f5ef&color=0d7a52&size=128`
                      }
                      alt=""
                      className="size-full object-cover transition-transform duration-200"
                      style={{
                        transform: `scale(${PHOTO_ZOOM_SCALES[photoZoomIdx] ?? 1})`,
                        transformOrigin: "center center",
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-0.5 shadow-sm">
                    <button
                      type="button"
                      title="Zoom in"
                      disabled={photoZoomIdx <= 0}
                      onClick={() => setPhotoZoomIdx((i) => Math.max(0, i - 1))}
                      className="rounded-md p-1.5 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ZoomIn size={16} />
                    </button>
                    <button
                      type="button"
                      title="Zoom out"
                      disabled={photoZoomIdx >= PHOTO_ZOOM_SCALES.length - 1}
                      onClick={() => setPhotoZoomIdx((i) => Math.min(PHOTO_ZOOM_SCALES.length - 1, i + 1))}
                      className="rounded-md p-1.5 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ZoomOut size={16} />
                    </button>
                  </div>
                </div>
                <div className="w-full space-y-2 text-sm">
                  <MemberField label="Email" value={detailMember.email} mono />
                  <MemberField label="Phone" value={detailMember.phone} mono />
                  <MemberField label="Address" value={detailMember.address} />
                  <MemberField label="Program" value={detailMember.program} />
                </div>
              </div>
              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <MemberField label="Blood type" value={detailMember.blood_type} />
                <MemberField label="Status" value={detailMember.status} />
                <MemberField label="Joined" value={formatDate(detailMember.joined_date)} />
                <MemberField label="Finance member" value={detailMember.is_finance_member ? "Yes" : "No"} />
                {detailMember.is_finance_member && (
                  <>
                    <MemberField
                      label="Finance section"
                      value={
                        detailMember.finance_section === "sports"
                          ? "Sports finance"
                          : detailMember.finance_section === "members"
                            ? "Members finance"
                            : "—"
                      }
                    />
                    <MemberField
                      label="Payment status"
                      value={payStatusLabel(detailMember.finance_payment_status)}
                    />
                    <MemberField
                      label="Monthly fee"
                      value={
                        detailMember.finance_monthly_fee != null && detailMember.finance_monthly_fee !== ""
                          ? String(detailMember.finance_monthly_fee)
                          : "—"
                      }
                    />
                    <MemberField label="Payment method" value={detailMember.finance_payment_method} />
                    <MemberField label="Account ref" value={detailMember.finance_account_ref} />
                    <MemberField label="Finance notes" value={detailMember.finance_notes} className="sm:col-span-2" />
                  </>
                )}
                <MemberField label="Created" value={formatDateTime(detailMember.createdAt)} />
                <MemberField label="Last updated" value={formatDateTime(detailMember.updatedAt)} />
              </div>

              <div className="mt-5 border-t border-gray-100 pt-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Portal login</p>
                <p className="mt-1 text-xs text-gray-500">
                  Passwords are stored encrypted, so the old password cannot be shown. Generate a new password, email it
                  to this member, and copy it from here.
                </p>
                {(detailMember.email || "").trim() ? (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        sendPortalCredentials();
                      }}
                      disabled={portalCredLoading}
                      className="mt-3 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-gray-800 disabled:opacity-60"
                    >
                      {portalCredLoading ? <Loader2 className="size-4 animate-spin" /> : <Mail size={16} />}
                      {portalCredLoading ? "Working…" : "New password & email to member"}
                    </button>
                    {portalCredError && <p className="mt-2 text-xs text-red-700">{portalCredError}</p>}
                    {portalCredResult && (
                      <div className="mt-4 rounded-xl border border-brand/20 bg-brand-soft/50 p-3">
                        <MemberField label="New password" value={portalCredResult.temporaryPassword} mono />
                        {portalCredResult.temporaryPassword && (
                          <button
                            type="button"
                            onClick={() => {
                              void navigator.clipboard?.writeText(portalCredResult.temporaryPassword);
                            }}
                            className="mt-1 text-xs font-bold text-brand hover:underline"
                          >
                            Copy password
                          </button>
                        )}
                        {portalCredResult.emailSent ? (
                          <>
                            <p className="mt-2 text-xs font-medium text-emerald-800">Message sent (use Ethereal link below if testing).</p>
                            {portalCredResult.etherealPreviewUrl && (
                              <p className="mt-2 text-xs">
                                <a
                                  href={portalCredResult.etherealPreviewUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-semibold text-emerald-950 underline"
                                >
                                  Open free test email (Ethereal)
                                </a>
                              </p>
                            )}
                          </>
                        ) : (
                          <p className="mt-2 text-xs text-amber-900">
                            Email was not sent.
                            {portalCredResult.mailError && (
                              <span className="mt-1 block opacity-90">{portalCredResult.mailError}</span>
                            )}
                            <span className="mt-1 block">
                              Share the password above manually and configure SMTP in Backend <code className="text-[10px]">.env</code>.
                            </span>
                          </p>
                        )}
                        {portalCredResult.loginUrl && (
                          <p className="mt-2 text-[11px] text-gray-600">
                            Sign-in:{" "}
                            <a href={portalCredResult.loginUrl} className="font-semibold text-brand underline">
                              {portalCredResult.loginUrl}
                            </a>
                          </p>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <p className="mt-2 text-xs text-amber-800">
                    This member has no email — add one via Edit member before sending login details.
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 border-t border-gray-100 bg-gray-50/80 px-5 py-4">
              <Link
                to={`/admin/members/${detailMember._id}/edit`}
                onClick={() => setDetailMember(null)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-dark sm:flex-none"
              >
                <Pencil size={16} />
                Edit member
              </Link>
              <button
                type="button"
                onClick={() => setDetailMember(null)}
                className="inline-flex flex-1 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 sm:flex-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function MemberField({ label, value, mono, className = "" }) {
  const display = value != null && String(value).trim() !== "" ? String(value) : "—";
  return (
    <div className={className}>
      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</p>
      <p className={`mt-0.5 font-medium text-gray-900 ${mono ? "break-all font-mono text-[13px]" : ""}`}>{display}</p>
    </div>
  );
}

export default Members;
