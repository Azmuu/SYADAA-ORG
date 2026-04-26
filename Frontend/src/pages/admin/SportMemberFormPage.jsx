import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { sportMembersApi } from "../../services/sportMembersApi";
import { useTheme } from "../../context/ThemeContext";

const emptyForm = () => ({
  name: "",
  email: "",
  phone: "",
  address: "",
  picture: "",
  sport: "",
  team: "",
  position: "",
  notes: "",
  status: "active",
  joined_date: new Date().toISOString().slice(0, 10),
  finance_payment_status: "unpaid",
});

const SportMemberFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const { isDark } = useTheme();

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const m = await sportMembersApi.getById(id);
        if (cancelled) return;
        setForm({
          name: m.name || "",
          email: m.email || "",
          phone: m.phone || "",
          address: m.address || "",
          picture: m.picture || "",
          sport: m.sport || "",
          team: m.team || "",
          position: m.position || "",
          notes: m.notes || "",
          status: m.status || "active",
          joined_date: m.joined_date ? new Date(m.joined_date).toISOString().slice(0, 10) : emptyForm().joined_date,
          finance_payment_status: m.finance_payment_status && ["unpaid", "partial", "paid"].includes(m.finance_payment_status)
            ? m.finance_payment_status
            : "unpaid",
        });
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load sports member");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, isEdit]);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const onPictureFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 900_000) {
      setError("Picture file is too large (max ~900KB). Use a smaller image.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      set("picture", String(reader.result || ""));
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const buildPayload = () => ({
    name: form.name.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    address: form.address.trim(),
    picture: form.picture.trim(),
    sport: form.sport.trim(),
    team: form.team.trim(),
    position: form.position.trim(),
    notes: form.notes.trim(),
    status: form.status,
    joined_date: form.joined_date ? new Date(form.joined_date) : new Date(),
    finance_payment_status: form.finance_payment_status,
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) return setError("Name is required.");
    if (!form.phone.trim()) return setError("Phone is required.");
    if (!form.sport.trim()) return setError("Sport is required.");
    setSaving(true);
    try {
      const payload = buildPayload();
      if (isEdit) await sportMembersApi.update(id, payload);
      else await sportMembersApi.create(payload);
      navigate("/admin/sports");
    } catch (err) {
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={`flex min-h-[40vh] items-center justify-center gap-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
        <Loader2 className="animate-spin" size={22} />
        Loading...
      </div>
    );
  }

  return (
    <div className={`mx-auto max-w-3xl pb-16 ${isDark ? "text-gray-100" : "text-gray-800"}`}>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-3">
        <div>
        <Link to="/admin/sports" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline">
          <ArrowLeft size={16} />
          Back to sports list
        </Link>
        <h1 className={`text-3xl font-bold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>{isEdit ? "Update sports member" : "Add sports member"}</h1>
        <p className={`mt-2 text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Fill the required fields to save this sports member profile.</p>
        </div>
      </div>

      {error && <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}

      <div className={`mb-6 rounded-2xl border p-4 ${isDark ? "border-gray-800 bg-gray-900/70" : "border-gray-100 bg-white"}`}>
        <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-gray-300" : "text-gray-500"}`}>Dark mode section</p>
        <p className={`mt-1 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Theme is controlled globally. Use the sidebar toggle to switch light/dark mode for all admin pages.
        </p>
      </div>

      <form onSubmit={onSubmit} className={`space-y-6 rounded-2xl border p-5 shadow-sm sm:p-8 ${isDark ? "border-gray-800 bg-gray-900" : "border-gray-100 bg-white"}`}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Full name *" value={form.name} onChange={(v) => set("name", v)} />
          <Input label="Phone *" value={form.phone} onChange={(v) => set("phone", v)} />
          <Input label="Sport *" value={form.sport} onChange={(v) => set("sport", v)} placeholder="Football, Basketball..." />
          <Input label="Team" value={form.team} onChange={(v) => set("team", v)} />
          <Input label="Position" value={form.position} onChange={(v) => set("position", v)} />
          <Input label="Email" value={form.email} onChange={(v) => set("email", v)} type="email" />
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-gray-500">Address</label>
            <textarea
              rows={2}
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-gray-500">Upload picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={onPictureFile}
              className="w-full max-w-xs text-xs text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-soft file:px-3 file:py-2 file:text-xs file:font-semibold file:text-brand"
            />
            <p className="mt-1 text-[11px] text-gray-400">Accepted image files only. Max size about 900KB.</p>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-500">Status</label>
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            >
              <option value="active">Active</option>
              <option value="injured">Injured</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-500">Fee payment (sports finance)</label>
            <select
              value={form.finance_payment_status}
              onChange={(e) => set("finance_payment_status", e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            >
              <option value="unpaid">Not paid</option>
              <option value="partial">Partial</option>
              <option value="paid">Paid</option>
            </select>
            <p className="mt-1 text-[11px] text-gray-400">You can also change this on Finance → Sports finance.</p>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-500">Joined date</label>
            <input
              type="date"
              value={form.joined_date}
              onChange={(e) => set("joined_date", e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-gray-500">Notes</label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>
        </div>

        {form.picture && (
          <div>
            <p className="mb-2 text-xs font-semibold text-gray-500">Picture preview</p>
            <img src={form.picture} alt="" className="h-24 w-24 rounded-2xl border border-gray-100 object-cover" />
          </div>
        )}

        <div className="flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-6">
          <Link to="/admin/sports" className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {isEdit ? "Save changes" : "Add member"}
          </button>
        </div>
      </form>
    </div>
  );
};

function Input({ label, value, onChange, type = "text", placeholder = "" }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-gray-500">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
      />
    </div>
  );
}

export default SportMemberFormPage;
