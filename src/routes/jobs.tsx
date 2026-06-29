import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { jobs } from "@/lib/mock-data";
import { Panel } from "@/components/ui-rq";

export const Route = createFileRoute("/jobs")({
  head: () => ({
    meta: [
      { title: "Open positions — RecruitIQ" },
      {
        name: "description",
        content: "Browse open roles and submit your application through RecruitIQ.",
      },
    ],
  }),
  component: JobsList,
});

function JobsList() {
  const active = jobs.filter((j) => j.status === "Active");
  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--surface)" }}>
      <div
        className="border-b"
        style={{ backgroundColor: "var(--panel)", borderColor: "var(--border)" }}
      >
        <div className="mx-auto flex h-14 max-w-[680px] items-center justify-between px-6">
          <Link
            to="/"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 16, color: "var(--ink)" }}
          >
            RecruitIQ
          </Link>
          <Link
            to="/"
            style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--muted)" }}
          >
            ← Back
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-[680px] px-6 py-12">
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: 28,
            color: "var(--ink)",
            letterSpacing: "-0.01em",
          }}
        >
          Open positions
        </h1>

        <div
          className="mt-6 flex flex-wrap gap-3"
          style={{ fontFamily: "var(--font-sans)", fontSize: 13 }}
        >
          <input
            placeholder="Search roles..."
            className="flex-1 min-w-[200px]"
            style={{
              height: 40,
              padding: "0 12px",
              borderRadius: 6,
              border: "1px solid var(--border)",
              backgroundColor: "var(--panel)",
              outline: "none",
              fontSize: 14,
            }}
          />
          <select
            style={{
              height: 40,
              padding: "0 12px",
              borderRadius: 6,
              border: "1px solid var(--border)",
              backgroundColor: "var(--panel)",
              fontSize: 14,
            }}
          >
            <option>All locations</option>
            <option>Remote</option>
            <option>Pune, India</option>
            <option>Bengaluru, India</option>
          </select>
          <select
            style={{
              height: 40,
              padding: "0 12px",
              borderRadius: 6,
              border: "1px solid var(--border)",
              backgroundColor: "var(--panel)",
              fontSize: 14,
            }}
          >
            <option>All types</option>
            <option>Full-time</option>
            <option>Contract</option>
            <option>Part-time</option>
          </select>
        </div>

        <div className="mt-8 flex flex-col gap-4">
          {active.map((job) => (
            <Panel key={job.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: 18,
                      color: "var(--ink)",
                    }}
                  >
                    {job.title}
                  </h2>
                  <p
                    className="mt-1"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 13,
                      color: "var(--muted)",
                    }}
                  >
                    {job.company} · {job.location} · {job.type}
                  </p>
                  <p
                    className="mt-2"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 12,
                      color: "var(--muted)",
                    }}
                  >
                    Posted {job.postedAt}
                  </p>
                </div>
                <Link
                  to="/apply/$jobId"
                  params={{ jobId: job.id }}
                  className="inline-flex items-center gap-2"
                  style={{
                    backgroundColor: "var(--accent)",
                    color: "#ffffff",
                    fontFamily: "var(--font-sans)",
                    fontWeight: 500,
                    fontSize: 14,
                    padding: "10px 18px",
                    borderRadius: 6,
                    whiteSpace: "nowrap",
                  }}
                >
                  Apply
                  <ArrowRight size={14} />
                </Link>
              </div>
            </Panel>
          ))}
        </div>
      </div>
    </main>
  );
}
