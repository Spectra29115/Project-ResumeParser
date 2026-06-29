import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, MoreHorizontal } from "lucide-react";
import { jobs } from "@/lib/mock-data";
import { Button, Panel, Pill } from "@/components/ui-rq";
import { PageHeader } from "./recruiter.dashboard";

export const Route = createFileRoute("/recruiter/dashboard/jobs")({
  component: JobsView,
});

function JobsView() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <PageHeader
        title="Jobs"
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus size={16} />
            New job
          </Button>
        }
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 20,
        }}
      >
        {jobs.map((job) => (
          <Panel key={job.id}>
            <div style={{ marginBottom: 12 }}>
              <Pill
                tone={
                  job.status === "Active"
                    ? "green"
                    : job.status === "Paused"
                    ? "amber"
                    : "grey"
                }
              >
                ● {job.status}
              </Pill>
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 16,
                color: "var(--ink)",
              }}
            >
              {job.title}
            </h2>
            <p
              style={{
                marginTop: 4,
                fontFamily: "var(--font-sans)",
                fontSize: 12,
                color: "var(--muted)",
              }}
            >
              Posted {job.postedAt}
            </p>

            <div style={{ marginTop: 16, marginBottom: 12 }}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  color: "var(--ink)",
                }}
              >
                {job.received.toLocaleString()} received
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  color: "var(--ink)",
                }}
              >
                {job.shortlisted} shortlisted
              </div>
            </div>

            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 12,
                color: "var(--muted)",
                marginBottom: 16,
              }}
            >
              Score cutoff: {job.cutoff}
            </p>

            <div className="flex items-center gap-2">
              <Link
                to="/recruiter/dashboard/jobs/$jobId"
                params={{ jobId: job.id }}
                style={{
                  flex: 1,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 32,
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  fontFamily: "var(--font-sans)",
                  fontWeight: 500,
                  fontSize: 13,
                  color: "var(--ink)",
                  backgroundColor: "var(--panel)",
                }}
              >
                Open
              </Link>
              <button
                aria-label="More actions"
                style={{
                  width: 32,
                  height: 32,
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  background: "var(--panel)",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--muted)",
                }}
              >
                <MoreHorizontal size={16} />
              </button>
            </div>
          </Panel>
        ))}
      </div>

      {open && <NewJobPanel onClose={() => setOpen(false)} />}
    </>
  );
}

function NewJobPanel({ onClose }: { onClose: () => void }) {
  const [weights, setWeights] = useState({ skills: 40, experience: 30, education: 20, semantic: 10 });
  const total = weights.skills + weights.experience + weights.education + weights.semantic;
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.3)",
          zIndex: 40,
          animation: "rq-fade 180ms ease-out",
        }}
      />
      <aside
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: 520,
          backgroundColor: "var(--panel)",
          boxShadow: "var(--shadow-elevated)",
          zIndex: 50,
          overflowY: "auto",
          animation: "rq-slide-in 200ms ease-out",
        }}
      >
        <div
          className="flex items-center justify-between"
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border)",
            position: "sticky",
            top: 0,
            backgroundColor: "var(--panel)",
            zIndex: 1,
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: 20,
              color: "var(--ink)",
            }}
          >
            New job posting
          </h2>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              color: "var(--muted)",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            ✕ Close
          </button>
        </div>

        <div style={{ padding: 24 }}>
          <Field label="Job title *">
            <input
              style={inputStyle}
              placeholder="e.g. Senior ML Engineer"
            />
          </Field>

          <Field label="Paste job description">
            <textarea rows={5} style={{ ...inputStyle, height: "auto", padding: 12, resize: "vertical" }} />
            <button style={{ ...inputStyle, marginTop: 8, color: "var(--accent)", cursor: "pointer", textAlign: "left", paddingLeft: 12 }}>
              ↓ Auto-extract requirements
            </button>
          </Field>

          <Field label="Hard requirements (must-have)">
            <ChipList initial={["Min. 3 years experience", "Python, TensorFlow"]} />
          </Field>

          <Field label="Preferred skills (nice-to-have)">
            <ChipList initial={["Kubernetes"]} />
          </Field>

          <Field label="Disqualifiers">
            <ChipList initial={["Less than 2 years experience"]} />
          </Field>

          <Field label={`Scoring weights (must total 100%) — currently ${total}%`}>
            {(Object.keys(weights) as Array<keyof typeof weights>).map((k) => (
              <div key={k} style={{ marginBottom: 12 }}>
                <div
                  className="flex items-center justify-between"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 13,
                    color: "var(--ink)",
                    marginBottom: 4,
                  }}
                >
                  <span style={{ textTransform: "capitalize" }}>{k === "semantic" ? "Semantic fit" : k}</span>
                  <span style={{ fontFamily: "var(--font-mono)" }}>{weights[k]}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={weights[k]}
                  onChange={(e) =>
                    setWeights({ ...weights, [k]: Number(e.target.value) })
                  }
                  style={{ width: "100%", accentColor: "var(--accent)" }}
                />
              </div>
            ))}
            {total !== 100 && (
              <p style={{ color: "var(--signal-red)", fontSize: 12, fontFamily: "var(--font-sans)" }}>
                Total: {total}% — must equal 100%
              </p>
            )}
          </Field>

          <Field label="Shortlist cutoff score">
            <div className="flex items-center gap-2" style={{ fontFamily: "var(--font-sans)", fontSize: 14 }}>
              Candidates above
              <input defaultValue="75" style={{ ...inputStyle, width: 64, textAlign: "center" }} />
              / 100 are shortlisted
            </div>
          </Field>

          <Button fullWidth size="lg" style={{ marginTop: 8 }}>
            Save and activate job
          </Button>
        </div>
      </aside>
      <style>{`
        @keyframes rq-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes rq-slide-in { from { transform: translateX(100%) } to { transform: translateX(0) } }
      `}</style>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          fontFamily: "var(--font-sans)",
          fontWeight: 600,
          fontSize: 13,
          color: "var(--ink)",
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

function ChipList({ initial }: { initial: string[] }) {
  const [items, setItems] = useState(initial);
  const [draft, setDraft] = useState("");
  return (
    <div>
      <div className="flex flex-col gap-2">
        {items.map((it, i) => (
          <div
            key={`${it}-${i}`}
            className="flex items-center justify-between"
            style={{
              padding: "8px 12px",
              border: "1px solid var(--border)",
              borderRadius: 6,
              backgroundColor: "var(--surface)",
              fontFamily: "var(--font-sans)",
              fontSize: 13,
            }}
          >
            <span>{it}</span>
            <button
              onClick={() => setItems(items.filter((_, j) => j !== i))}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--muted)",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add item…"
          style={{ ...inputStyle, flex: 1 }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && draft.trim()) {
              setItems([...items, draft.trim()]);
              setDraft("");
            }
          }}
        />
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 36,
  padding: "0 12px",
  border: "1px solid var(--border)",
  borderRadius: 6,
  fontFamily: "var(--font-sans)",
  fontSize: 14,
  backgroundColor: "var(--panel)",
  color: "var(--ink)",
  outline: "none",
};
