import React, { useCallback, useEffect, useState } from "react";
import { NavLink, useParams, Navigate, Link } from "react-router-dom";
import {
  Download,
  FileSpreadsheet,
  Loader2,
  Plus,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Users,
  Dumbbell,
  Pencil,
  ExternalLink,
} from "lucide-react";
import { financeApi } from "../../services/financeApi";
import { sportMembersApi } from "../../services/sportMembersApi";
import { useTheme } from "../../context/ThemeContext";
import { exportToExcel } from "../../lib/exportExcel";

const fmt = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(n) || 0);

const payLabel = (s) => (s === "paid" ? "Paid" : s === "partial" ? "Partial" : "Not paid");
const payClass = (s) =>
  s === "paid" ? "bg-emerald-100 text-emerald-800" : s === "partial" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-600";

const Finance = () => {
  const { section } = useParams();
  const { isDark } = useTheme();
  const sector = section === "sports" ? "sports" : "members";

  const [overview, setOverview] = useState(null);
  const [tx, setTx] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sportRows, setSportRows] = useState([]);
  const [payUpdatingId, setPayUpdatingId] = useState(null);
  const [txForm, setTxForm] = useState({
    entity_name: "",
    category: "General",
    amount: "",
    type: "income",
    date: new Date().toISOString().slice(0, 10),
    sector: "members",
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      if (sector === "sports") {
        const [ov, list, sm] = await Promise.all([
          financeApi.getOverview("sports"),
          financeApi.getTransactions(40, "sports"),
          sportMembersApi.getAll().catch(() => []),
        ]);
        setOverview(ov);
        setTx(Array.isArray(list) ? list : []);
        setSportRows(Array.isArray(sm) ? sm : []);
      } else {
        const [ov, list] = await Promise.all([financeApi.getOverview("members"), financeApi.getTransactions(40, "members")]);
        setOverview(ov);
        setTx(Array.isArray(list) ? list : []);
        setSportRows([]);
      }
    } catch (e) {
      setError(e.message || "Failed to load finance data");
      setOverview(null);
      setTx([]);
      setSportRows([]);
    } finally {
      setLoading(false);
    }
  }, [sector]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (modal) {
      setTxForm((f) => ({ ...f, sector }));
    }
  }, [modal, sector]);

  const updateSportPayment = async (e, id, status) => {
    e.preventDefault();
    e.stopPropagation();
    setPayUpdatingId(id);
    try {
      const updated = await sportMembersApi.updatePayment(id, status);
      setSportRows((r) => r.map((x) => (x._id === id ? { ...x, ...updated } : x)));
    } catch (err) {
      alert(err.message || "Could not update payment");
    } finally {
      setPayUpdatingId(null);
    }
  };

  const exportTransactionsExcel = () => {
    exportToExcel(
      tx.map((row) => ({
        Description: row.entity_name || "",
        Category: row.category || "",
        Type: row.type || "",
        Amount: Number(row.amount) || 0,
        Date: row.date ? new Date(row.date).toLocaleString() : "",
        Sector: row.sector || sector,
      })),
      { fileName: `finance-${sector}-transactions`, sheetName: "Transactions" }
    );
  };

  const exportSportsRosterExcel = () => {
    exportToExcel(
      sportRows.map((m) => ({
        Name: m.name || "",
        Team: m.team || "",
        Sport: m.sport || "",
        Phone: m.phone || "",
        "Payment status": payLabel(m.finance_payment_status),
        Email: m.email || "",
      })),
      { fileName: "sports-finance-members", sheetName: "Sports payments" }
    );
  };

  const totalFlow = (overview?.income || 0) + (overview?.expense || 0);
  const tabBase = isDark
    ? "text-gray-400 hover:text-gray-200"
    : "text-gray-500 hover:text-gray-800";
  const tabActive = isDark
    ? "bg-gray-800 text-brand border border-gray-600"
    : "bg-white text-brand border border-gray-200 shadow-sm";
  const tabInactive = isDark ? "border border-transparent" : "border border-transparent";
  const pageBg = isDark ? "bg-gray-950" : "bg-gray-50";
  const textMain = isDark ? "text-gray-100" : "text-gray-800";
  const textSub = isDark ? "text-gray-400" : "text-gray-500";
  const card = isDark ? "border border-gray-800 bg-gray-900" : "border border-gray-100 bg-white";
  const inputCls = isDark
    ? "w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-gray-100 outline-none focus:ring-2 focus:ring-[#1a5336]"
    : "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1a5336]";

  if (section && section !== "members" && section !== "sports") {
    return <Navigate to="/admin/finance/members" replace />;
  }

  return (
    <div className={`min-h-screen p-4 sm:p-6 ${pageBg}`}>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className={`text-2xl font-bold ${textMain}`}>Finance &amp; analytics</h1>
          <p className={`mt-1 text-sm ${textSub}`}>
            Sub-ledgers for <strong className="font-semibold">members</strong> vs <strong className="font-semibold">sports</strong> programs.
            Data from <code className="rounded bg-black/20 px-1 text-xs">/api/finance</code> with <code className="rounded bg-black/20 px-1 text-xs">sector</code> filter.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => load()}
            className={`inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold ${
              isDark ? "border-gray-600 bg-gray-800 text-gray-200 hover:bg-gray-700" : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            type="button"
            onClick={exportTransactionsExcel}
            disabled={loading || tx.length === 0}
            className={`inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${
              isDark ? "border-gray-600 bg-gray-800 text-gray-200 hover:bg-gray-700" : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <FileSpreadsheet size={16} />
            Export transactions
          </button>
          <button
            type="button"
            onClick={() => {
              setTxForm({
                entity_name: "",
                category: "General",
                amount: "",
                type: "income",
                date: new Date().toISOString().slice(0, 10),
                sector,
              });
              setModal(true);
            }}
            className="inline-flex items-center gap-2 rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
          >
            <Plus size={18} />
            Add transaction
          </button>
        </div>
      </div>

      <div className={`mb-6 flex flex-wrap gap-2 rounded-xl p-1 ${isDark ? "bg-gray-900" : "bg-gray-200/50"}`}>
        <NavLink
          to="/admin/finance/members"
          className={({ isActive }) =>
            `inline-flex flex-1 min-w-[140px] items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-colors ${
              isActive ? tabActive : `${tabBase} ${tabInactive}`
            }`
          }
        >
          <Users size={16} />
          Members finance
        </NavLink>
        <NavLink
          to="/admin/finance/sports"
          className={({ isActive }) =>
            `inline-flex flex-1 min-w-[140px] items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-colors ${
              isActive ? tabActive : `${tabBase} ${tabInactive}`
            }`
          }
        >
          <Dumbbell size={16} />
          Sports finance
        </NavLink>
      </div>

      {sector === "sports" && (
        <div className={`mb-6 rounded-xl p-6 shadow-sm ${card}`}>
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-green-600">Sports program</p>
              <h2 className={`text-lg font-bold ${textMain}`}>Sports member payments</h2>
              <p className={`mt-1 max-w-2xl text-sm ${textSub}`}>
                All sports roster members are listed here. Mark each as <strong className="text-inherit">Paid</strong>,{" "}
                <strong className="text-inherit">Partial</strong>, or <strong className="text-inherit">Not paid</strong>. Use{" "}
                <strong className="text-inherit">Add transaction</strong> to record money in the sports ledger.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={exportSportsRosterExcel}
                disabled={loading || sportRows.length === 0}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${
                  isDark ? "bg-gray-800 text-gray-200 hover:bg-gray-700" : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FileSpreadsheet size={14} />
                Export Excel
              </button>
              <Link
                to="/admin/sports"
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold ${
                  isDark ? "bg-gray-800 text-gray-200 hover:bg-gray-700" : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Open full roster
                <ExternalLink size={14} />
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className={`border-b ${isDark ? "border-gray-700" : "border-gray-100"}`}>
                <tr className={`text-[10px] font-bold uppercase ${textSub}`}>
                  <th className="py-2 pl-0 pr-3">Name</th>
                  <th className="py-2 pr-3">Team</th>
                  <th className="py-2 pr-3">Sport</th>
                  <th className="py-2 pr-3">Phone</th>
                  <th className="py-2 pr-3">Payment</th>
                  <th className="min-w-[200px] py-2 pr-3">Set payment</th>
                  <th className="py-2 pr-0 text-right">Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {loading && (
                  <tr>
                    <td colSpan={7} className={`py-8 text-center ${textSub}`}>
                      <Loader2 className="inline size-5 animate-spin" /> Loading sports members…
                    </td>
                  </tr>
                )}
                {!loading && sportRows.length === 0 && (
                  <tr>
                    <td colSpan={7} className={`py-8 text-center text-sm ${textSub}`}>
                      No sports members yet.{" "}
                      <Link to="/admin/sports/new" className="font-semibold text-brand hover:underline">
                        Add a sports member
                      </Link>{" "}
                      or open the <Link to="/admin/sports" className="font-semibold text-brand hover:underline">sports list</Link>.
                    </td>
                  </tr>
                )}
                {!loading &&
                  sportRows.map((m) => (
                    <tr key={m._id} className={isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-50/80"}>
                      <td className="py-3 font-semibold">{m.name || "—"}</td>
                      <td className="py-3">{m.team || "—"}</td>
                      <td className="py-3">{m.sport || "—"}</td>
                      <td className="py-3 font-mono text-xs">{m.phone || "—"}</td>
                      <td className="py-3">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${payClass(
                            m.finance_payment_status
                          )}`}
                        >
                          {payLabel(m.finance_payment_status)}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-1">
                          <button
                            type="button"
                            disabled={payUpdatingId === m._id}
                            onClick={(e) => updateSportPayment(e, m._id, "paid")}
                            className="rounded-lg bg-emerald-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                          >
                            Paid
                          </button>
                          <button
                            type="button"
                            disabled={payUpdatingId === m._id}
                            onClick={(e) => updateSportPayment(e, m._id, "partial")}
                            className="rounded-lg border border-amber-300 bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-900 hover:bg-amber-100 disabled:opacity-50"
                          >
                            Partial
                          </button>
                          <button
                            type="button"
                            disabled={payUpdatingId === m._id}
                            onClick={(e) => updateSportPayment(e, m._id, "unpaid")}
                            className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-[10px] font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                          >
                            Not paid
                          </button>
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          to={`/admin/sports/${m._id}/edit`}
                          className="inline-flex rounded-lg p-2 text-brand hover:bg-brand-soft"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {error && (
        <div
          className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
            isDark ? "border-red-800 bg-red-950/50 text-red-200" : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className={`rounded-xl p-6 shadow-sm ${card}`}>
            <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-green-600">
                  {sector === "sports" ? "Sports" : "Members"} · Overview
                </p>
                <h2 className={`mt-1 text-xl font-bold ${textMain}`}>Income vs expense (this sub-ledger)</h2>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-bold ${textMain}`}>{loading ? "…" : fmt(totalFlow)}</p>
                <p className={`text-[10px] ${textSub}`}>Total volume (in + out)</p>
              </div>
            </div>
            <div className={`flex h-48 items-end justify-around gap-3 rounded-lg p-4 ${isDark ? "bg-gray-800/50" : "bg-gray-50"}`}>
              <Bar label="Income" value={overview?.income || 0} max={Math.max(totalFlow, 1)} color="bg-emerald-500" />
              <Bar label="Expense" value={overview?.expense || 0} max={Math.max(totalFlow, 1)} color="bg-[#1a5336]" />
            </div>
          </div>

          <div className={`rounded-xl p-6 shadow-sm ${card}`}>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
              <h3 className={`font-bold ${textMain}`}>Recent transactions</h3>
              <div className="flex items-center gap-2">
                <span className={`text-xs ${textSub}`}>{tx.length} loaded</span>
                <button
                  type="button"
                  onClick={exportTransactionsExcel}
                  disabled={loading || tx.length === 0}
                  className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${
                    isDark ? "border-gray-600 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <FileSpreadsheet size={12} />
                  Excel
                </button>
              </div>
            </div>
            {loading && (
              <div className={`flex items-center gap-2 py-8 ${textSub}`}>
                <Loader2 className="size-5 animate-spin" /> Loading…
              </div>
            )}
            {!loading && tx.length === 0 && (
              <p className={`py-6 text-sm ${textSub}`}>
                No transactions in this sub-ledger yet. Use <strong className="font-semibold">Add transaction</strong> to
                record entries.
              </p>
            )}
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {!loading &&
                tx.map((row) => (
                  <div key={row._id} className="flex items-center justify-between py-4 first:pt-0">
                    <div>
                      <h4 className={`text-sm font-bold ${textMain}`}>{row.entity_name || "Entry"}</h4>
                      <p className={`text-[10px] ${textSub}`}>
                        {row.category} · {row.type}
                        {row.sector ? ` · ${row.sector}` : ""}
                        {row.date ? ` · ${new Date(row.date).toLocaleDateString()}` : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${row.type === "income" ? "text-emerald-600" : isDark ? "text-gray-200" : "text-gray-900"}`}>
                        {row.type === "income" ? "+" : "−"}
                        {fmt(row.amount)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-xl bg-[#1a5336] p-6 text-white">
            <p className="flex items-center gap-2 text-sm opacity-80">Net balance</p>
            <h2 className="mt-2 text-3xl font-bold">{loading ? "…" : fmt(overview?.balance ?? 0)}</h2>
            <p className="mt-3 text-xs opacity-75">Income minus expense in this sub-ledger.</p>
            <div className="mt-4 inline-flex items-center gap-1 rounded bg-white/10 px-2 py-1 text-[10px]">
              {overview && overview.balance >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {overview ? `${tx.length} transactions` : ""}
            </div>
          </div>

          <div className={`rounded-xl p-6 shadow-sm ${card}`}>
            <h3 className={`mb-4 font-bold ${textMain}`}>Totals</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className={textSub}>Income</span>
                <span className="font-bold text-emerald-600">{loading ? "…" : fmt(overview?.income)}</span>
              </div>
              <div className="flex justify-between">
                <span className={textSub}>Expense</span>
                <span className={`font-bold ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                  {loading ? "…" : fmt(overview?.expense)}
                </span>
              </div>
              <div className={`flex justify-between border-t pt-3 ${isDark ? "border-gray-700" : "border-gray-100"}`}>
                <span className={`font-semibold ${textMain}`}>Balance</span>
                <span className="font-bold">{loading ? "…" : fmt(overview?.balance)}</span>
              </div>
            </div>
          </div>

          <div className={`flex justify-center ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            <button
              type="button"
              onClick={exportTransactionsExcel}
              disabled={loading || tx.length === 0}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                isDark
                  ? "border-gray-600 text-gray-300 hover:bg-gray-800"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Download size={14} />
              Export transactions (Excel)
            </button>
          </div>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog">
          <div className={`w-full max-w-md rounded-2xl p-6 shadow-xl ${isDark ? "bg-gray-900 text-gray-100" : "bg-white"}`}>
            <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Add transaction</h3>
            <p className={`mt-1 text-xs ${textSub}`}>POST /api/finance/transactions (sector: members | sports)</p>
            <form
              className="mt-4 space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                setSaving(true);
                try {
                  await financeApi.createTransaction({
                    entity_name: txForm.entity_name.trim() || "Entry",
                    category: txForm.category.trim() || "General",
                    amount: Number(txForm.amount),
                    type: txForm.type,
                    date: txForm.date ? new Date(txForm.date).toISOString() : undefined,
                    sector: txForm.sector === "sports" ? "sports" : "members",
                  });
                  setModal(false);
                  await load();
                } catch (err) {
                  alert(err.message || "Could not save");
                } finally {
                  setSaving(false);
                }
              }}
            >
              <div>
                <label className={`mb-1 block text-xs font-semibold ${textSub}`}>Description / payer</label>
                <input
                  required
                  value={txForm.entity_name}
                  onChange={(e) => setTxForm((f) => ({ ...f, entity_name: e.target.value }))}
                  className={inputCls}
                  placeholder="e.g. Membership dues — March"
                />
              </div>
              <div>
                <label className={`mb-1 block text-xs font-semibold ${textSub}`}>Sub-ledger</label>
                <select
                  value={txForm.sector}
                  onChange={(e) => setTxForm((f) => ({ ...f, sector: e.target.value }))}
                  className={inputCls}
                >
                  <option value="members">Members finance</option>
                  <option value="sports">Sports finance</option>
                </select>
              </div>
              <div>
                <label className={`mb-1 block text-xs font-semibold ${textSub}`}>Category</label>
                <input
                  value={txForm.category}
                  onChange={(e) => setTxForm((f) => ({ ...f, category: e.target.value }))}
                  className={inputCls}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`mb-1 block text-xs font-semibold ${textSub}`}>Type</label>
                  <select
                    value={txForm.type}
                    onChange={(e) => setTxForm((f) => ({ ...f, type: e.target.value }))}
                    className={inputCls}
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                <div>
                  <label className={`mb-1 block text-xs font-semibold ${textSub}`}>Amount (USD)</label>
                  <input
                    required
                    min="0"
                    step="0.01"
                    type="number"
                    value={txForm.amount}
                    onChange={(e) => setTxForm((f) => ({ ...f, amount: e.target.value }))}
                    className={inputCls}
                  />
                </div>
              </div>
              <div>
                <label className={`mb-1 block text-xs font-semibold ${textSub}`}>Date</label>
                <input
                  type="date"
                  value={txForm.date}
                  onChange={(e) => setTxForm((f) => ({ ...f, date: e.target.value }))}
                  className={inputCls}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModal(false)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold ${isDark ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[#1a5336] px-4 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

function Bar({ label, value, max, color }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="flex flex-1 flex-col items-center gap-2">
      <div className="flex h-40 w-full max-w-[100px] items-end rounded-t bg-gray-100 dark:bg-gray-800">
        <div className={`w-full rounded-t ${color}`} style={{ height: `${Math.max(pct, 4)}%` }} />
      </div>
      <span className="text-center text-[10px] font-bold uppercase text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{fmt(value)}</span>
    </div>
  );
}

export default Finance;
