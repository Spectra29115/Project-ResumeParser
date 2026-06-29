import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { X } from "lucide-react";
import { Button, Panel } from "@/components/ui-rq";
import { PageHeader } from "./recruiter.dashboard";

export const Route = createFileRoute("/recruiter/dashboard/notifications")({
  component: NotificationsView,
});

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      aria-pressed={on}
      style={{
        width: 44,
        height: 24,
        borderRadius: 999,
        border: "none",
        backgroundColor: on ? "var(--signal-green)" : "var(--border)",
        position: "relative",
        cursor: "pointer",
        transition: "background-color 150ms ease-out",
        padding: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 2,
          left: on ? 22 : 2,
          width: 20,
          height: 20,
          borderRadius: 999,
          backgroundColor: "#ffffff",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          transition: "left 150ms ease-out",
        }}
      />
    </button>
  );
}

function NotificationsView() {
  const [instant, setInstant] = useState(true);
  const [daily, setDaily] = useState(true);
  const [weekly, setWeekly] = useState(false);
  const [emails, setEmails] = useState(["recruiter@acmecorp.com", "hr-lead@acmecorp.com"]);
  const [draft, setDraft] = useState("");

  return (
    <>
      <PageHeader title="Notification settings" />

      <Panel style={{ marginBottom: 16 }}>
        <Header
          title="Instant email alert"
          subtitle="Send an email the moment a candidate is shortlisted."
          right={<Toggle on={instant} onChange={setInstant} />}
        />
        {instant && (
          <div
            style={{
              marginTop: 16,
              paddingTop: 16,
              borderTop: "1px solid var(--border)",
              fontFamily: "var(--font-sans)",
              fontSize: 14,
            }}
          >
            Notify when score is above{" "}
            <input
              defaultValue="75"
              style={{
                width: 64,
                height: 32,
                textAlign: "center",
                border: "1px solid var(--border)",
                borderRadius: 6,
                margin: "0 6px",
                fontFamily: "var(--font-mono)",
              }}
            />{" "}
            / 100
          </div>
        )}
      </Panel>

      <Panel style={{ marginBottom: 16 }}>
        <Header
          title="Daily digest"
          subtitle="A summary of the day's processed candidates."
          right={<Toggle on={daily} onChange={setDaily} />}
        />
        {daily && (
          <div
            style={{
              marginTop: 16,
              paddingTop: 16,
              borderTop: "1px solid var(--border)",
              display: "flex",
              gap: 12,
              fontFamily: "var(--font-sans)",
              fontSize: 14,
              alignItems: "center",
            }}
          >
            Send at{" "}
            <select style={selectStyle}>
              <option>09:00 AM</option>
              <option>10:00 AM</option>
              <option>06:00 PM</option>
            </select>
            <select style={selectStyle}>
              <option>IST (UTC+5:30)</option>
              <option>UTC</option>
              <option>EST</option>
            </select>
          </div>
        )}
      </Panel>

      <Panel style={{ marginBottom: 16 }}>
        <Header
          title="Weekly summary"
          subtitle="A roll-up email of every Monday morning."
          right={<Toggle on={weekly} onChange={setWeekly} />}
        />
      </Panel>

      <Panel style={{ marginBottom: 24 }}>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: 16,
            color: "var(--ink)",
            marginBottom: 12,
          }}
        >
          Notify these email addresses
        </h3>
        {emails.map((e, i) => (
          <div
            key={e}
            className="flex items-center justify-between"
            style={{
              padding: "10px 0",
              borderBottom: "1px solid var(--border)",
              fontFamily: "var(--font-sans)",
              fontSize: 14,
            }}
          >
            <span>{e}</span>
            <button
              onClick={() => setEmails(emails.filter((_, j) => j !== i))}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--muted)",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontSize: 13,
              }}
            >
              <X size={14} />
              Remove
            </button>
          </div>
        ))}
        <div className="mt-3 flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add email address…"
            style={{
              flex: 1,
              height: 36,
              padding: "0 12px",
              border: "1px solid var(--border)",
              borderRadius: 6,
              fontSize: 14,
              backgroundColor: "var(--panel)",
              outline: "none",
            }}
          />
          <Button
            size="sm"
            onClick={() => {
              if (draft.trim()) {
                setEmails([...emails, draft.trim()]);
                setDraft("");
              }
            }}
          >
            + Add
          </Button>
        </div>
      </Panel>

      <Button size="lg">Save notification settings</Button>
    </>
  );
}

function Header({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle: string;
  right: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: 16,
            color: "var(--ink)",
          }}
        >
          {title}
        </h3>
        <p
          style={{
            marginTop: 4,
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            color: "var(--muted)",
          }}
        >
          {subtitle}
        </p>
      </div>
      <div>{right}</div>
    </div>
  );
}

const selectStyle: React.CSSProperties = {
  height: 32,
  padding: "0 12px",
  border: "1px solid var(--border)",
  borderRadius: 6,
  fontSize: 13,
  backgroundColor: "var(--panel)",
};
