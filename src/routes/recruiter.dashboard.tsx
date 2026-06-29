import { createFileRoute, Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  Briefcase,
  Database,
  BarChart2,
  Plug,
  Bell,
  Settings as SettingsIcon,
} from "lucide-react";
import type { ReactNode } from "react";

export const Route = createFileRoute("/recruiter/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — RecruitIQ" },
      { name: "description", content: "Manage jobs, candidates, and integrations." },
    ],
  }),
  component: DashboardShell,
});

const NAV = [
  { to: "/recruiter/dashboard/jobs", label: "Jobs", icon: Briefcase },
  { to: "/recruiter/dashboard/database", label: "Resume Database", icon: Database },
  { to: "/recruiter/dashboard/analytics", label: "Analytics", icon: BarChart2 },
  { to: "/recruiter/dashboard/integrations", label: "Integrations", icon: Plug },
  { to: "/recruiter/dashboard/notifications", label: "Notifications", icon: Bell },
  { to: "/recruiter/dashboard/settings", label: "Settings", icon: SettingsIcon },
] as const;

function DashboardShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--surface)" }}>
      <aside
        className="fixed left-0 top-0 flex h-screen flex-col"
        style={{
          width: 240,
          backgroundColor: "var(--panel)",
          borderRight: "1px solid var(--border)",
        }}
      >
        <div
          className="flex h-14 items-center px-6"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <Link
            to="/"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: 16,
              color: "var(--ink)",
            }}
          >
            RecruitIQ
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-[10px]"
                style={{
                  height: 36,
                  padding: "0 16px",
                  borderRadius: 6,
                  fontFamily: "var(--font-sans)",
                  fontWeight: 500,
                  fontSize: 14,
                  marginBottom: 2,
                  color: active ? "var(--accent)" : "var(--muted)",
                  backgroundColor: active ? "var(--accent-dim)" : "transparent",
                  transition: "background-color 120ms ease-out, color 120ms ease-out",
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="flex items-center gap-3">
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 999,
                backgroundColor: "var(--accent-dim)",
                color: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              R
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 500,
                  fontSize: 13,
                  color: "var(--ink)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                Recruiter
              </div>
              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 12,
                  color: "var(--muted)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                recruiter@acmecorp.com
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate({ to: "/" })}
            style={{
              marginTop: 10,
              border: "none",
              background: "transparent",
              color: "var(--muted)",
              fontFamily: "var(--font-sans)",
              fontSize: 12,
              cursor: "pointer",
              padding: 0,
            }}
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1" style={{ marginLeft: 240, padding: 32 }}>
        <Outlet />
      </main>
    </div>
  );
}

export function PageHeader({ title, actions }: { title: string; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: 24,
          color: "var(--ink)",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h1>
      {actions}
    </div>
  );
}
