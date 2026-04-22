import React from "react";
import { Outlet, Navigate, useNavigate, Link } from "react-router-dom";
import { LogOut, User } from "lucide-react";

function parseUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

const STAFF = new Set(["super_admin", "manager", "editor"]);

const PortalLayout = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;

  const user = parseUser();
  if (user?.role && STAFF.has(user.role)) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  if (user?.role !== "member") {
    return <Navigate to="/login" replace />;
  }

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans text-gray-800">
      <header className="border-b border-gray-100 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <User size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand">SYADA — Member</p>
              <p className="truncate text-sm font-bold text-gray-900">{user?.full_name || "Member"}</p>
              <p className="truncate text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              to="/"
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 sm:text-sm"
            >
              Public site
            </Link>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-3 py-2 text-xs font-semibold text-white hover:bg-gray-800 sm:text-sm"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
};

export default PortalLayout;
