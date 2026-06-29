import { createFileRoute } from "@tanstack/react-router";
import { Button, Input, Label, Panel } from "@/components/ui-rq";
import { PageHeader } from "./recruiter.dashboard";

export const Route = createFileRoute("/recruiter/dashboard/settings")({
  component: SettingsView,
});

function SettingsView() {
  return (
    <>
      <PageHeader title="Account settings" />

      <Panel style={{ marginBottom: 16 }}>
        <Section title="Company">
          <Label>Company name</Label>
          <Input defaultValue="Acme Corp" />
          <div style={{ height: 16 }} />
          <Label>Company logo</Label>
          <div className="flex items-center gap-4">
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 10,
                backgroundColor: "var(--accent-dim)",
                color: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 22,
              }}
            >
              A
            </div>
            <Button variant="outlined" size="sm">
              Upload new logo
            </Button>
          </div>
        </Section>
      </Panel>

      <Panel style={{ marginBottom: 16 }}>
        <Section title="Change password">
          <Label>Current password</Label>
          <Input type="password" />
          <div style={{ height: 12 }} />
          <Label>New password</Label>
          <Input type="password" />
          <div style={{ height: 12 }} />
          <Label>Confirm password</Label>
          <Input type="password" />
          <div style={{ height: 16 }} />
          <Button>Update password</Button>
        </Section>
      </Panel>

      <Panel style={{ marginBottom: 16 }}>
        <Section title="Team members">
          {[
            { email: "recruiter@acmecorp.com", role: "Admin" },
            { email: "hiring@acmecorp.com", role: "Member" },
          ].map((m) => (
            <div
              key={m.email}
              className="flex items-center justify-between"
              style={{
                padding: "10px 0",
                borderBottom: "1px solid var(--border)",
                fontFamily: "var(--font-sans)",
                fontSize: 14,
              }}
            >
              <span>{m.email}</span>
              <div className="flex items-center gap-4">
                <span style={{ color: "var(--muted)" }}>{m.role}</span>
                <button
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--muted)",
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div style={{ height: 12 }} />
          <Button variant="outlined" size="sm">
            + Invite team member
          </Button>
        </Section>
      </Panel>

      <Panel
        style={{
          borderColor: "var(--signal-red-dim)",
          backgroundColor: "var(--panel)",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: 16,
            color: "var(--signal-red)",
          }}
        >
          Danger zone
        </h3>
        <p
          style={{
            marginTop: 4,
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            color: "var(--muted)",
          }}
        >
          Delete all candidate data for this company. This cannot be undone.
        </p>
        <div style={{ height: 12 }} />
        <Button variant="danger" size="sm">
          Delete all data
        </Button>
      </Panel>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: 16,
          color: "var(--ink)",
          marginBottom: 16,
        }}
      >
        {title}
      </h3>
      {children}
    </>
  );
}
