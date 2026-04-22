import React from "react";
import { Link } from "react-router-dom";
import { Wallet, FileText, Users, UserPlus, LayoutDashboard, ExternalLink } from "lucide-react";

const cards = [
  {
    title: "Financials",
    description: "Income, expenses, and ledger entries from your database.",
    to: "/admin/finance",
    icon: Wallet,
  },
  {
    title: "Reports & activity",
    description: "Filed reports plus a live feed of finance and report events.",
    to: "/admin/reports",
    icon: FileText,
  },
  {
    title: "Member directory",
    description: "All members stored in the system.",
    to: "/admin/members",
    icon: Users,
  },
  {
    title: "Register member",
    description: "Add a new member record.",
    to: "/admin/members/new",
    icon: UserPlus,
  },
  {
    title: "Dashboard",
    description: "Admin overview.",
    to: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Public site",
    description: "Open the public homepage in a new tab.",
    to: "/",
    external: true,
    icon: ExternalLink,
  },
];

const Resources = () => (
  <div className="min-h-screen bg-[#F9FAFB] p-8 font-sans">
    <header className="mb-8">
      <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-brand">Admin</p>
      <h1 className="text-3xl font-extrabold text-gray-900">Resources</h1>
      <p className="mt-2 max-w-2xl text-sm text-gray-500">
        Shortcuts to real areas of the app. Data shown on Finance and Reports comes from your API and database, not
        placeholder seed rows (unless you enable <code className="rounded bg-gray-100 px-1 text-xs">SEED_DEMO_DATA</code>{" "}
        on the server).
      </p>
    </header>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cards.map(({ title, description, to, icon: Icon, external }) =>
        external ? (
          <a
            key={title}
            href={to}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:border-brand/30 hover:shadow-md"
          >
            <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-gray-50 text-brand group-hover:bg-brand-soft">
              <Icon size={22} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            <p className="mt-2 flex-1 text-sm text-gray-500">{description}</p>
            <span className="mt-4 text-xs font-bold text-brand">Open ↗</span>
          </a>
        ) : (
          <Link
            key={title}
            to={to}
            className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:border-brand/30 hover:shadow-md"
          >
            <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-gray-50 text-brand group-hover:bg-brand-soft">
              <Icon size={22} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            <p className="mt-2 flex-1 text-sm text-gray-500">{description}</p>
            <span className="mt-4 text-xs font-bold text-brand">Go →</span>
          </Link>
        )
      )}
    </div>
  </div>
);

export default Resources;
