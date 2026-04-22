import React, { useCallback, useEffect, useState } from "react";
import { Download, Loader2, Plus, RefreshCw, TrendingDown, TrendingUp } from "lucide-react";
import { financeApi } from "../../services/financeApi";

const fmt = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(n) || 0);

const Finance = () => {
  const [overview, setOverview] = useState(null);
  const [tx, setTx] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [txForm, setTxForm] = useState({
    entity_name: "",
    category: "General",
    amount: "",
    type: "income",
    date: new Date().toISOString().slice(0, 10),
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [ov, list] = await Promise.all([financeApi.getOverview(), financeApi.getTransactions(40)]);
      setOverview(ov);
      setTx(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e.message || "Failed to load finance data");
      setOverview(null);
      setTx([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const totalFlow = (overview?.income || 0) + (overview?.expense || 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Finance &amp; analytics</h1>
          <p className="mt-1 text-sm text-gray-500">Data from MongoDB via `/api/finance/overview` and `/transactions`.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => load()}
            className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
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
              });
              setModal(true);
            }}
            className="inline-flex items-center gap-2 rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
          >
            <Plus size={18} />
            Add transaction
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md bg-[#1a5336] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            <Download size={18} />
            Export (soon)
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-green-600">Overview</p>
                <h2 className="mt-1 text-xl font-bold text-gray-800">Income vs expense (all time)</h2>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{loading ? "…" : fmt(totalFlow)}</p>
                <p className="text-[10px] text-gray-400">Total recorded volume (in + out)</p>
              </div>
            </div>
            <div className="flex h-48 items-end justify-around gap-3 rounded-lg bg-gray-50 p-4">
              <Bar label="Income" value={overview?.income || 0} max={Math.max(totalFlow, 1)} color="bg-emerald-500" />
              <Bar label="Expense" value={overview?.expense || 0} max={Math.max(totalFlow, 1)} color="bg-[#1a5336]" />
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-bold text-gray-800">Recent transactions</h3>
              <span className="text-xs text-gray-400">{tx.length} loaded</span>
            </div>
            {loading && (
              <div className="flex items-center gap-2 py-8 text-gray-500">
                <Loader2 className="size-5 animate-spin" /> Loading…
              </div>
            )}
            {!loading && tx.length === 0 && (
              <p className="py-6 text-sm text-gray-500">
                No transactions yet. Use <strong className="font-semibold text-gray-700">Add transaction</strong> to record real
                entries. Demo seeding is off unless the server sets <code className="rounded bg-gray-100 px-1">SEED_DEMO_DATA=true</code>.
              </p>
            )}
            <div className="divide-y divide-gray-50">
              {!loading &&
                tx.map((row) => (
                  <div key={row._id} className="flex items-center justify-between py-4 first:pt-0">
                    <div>
                      <h4 className="text-sm font-bold text-gray-800">{row.entity_name || "Entry"}</h4>
                      <p className="text-[10px] text-gray-400">
                        {row.category} · {row.type}
                        {row.date ? ` · ${new Date(row.date).toLocaleDateString()}` : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-bold ${row.type === "income" ? "text-emerald-700" : "text-gray-900"}`}
                      >
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
            <p className="mt-3 text-xs opacity-75">Income minus expense from your ledger.</p>
            <div className="mt-4 inline-flex items-center gap-1 rounded bg-white/10 px-2 py-1 text-[10px]">
              {overview && overview.balance >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {overview ? `${tx.length} transactions` : ""}
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-bold text-gray-800">Totals</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Income</span>
                <span className="font-bold text-emerald-700">{loading ? "…" : fmt(overview?.income)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Expense</span>
                <span className="font-bold text-gray-800">{loading ? "…" : fmt(overview?.expense)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-3">
                <span className="font-semibold text-gray-800">Balance</span>
                <span className="font-bold">{loading ? "…" : fmt(overview?.balance)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900">Add transaction</h3>
            <p className="mt-1 text-xs text-gray-500">Saved to MongoDB via POST /api/finance/transactions.</p>
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
                <label className="mb-1 block text-xs font-semibold text-gray-500">Description / payer</label>
                <input
                  required
                  value={txForm.entity_name}
                  onChange={(e) => setTxForm((f) => ({ ...f, entity_name: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1a5336]"
                  placeholder="e.g. Membership dues — March"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-500">Category</label>
                <input
                  value={txForm.category}
                  onChange={(e) => setTxForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1a5336]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-500">Type</label>
                  <select
                    value={txForm.type}
                    onChange={(e) => setTxForm((f) => ({ ...f, type: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1a5336]"
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-500">Amount (USD)</label>
                  <input
                    required
                    min="0"
                    step="0.01"
                    type="number"
                    value={txForm.amount}
                    onChange={(e) => setTxForm((f) => ({ ...f, amount: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1a5336]"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-500">Date</label>
                <input
                  type="date"
                  value={txForm.date}
                  onChange={(e) => setTxForm((f) => ({ ...f, date: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1a5336]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModal(false)}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
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
      <div className="flex h-40 w-full max-w-[100px] items-end rounded-t bg-gray-100">
        <div className={`w-full rounded-t ${color}`} style={{ height: `${Math.max(pct, 4)}%` }} />
      </div>
      <span className="text-center text-[10px] font-bold uppercase text-gray-500">{label}</span>
      <span className="text-xs font-bold text-gray-800">{fmt(value)}</span>
    </div>
  );
}

export default Finance;
