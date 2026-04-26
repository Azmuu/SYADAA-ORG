import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Save, Wallet } from "lucide-react";
import { membersApi } from "../../services/membersApi";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"];

const emptyForm = () => ({
  name: "",
  email: "",
  phone: "",
  address: "",
  picture: "",
  blood_type: "Unknown",
  title: "",
  is_finance_member: false,
  finance_section: "members",
  finance_payment_status: "unpaid",
  finance_monthly_fee: "",
  finance_payment_method: "",
  finance_account_ref: "",
  finance_notes: "",
  program: "",
  status: "active",
  joined_date: new Date().toISOString().slice(0, 10),
});

const MemberFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const m = await membersApi.getById(id);
        if (cancelled) return;
        setForm({
          name: m.name || "",
          email: m.email || "",
          phone: m.phone || "",
          address: m.address || "",
          picture: m.picture || "",
          blood_type: m.blood_type || "Unknown",
          title: m.title || "",
          is_finance_member: Boolean(m.is_finance_member),
          finance_section: m.finance_section === "sports" ? "sports" : "members",
          finance_payment_status: m.finance_payment_status || "unpaid",
          finance_monthly_fee: m.finance_monthly_fee != null ? String(m.finance_monthly_fee) : "",
          finance_payment_method: m.finance_payment_method || "",
          finance_account_ref: m.finance_account_ref || "",
          finance_notes: m.finance_notes || "",
          program: m.program || "",
          status: m.status || "active",
          joined_date: m.joined_date ? new Date(m.joined_date).toISOString().slice(0, 10) : emptyForm().joined_date,
        });
        setError("");
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load member");
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
      setError("Picture file is too large (max ~900KB). Use a smaller image or paste an image URL instead.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      set("picture", reader.result);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const buildPayload = () => {
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      picture: form.picture.trim(),
      blood_type: form.blood_type,
      title: form.title.trim(),
      is_finance_member: form.is_finance_member,
      finance_section: form.is_finance_member ? form.finance_section : "none",
      finance_payment_status: form.is_finance_member ? form.finance_payment_status : "unpaid",
      finance_payment_method: form.finance_payment_method.trim(),
      finance_account_ref: form.finance_account_ref.trim(),
      finance_notes: form.finance_notes.trim(),
      program: form.program.trim(),
      status: form.status,
      joined_date: form.joined_date ? new Date(form.joined_date) : new Date(),
    };
    if (form.is_finance_member && form.finance_monthly_fee !== "") {
      const n = Number(form.finance_monthly_fee);
      payload.finance_monthly_fee = Number.isFinite(n) ? n : null;
    } else {
      payload.finance_monthly_fee = null;
    }
    if (!form.is_finance_member) {
      payload.finance_monthly_fee = null;
      payload.finance_payment_method = "";
      payload.finance_account_ref = "";
      payload.finance_notes = "";
    }
    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!form.phone.trim()) {
      setError("Phone is required.");
      return;
    }
    if (!isEdit && !form.email.trim()) {
      setError("Email is required. A member login is created and credentials are emailed automatically.");
      return;
    }
    if (form.is_finance_member && !["members", "sports"].includes(form.finance_section)) {
      setError("Select a finance section: Members finance or Sports finance.");
      return;
    }
    setSaving(true);
    try {
      const payload = buildPayload();
      if (isEdit) {
        await membersApi.update(id, payload);
        navigate("/admin/members/all");
      } else {
        const data = await membersApi.create(payload);
        if (import.meta.env.DEV && (data.portal?.temporaryPassword || data.portal?.etherealPreviewUrl)) {
          console.info(
            "[SYADA portal] New member (browser console)",
            "\n  Email:",
            data.email,
            data.portal?.temporaryPassword ? `\n  Password: ${data.portal.temporaryPassword}` : "",
            `\n  Login: ${data.portal?.loginUrl || ""}`,
            data.portal?.etherealPreviewUrl ? `\n  Ethereal: ${data.portal.etherealPreviewUrl}` : ""
          );
        }
        navigate("/admin/members/all", { state: { portalNotice: data.portal || null } });
      }
    } catch (err) {
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-2 text-gray-500">
        <Loader2 className="animate-spin" size={22} />
        Loading…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl pb-16 font-sans text-gray-800">
      <div className="mb-8">
        <Link
          to="/admin/members/all"
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"
        >
          <ArrowLeft size={16} />
          Back to directory
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {isEdit ? "Update member" : "Register member"}
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Complete the profile. Finance fields appear only when the member is marked as a finance member.
          {!isEdit && (
            <span className="mt-1 block text-gray-600">
              New members: <strong className="font-semibold">email is required</strong> — a portal login is created and
              a temporary password is sent to that address (configure SMTP in the API <code className="text-xs">.env</code>{" "}
              if mail is not sending).
            </span>
          )}
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <section>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-brand">Identity</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-gray-500">Full name *</label>
              <input
                required
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none ring-brand/0 transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                placeholder="Full name"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-500">
                Email {!isEdit ? "*" : "(optional)"}
              </label>
              <input
                type="email"
                required={!isEdit}
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                placeholder="name@example.com"
              />
              {!isEdit && (
                <p className="mt-1 text-[11px] text-gray-400">Used for member sign-in; credentials are emailed here.</p>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-500">Phone *</label>
              <input
                required
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                placeholder="+252 …"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-gray-500">Address</label>
              <textarea
                rows={2}
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                placeholder="City, district, …"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-500">Title / role</label>
              <input
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                placeholder="e.g. Volunteer, Coordinator"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-500">Blood type</label>
              <select
                value={form.blood_type}
                onChange={(e) => set("blood_type", e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              >
                {BLOOD_TYPES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-500">Program (optional)</label>
              <input
                value={form.program}
                onChange={(e) => set("program", e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                placeholder="Program or chapter"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-500">Status</label>
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
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
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-brand">Picture</h2>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-semibold text-gray-500">Image URL (optional)</label>
              <input
                value={(form.picture || "").startsWith("data:") ? "" : form.picture}
                onChange={(e) => set("picture", e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                placeholder="https://…"
              />
              <p className="mt-1 text-[11px] text-gray-400">Or upload a file below (replaces URL).</p>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-500">Upload</label>
              <input
                type="file"
                accept="image/*"
                onChange={onPictureFile}
                className="w-full max-w-xs text-xs text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-soft file:px-3 file:py-2 file:text-xs file:font-semibold file:text-brand"
              />
            </div>
          </div>
          {form.picture && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold text-gray-500">Preview</p>
              <img
                src={form.picture}
                alt=""
                className="h-24 w-24 rounded-2xl border border-gray-100 object-cover"
              />
            </div>
          )}
        </section>

        <section className="rounded-xl border border-brand/15 bg-brand-soft/40 p-5">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={form.is_finance_member}
              onChange={(e) => set("is_finance_member", e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
            />
            <div>
              <span className="flex items-center gap-2 text-sm font-bold text-gray-900">
                <Wallet size={16} className="text-brand" />
                Finance member
              </span>
              <p className="mt-1 text-xs text-gray-600">
                Check this if the member belongs to the finance circle (contributions, fees, treasury).
              </p>
            </div>
          </label>

          {form.is_finance_member && (
            <div className="mt-6 grid gap-4 border-t border-brand/10 pt-6 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-500">Finance section *</label>
                <select
                  value={form.finance_section}
                  onChange={(e) => set("finance_section", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                >
                  <option value="members">Members finance (general org)</option>
                  <option value="sports">Sports finance (sports program)</option>
                </select>
                <p className="mt-1 text-[11px] text-gray-500">Assign fees to the correct sub-ledger in Financials.</p>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-500">Payment status</label>
                <select
                  value={form.finance_payment_status}
                  onChange={(e) => set("finance_payment_status", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                >
                  <option value="unpaid">Unpaid</option>
                  <option value="partial">Partial</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-500">Monthly fee / contribution</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.finance_monthly_fee}
                  onChange={(e) => set("finance_monthly_fee", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-500">Payment method</label>
                <select
                  value={form.finance_payment_method}
                  onChange={(e) => set("finance_payment_method", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                >
                  <option value="">Select…</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank">Bank transfer</option>
                  <option value="EVC Plus">EVC Plus</option>
                  <option value="Zaad">Zaad</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-gray-500">Account / reference</label>
                <input
                  value={form.finance_account_ref}
                  onChange={(e) => set("finance_account_ref", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  placeholder="Account name, mobile wallet ID, …"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-gray-500">Finance notes</label>
                <textarea
                  rows={2}
                  value={form.finance_notes}
                  onChange={(e) => set("finance_notes", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  placeholder="Internal notes"
                />
              </div>
            </div>
          )}
        </section>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-gray-100 pt-6">
          <Link
            to="/admin/members/all"
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:opacity-60"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {isEdit ? "Save changes" : "Register member"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MemberFormPage;
