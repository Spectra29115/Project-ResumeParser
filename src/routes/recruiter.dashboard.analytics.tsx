import { createFileRoute } from "@tanstack/react-router";
import { jobs, candidates } from "@/lib/mock-data";
import { Panel } from "@/components/ui-rq";
import { PageHeader } from "./recruiter.dashboard";

export const Route = createFileRoute("/recruiter/dashboard/analytics")({
  component: AnalyticsView,
});

function AnalyticsView() {
  const total = candidates.length;
  const shortlisted = candidates.filter(
    (c) => c.status === "shortlisted" || c.status === "priority",
  ).length;
  const avgScore = (candidates.reduce((s, c) => s + c.score, 0) / total).toFixed(1);
  const avgParse = (
    candidates.reduce((s, c) => s + c.parseMs, 0) /
    total /
    1000
  ).toFixed(1);

  const buckets = Array.from({ length: 10 }, (_, i) => {
    const min = i * 10;
    const max = min + 10;
    return {
      label: `${min}–${max}`,
      count: candidates.filter((c) => c.score >= min && c.score < max).length,
    };
  });
  const maxBucket = Math.max(...buckets.map((b) => b.count), 1);

  const sources = ["Gmail", "Platform", "Lever", "Greenhouse", "Outlook"].map((src) => ({
    src,
    count: candidates.filter((c) => c.source === src).length,
  }));
  const maxSrc = Math.max(...sources.map((s) => s.count), 1);

  return (
    <>
      <PageHeader
        title="Analytics"
        actions={
          <select
            style={{
              height: 36,
              padding: "0 12px",
              border: "1px solid var(--border)",
              borderRadius: 6,
              backgroundColor: "var(--panel)",
              fontSize: 13,
            }}
          >
            {jobs.map((j) => (
              <option key={j.id}>{j.title}</option>
            ))}
          </select>
        }
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 32,
        }}
      >
        <Stat number={total.toLocaleString()} label="received" />
        <Stat number={shortlisted.toLocaleString()} label="shortlisted" />
        <Stat number={avgScore} label="avg score" />
        <Stat number={`${avgParse}s`} label="avg parse" />
      </div>

      <Panel style={{ marginBottom: 24 }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: 16,
            color: "var(--ink)",
            marginBottom: 16,
          }}
        >
          Score distribution
        </h2>
        <div className="flex items-end gap-2" style={{ height: 160 }}>
          {buckets.map((b) => (
            <div key={b.label} className="flex-1 flex flex-col items-center gap-2">
              <div
                title={`${b.count} candidates`}
                style={{
                  width: "100%",
                  height: `${(b.count / maxBucket) * 130}px`,
                  backgroundColor: "var(--accent)",
                  borderRadius: "4px 4px 0 0",
                  transition: "height 400ms ease-out",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--muted)",
                }}
              >
                {b.label}
              </span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel style={{ marginBottom: 24 }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: 16,
            color: "var(--ink)",
            marginBottom: 16,
          }}
        >
          Applications by source
        </h2>
        {sources.map((s) => (
          <div key={s.src} className="flex items-center gap-3" style={{ marginBottom: 10 }}>
            <div style={{ width: 100, fontFamily: "var(--font-sans)", fontSize: 13 }}>
              {s.src}
            </div>
            <div
              style={{
                flex: 1,
                height: 14,
                backgroundColor: "var(--border)",
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${(s.count / maxSrc) * 100}%`,
                  height: "100%",
                  backgroundColor: "var(--accent)",
                  transition: "width 400ms ease-out",
                }}
              />
            </div>
            <div
              style={{
                width: 80,
                textAlign: "right",
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                color: "var(--muted)",
              }}
            >
              {s.count} · {((s.count / total) * 100).toFixed(0)}%
            </div>
          </div>
        ))}
      </Panel>

      <Panel>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: 16,
            color: "var(--ink)",
            marginBottom: 12,
          }}
        >
          Processing
        </h2>
        <Row label="Parse success rate" value="99.8%" hint="(6 failed)" />
        <Row label="Avg. time to score" value={`${avgParse}s per resume`} />
        <Row label="Total processing time" value="83 min" />
      </Panel>
    </>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <Panel>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontWeight: 700,
          fontSize: 32,
          color: "var(--ink)",
          lineHeight: 1.1,
        }}
      >
        {number}
      </div>
      <div
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 12,
          color: "var(--muted)",
          marginTop: 4,
        }}
      >
        {label}
      </div>
    </Panel>
  );
}

function Row({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div
      className="flex items-center justify-between"
      style={{
        padding: "8px 0",
        borderBottom: "1px solid var(--border)",
        fontFamily: "var(--font-sans)",
        fontSize: 14,
      }}
    >
      <span style={{ color: "var(--ink)" }}>{label}</span>
      <span style={{ color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
        {value} {hint && <span style={{ opacity: 0.7 }}>{hint}</span>}
      </span>
    </div>
  );
}
