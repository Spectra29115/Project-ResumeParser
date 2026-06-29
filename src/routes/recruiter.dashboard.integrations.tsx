import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Inbox, Building2, Server, Boxes } from "lucide-react";
import { Button, Panel, Pill } from "@/components/ui-rq";
import { PageHeader } from "./recruiter.dashboard";

export const Route = createFileRoute("/recruiter/dashboard/integrations")({
  component: IntegrationsView,
});

interface Integration {
  id: string;
  name: string;
  icon: typeof Mail;
  status: "connected" | "not_connected" | "coming_soon";
  description?: string;
  lastSync?: string;
  received?: number;
  linkedJob?: string;
  webhookUrl?: string;
}

const initial: Integration[] = [
  {
    id: "gmail",
    name: "Gmail",
    icon: Mail,
    status: "connected",
    lastSync: "2 minutes ago",
    received: 2100,
    linkedJob: "Senior ML Engineer",
  },
  {
    id: "greenhouse",
    name: "Greenhouse",
    icon: Building2,
    status: "connected",
    received: 347,
    webhookUrl: "https://recruitiq.app/wh/gh/8f4b2c1e9d",
  },
  {
    id: "lever",
    name: "Lever",
    icon: Server,
    status: "not_connected",
    description: "Connect your Lever ATS to receive applications automatically.",
  },
  {
    id: "outlook",
    name: "Outlook",
    icon: Inbox,
    status: "not_connected",
  },
  {
    id: "bamboohr",
    name: "BambooHR",
    icon: Boxes,
    status: "coming_soon",
  },
];

function IntegrationsView() {
  const [items] = useState(initial);
  return (
    <>
      <PageHeader title="Integrations" />
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 14,
          color: "var(--muted)",
          marginTop: -16,
          marginBottom: 24,
        }}
      >
        Connect the sources where your resumes arrive.
      </p>

      <div className="flex flex-col gap-4">
        {items.map((it) => {
          const Icon = it.icon;
          const connected = it.status === "connected";
          return (
            <Panel
              key={it.id}
              style={{
                borderLeft: connected ? "3px solid var(--signal-green)" : undefined,
                padding: 20,
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4" style={{ flex: 1 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      backgroundColor: "var(--accent-dim)",
                      color: "var(--accent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="flex items-center gap-3">
                      <h3
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 600,
                          fontSize: 16,
                          color: "var(--ink)",
                        }}
                      >
                        {it.name}
                      </h3>
                      {it.status === "connected" && <Pill tone="green">● Connected</Pill>}
                      {it.status === "not_connected" && (
                        <Pill tone="grey">○ Not connected</Pill>
                      )}
                      {it.status === "coming_soon" && (
                        <Pill tone="grey">⋯ Coming soon</Pill>
                      )}
                    </div>

                    {it.lastSync && (
                      <p
                        style={{
                          marginTop: 6,
                          fontFamily: "var(--font-sans)",
                          fontSize: 13,
                          color: "var(--muted)",
                        }}
                      >
                        Last sync: {it.lastSync} ·{" "}
                        {it.received?.toLocaleString()} resumes received
                      </p>
                    )}
                    {it.webhookUrl && (
                      <p
                        style={{
                          marginTop: 6,
                          fontFamily: "var(--font-sans)",
                          fontSize: 13,
                          color: "var(--muted)",
                        }}
                      >
                        Real-time webhook · {it.received?.toLocaleString()} resumes received
                      </p>
                    )}
                    {it.linkedJob && (
                      <p
                        style={{
                          marginTop: 4,
                          fontFamily: "var(--font-sans)",
                          fontSize: 13,
                          color: "var(--muted)",
                        }}
                      >
                        Linked to: {it.linkedJob}
                      </p>
                    )}
                    {it.description && (
                      <p
                        style={{
                          marginTop: 6,
                          fontFamily: "var(--font-sans)",
                          fontSize: 13,
                          color: "var(--muted)",
                        }}
                      >
                        {it.description}
                      </p>
                    )}
                    {it.webhookUrl && (
                      <div
                        className="mt-3 flex items-center gap-2"
                        style={{
                          backgroundColor: "var(--surface)",
                          borderRadius: 6,
                          padding: "6px 10px",
                          fontFamily: "var(--font-mono)",
                          fontSize: 12,
                          color: "var(--ink)",
                          maxWidth: "fit-content",
                        }}
                      >
                        <span>{it.webhookUrl}</span>
                        <button
                          onClick={() => navigator.clipboard.writeText(it.webhookUrl!)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "var(--accent)",
                            cursor: "pointer",
                            fontSize: 11,
                          }}
                        >
                          Copy
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                {it.status === "connected" && (
                  <>
                    <Button variant="outlined" size="sm">
                      Disconnect
                    </Button>
                    {it.id === "gmail" && <Button size="sm">Sync now</Button>}
                  </>
                )}
                {it.status === "not_connected" && <Button size="sm">Connect {it.name}</Button>}
              </div>
            </Panel>
          );
        })}
      </div>
    </>
  );
}
