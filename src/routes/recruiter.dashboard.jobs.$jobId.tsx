import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, MoreHorizontal, X, Star, Check } from "lucide-react";
import { getJob, getCandidatesForJob, type Candidate } from "@/lib/mock-data";
import { Button, Pill, ScoreBar, StatusPill, scoreColor } from "@/components/ui-rq";

export const Route = createFileRoute("/recruiter/dashboard/jobs/$jobId")({
  loader: ({ params }) => {
    const job = getJob(params.jobId);
    if (!job) throw notFound();
    const candidates: Candidate[] = getCandidatesForJob(params.jobId);
    return { job, candidates };
  },
  notFoundComponent: () => <p style={{ padding: 32 }}>Job not found.</p>,
  errorComponent: ({ error }) => (
    <p style={{ padding: 32, color: "var(--signal-red)" }}>{error.message}</p>
  ),
  component: JobDetail,
});

type Tab = "shortlist" | "all" | "analytics" | "settings";

function JobDetail() {
  const { job, candidates } = Route.useLoaderData() as { job: ReturnType<typeof getJob> & {}; candidates: Candidate[] };
  const [tab, setTab] = useState<Tab>("shortlist");
  const [selected, setSelected] = useState<Candidate | null>(null);

  const filtered = useMemo(() => {
    if (tab === "shortlist") {
      return candidates.filter(
        (c) => c.status === "shortlisted" || c.status === "priority",
      );
    }
    if (tab === "all") return candidates;
    return [];
  }, [tab, candidates]);

  return (
    <>
      <div className="mb-6 flex items-center gap-4">
        <Link
          to="/recruiter/dashboard/jobs"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            color: "var(--muted)",
          }}
        >
          ← Back to Jobs
        </Link>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: 22,
            color: "var(--ink)",
          }}
        >
          {job.title}
        </h1>
        <Pill tone="green">● {job.status}</Pill>
        <div className="ml-auto">
          <button
            aria-label="More actions"
            style={{
              width: 32,
              height: 32,
              border: "1px solid var(--border)",
              borderRadius: 6,
              background: "var(--panel)",
              color: "var(--muted)",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      <div
        className="mb-6 flex gap-1 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        {[
          ["shortlist", "Shortlist"],
          ["all", "All Candidates"],
          ["analytics", "Analytics"],
          ["settings", "Settings"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key as Tab)}
            style={{
              padding: "10px 16px",
              border: "none",
              background: "transparent",
              fontFamily: "var(--font-sans)",
              fontWeight: 500,
              fontSize: 14,
              color: tab === key ? "var(--accent)" : "var(--muted)",
              borderBottom: `2px solid ${tab === key ? "var(--accent)" : "transparent"}`,
              cursor: "pointer",
              marginBottom: -1,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 13,
          color: "var(--muted)",
          marginBottom: 16,
        }}
      >
        {job.received.toLocaleString()} processed · {job.shortlisted} shortlisted · Cutoff: {job.cutoff}/100
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        <input
          placeholder="Search candidates…"
          style={{
            flex: 1,
            minWidth: 240,
            height: 36,
            padding: "0 12px",
            border: "1px solid var(--border)",
            borderRadius: 6,
            backgroundColor: "var(--panel)",
            fontSize: 13,
            outline: "none",
          }}
        />
        {["Skills", "Experience", "Source"].map((f) => (
          <select
            key={f}
            style={{
              height: 36,
              padding: "0 12px",
              border: "1px solid var(--border)",
              borderRadius: 6,
              backgroundColor: "var(--panel)",
              fontSize: 13,
            }}
          >
            <option>{f}</option>
          </select>
        ))}
        <Button variant="outlined" size="sm">
          <Download size={14} />
          Export CSV
        </Button>
      </div>

      {tab === "analytics" ? (
        <p style={{ color: "var(--muted)", fontFamily: "var(--font-sans)", fontSize: 14 }}>
          See the global Analytics page for per-job breakdowns.
        </p>
      ) : tab === "settings" ? (
        <p style={{ color: "var(--muted)", fontFamily: "var(--font-sans)", fontSize: 14 }}>
          Job settings editor — opens the side panel from the Jobs page.
        </p>
      ) : (
        <div
          style={{
            backgroundColor: "var(--panel)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <div
            className="grid"
            style={{
              gridTemplateColumns: "48px 1fr 220px 120px 80px 120px",
              padding: "10px 16px",
              borderBottom: "1px solid var(--border)",
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              fontSize: 12,
              color: "var(--muted)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              gap: 16,
            }}
          >
            <span>#</span>
            <span>Name</span>
            <span>Score</span>
            <span>Role</span>
            <span>Exp</span>
            {tab === "all" && <span>Status</span>}
          </div>
          {filtered.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setSelected(c)}
              className="grid w-full text-left"
              style={{
                gridTemplateColumns: "48px 1fr 220px 120px 80px 120px",
                gap: 16,
                padding: "0 16px",
                height: 52,
                alignItems: "center",
                borderBottom: "1px solid var(--border)",
                background: selected?.id === c.id ? "#F7F9FF" : "var(--panel)",
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
                fontSize: 14,
                color: "var(--ink)",
                border: "none",
                borderBlockEnd: "1px solid var(--border)",
                transition: "background-color 120ms ease-out",
              }}
            >
              <span style={{ fontFamily: "var(--font-mono)", color: "var(--muted)" }}>
                {i + 1}
              </span>
              <span>{c.name}</span>
              <ScoreBar value={c.score} animate={false} />
              <span style={{ color: "var(--muted)" }}>{c.role}</span>
              <span style={{ fontFamily: "var(--font-mono)" }}>{c.experienceYears} yrs</span>
              {tab === "all" && <StatusPill status={c.status} />}
            </button>
          ))}
          {filtered.length === 0 && (
            <p style={{ padding: 32, textAlign: "center", color: "var(--muted)" }}>
              No candidates yet.
            </p>
          )}
        </div>
      )}

      {selected && <CandidatePanel candidate={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

function CandidatePanel({
  candidate,
  onClose,
}: {
  candidate: Candidate;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<Candidate["status"]>(candidate.status);

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
          width: 480,
          backgroundColor: "var(--panel)",
          boxShadow: "var(--shadow-elevated)",
          zIndex: 50,
          overflowY: "auto",
          animation: "rq-slide-in 200ms ease-out",
        }}
      >
        <div
          style={{
            padding: 24,
            borderBottom: "1px solid var(--border)",
            position: "sticky",
            top: 0,
            backgroundColor: "var(--panel)",
            zIndex: 1,
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: 20,
                  color: "var(--ink)",
                }}
              >
                {candidate.name}
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 13,
                  color: "var(--muted)",
                  marginTop: 4,
                }}
              >
                {candidate.email} · {candidate.phone}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 12,
                  color: "var(--muted)",
                  marginTop: 4,
                }}
              >
                Applied: {candidate.jobTitle} · Received {candidate.receivedAt}
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                background: "transparent",
                border: "none",
                color: "var(--muted)",
                cursor: "pointer",
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div style={{ padding: 24, borderBottom: "1px solid var(--border)" }}>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              fontSize: 12,
              color: "var(--muted)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Score
          </p>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              fontSize: 40,
              color: "var(--ink)",
              lineHeight: 1.1,
              marginTop: 6,
            }}
          >
            {candidate.score} <span style={{ color: "var(--muted)", fontSize: 24 }}>/ 100</span>
          </p>

          <div style={{ marginTop: 20 }}>
            {(["skills", "experience", "education", "semantic"] as const).map((k, i) => {
              const val = candidate.breakdown[k];
              const colors = ["#2563EB", "#7C3AED", "#0891B2", "#059669"];
              return (
                <div key={k} style={{ marginBottom: 10 }}>
                  <div
                    className="flex items-center justify-between"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 13,
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ color: "var(--ink)", textTransform: "capitalize" }}>
                      {k === "semantic" ? "Semantic fit" : k}
                    </span>
                    <span style={{ fontFamily: "var(--font-mono)", color: "var(--muted)" }}>
                      {val}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: 6,
                      borderRadius: 999,
                      backgroundColor: "var(--border)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${val}%`,
                        height: "100%",
                        backgroundColor: colors[i],
                        borderRadius: 999,
                        transition: "width 600ms ease-out",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Section title="AI summary">
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 14,
              color: "var(--ink)",
              lineHeight: 1.6,
            }}
          >
            {candidate.summary}
          </p>
        </Section>

        <Section title="Skills matched">
          <div className="flex flex-wrap gap-2">
            {candidate.matched.map((s) => (
              <Pill key={s} tone="green">
                ✓ {s}
              </Pill>
            ))}
          </div>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              fontSize: 12,
              color: "var(--muted)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginTop: 16,
              marginBottom: 8,
            }}
          >
            Skills missing
          </p>
          <div className="flex flex-wrap gap-2">
            {candidate.missing.map((s) => (
              <Pill key={s} tone="red">
                ✗ {s}
              </Pill>
            ))}
          </div>
        </Section>

        <Section title="">
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--muted)" }}>
            Source: {candidate.source} · Parsed in {(candidate.parseMs / 1000).toFixed(1)}s
          </p>
          <button
            style={{
              marginTop: 10,
              background: "transparent",
              border: "1px solid var(--border)",
              borderRadius: 6,
              padding: "8px 14px",
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              color: "var(--ink)",
              cursor: "pointer",
            }}
          >
            ↓ Download resume
          </button>
        </Section>

        <div style={{ padding: 24, display: "flex", gap: 8 }}>
          <ActionButton
            tone="green"
            active={status === "shortlisted"}
            onClick={() => setStatus("shortlisted")}
          >
            <Check size={14} />
            {status === "shortlisted" ? "Shortlisted" : "Shortlist"}
          </ActionButton>
          <ActionButton
            tone="red"
            active={status === "rejected"}
            onClick={() => setStatus("rejected")}
          >
            <X size={14} />
            {status === "rejected" ? "Rejected" : "Reject"}
          </ActionButton>
          <ActionButton
            tone="blue"
            active={status === "priority"}
            onClick={() => setStatus("priority")}
          >
            <Star size={14} />
            {status === "priority" ? "Priority" : "Priority"}
          </ActionButton>
        </div>
      </aside>
      <style>{`
        @keyframes rq-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes rq-slide-in { from { transform: translateX(100%) } to { transform: translateX(0) } }
      `}</style>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: 24, borderBottom: "1px solid var(--border)" }}>
      {title && (
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 600,
            fontSize: 12,
            color: "var(--muted)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: 8,
          }}
        >
          {title}
        </p>
      )}
      {children}
    </div>
  );
}

function ActionButton({
  tone,
  active,
  onClick,
  children,
}: {
  tone: "green" | "red" | "blue";
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const colors = {
    green: "var(--signal-green)",
    red: "var(--signal-red)",
    blue: "var(--accent)",
  } as const;
  const color = colors[tone];
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        height: 36,
        borderRadius: 6,
        border: `1px solid ${color}`,
        backgroundColor: active ? color : "transparent",
        color: active ? "#ffffff" : color,
        fontFamily: "var(--font-sans)",
        fontWeight: 500,
        fontSize: 13,
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        transition: "background-color 150ms ease-out, color 150ms ease-out",
      }}
    >
      {children}
    </button>
  );
}
