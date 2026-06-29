import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Download } from "lucide-react";
import { candidates } from "@/lib/mock-data";
import { Pill, StatusPill, scoreTone } from "@/components/ui-rq";
import { PageHeader } from "./recruiter.dashboard";

export const Route = createFileRoute("/recruiter/dashboard/database")({
  component: DatabaseView,
});

function DatabaseView() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return candidates;
    return candidates.filter(
      (c) =>
        c.name.toLowerCase().includes(needle) ||
        c.email.toLowerCase().includes(needle) ||
        c.role.toLowerCase().includes(needle),
    );
  }, [q]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const start = (page - 1) * pageSize;
  const visible = filtered.slice(start, start + pageSize);

  return (
    <>
      <PageHeader
        title="Resume Database"
        actions={
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              color: "var(--muted)",
            }}
          >
            {candidates.length.toLocaleString()} candidates
          </span>
        }
      />

      <div style={{ position: "relative", marginBottom: 12 }}>
        <Search
          size={16}
          style={{
            position: "absolute",
            left: 14,
            top: 14,
            color: "var(--muted)",
          }}
        />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          placeholder="Search by name, email, or skill…"
          style={{
            width: "100%",
            height: 44,
            padding: "0 16px 0 40px",
            border: "1px solid var(--border)",
            borderRadius: 6,
            backgroundColor: "var(--panel)",
            fontSize: 14,
            outline: "none",
          }}
        />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {["Job", "Status", "Score", "Source", "Date"].map((f) => (
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
        <button
          style={{
            height: 36,
            padding: "0 14px",
            border: "1px solid var(--border)",
            borderRadius: 6,
            backgroundColor: "var(--panel)",
            fontSize: 13,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            marginLeft: "auto",
          }}
        >
          <Download size={14} />
          Export
        </button>
      </div>

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
            gridTemplateColumns: "48px 1fr 80px 1fr 140px 120px",
            gap: 16,
            padding: "10px 16px",
            borderBottom: "1px solid var(--border)",
            fontFamily: "var(--font-sans)",
            fontWeight: 600,
            fontSize: 12,
            color: "var(--muted)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          <span>#</span>
          <span>Name</span>
          <span>Score</span>
          <span>Job</span>
          <span>Status</span>
          <span>Source</span>
        </div>
        {visible.map((c, i) => (
          <div
            key={c.id}
            className="grid"
            style={{
              gridTemplateColumns: "48px 1fr 80px 1fr 140px 120px",
              gap: 16,
              padding: "0 16px",
              height: 52,
              alignItems: "center",
              borderBottom: "1px solid var(--border)",
              fontFamily: "var(--font-sans)",
              fontSize: 14,
            }}
          >
            <span style={{ fontFamily: "var(--font-mono)", color: "var(--muted)" }}>
              {start + i + 1}
            </span>
            <span style={{ color: "var(--ink)" }}>{c.name}</span>
            <Pill tone={scoreTone(c.score)}>{c.score}</Pill>
            <span style={{ color: "var(--muted)" }}>{c.jobTitle}</span>
            <StatusPill status={c.status} />
            <span style={{ color: "var(--muted)" }}>{c.source}</span>
          </div>
        ))}
        {visible.length === 0 && (
          <p
            style={{
              padding: 32,
              textAlign: "center",
              color: "var(--muted)",
              fontFamily: "var(--font-sans)",
            }}
          >
            No candidates match your search.
          </p>
        )}
      </div>

      <div
        className="mt-4 flex items-center justify-between"
        style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--muted)" }}
      >
        <span>
          Showing {start + 1}–{Math.min(start + pageSize, filtered.length)} of {filtered.length}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            style={pagerBtn(page === 1)}
          >
            ← Prev
          </button>
          <span style={{ fontFamily: "var(--font-mono)" }}>
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            style={pagerBtn(page === totalPages)}
          >
            Next →
          </button>
        </div>
      </div>
    </>
  );
}

function pagerBtn(disabled: boolean): React.CSSProperties {
  return {
    height: 32,
    padding: "0 12px",
    border: "1px solid var(--border)",
    borderRadius: 6,
    backgroundColor: "var(--panel)",
    color: disabled ? "var(--muted)" : "var(--ink)",
    fontSize: 13,
    cursor: disabled ? "default" : "pointer",
    opacity: disabled ? 0.5 : 1,
  };
}
