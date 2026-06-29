import { createFileRoute, Link } from "@tanstack/react-router";
import { ScanSearch, FileText, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RecruitIQ — Hire with precision. Apply with confidence." },
      {
        name: "description",
        content:
          "RecruitIQ helps HR teams score, rank, and shortlist resumes at scale — and gives candidates a clean, human application experience.",
      },
      { property: "og:title", content: "RecruitIQ — Hire with precision" },
      {
        property: "og:description",
        content:
          "AI-powered resume intelligence for recruiters. A frictionless application form for candidates.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center px-6"
      style={{ backgroundColor: "var(--land-bg)" }}
    >
      <header className="mb-12 text-center">
        <h1
          className="text-white"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: 24,
            letterSpacing: "-0.01em",
          }}
        >
          RecruitIQ
        </h1>
        <p
          className="mt-3"
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 400,
            fontSize: 15,
            color: "var(--land-muted)",
          }}
        >
          Hire with precision. Apply with confidence.
        </p>
      </header>

      <section className="flex flex-col gap-6 sm:flex-row">
        <RoleCard
          icon={<ScanSearch size={28} strokeWidth={1.5} />}
          title="I'm hiring"
          body="Find the right people, fast."
          to="/recruiter/login"
          ctaLabel="Sign in"
          variant="filled"
        />
        <RoleCard
          icon={<FileText size={28} strokeWidth={1.5} />}
          title="I'm applying"
          body="Browse open roles and submit your resume."
          to="/jobs"
          ctaLabel="See jobs"
          variant="outlined"
        />
      </section>

      <footer
        className="absolute bottom-8 flex items-center gap-3"
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 11,
          color: "var(--land-muted)",
        }}
      >
        <a href="#" className="transition-colors hover:text-white/80">
          Privacy Policy
        </a>
        <span>·</span>
        <a href="#" className="transition-colors hover:text-white/80">
          Terms of Use
        </a>
      </footer>
    </main>
  );
}

interface RoleCardProps {
  icon: React.ReactNode;
  title: string;
  body: string;
  to: string;
  ctaLabel: string;
  variant: "filled" | "outlined";
}

function RoleCard({ icon, title, body, to, ctaLabel, variant }: RoleCardProps) {
  return (
    <Link
      to={to}
      className="scan-card group block"
      style={{
        width: 320,
        padding: "40px 36px",
      }}
    >
      <div
        className="mb-6 transition-opacity duration-200"
        style={{ color: "#93C5FD", opacity: 0.4 }}
      >
        <span className="group-hover:opacity-100" style={{ display: "inline-block" }}>
          {icon}
        </span>
      </div>
      <h2
        className="text-white"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: 22,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h2>
      <p
        className="mt-2"
        style={{
          fontFamily: "var(--font-sans)",
          fontWeight: 400,
          fontSize: 13,
          lineHeight: 1.55,
          color: "var(--land-muted)",
        }}
      >
        {body}
      </p>

      <div className="mt-8">
        {variant === "filled" ? (
          <span
            className="inline-flex items-center gap-2 transition-colors duration-150"
            style={{
              backgroundColor: "var(--accent)",
              color: "#ffffff",
              fontFamily: "var(--font-sans)",
              fontWeight: 500,
              fontSize: 14,
              padding: "10px 20px",
              borderRadius: 6,
            }}
          >
            {ctaLabel}
            <ArrowRight size={14} strokeWidth={2} />
          </span>
        ) : (
          <span
            className="inline-flex items-center gap-2 transition-colors duration-150 group-hover:border-white"
            style={{
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#ffffff",
              fontFamily: "var(--font-sans)",
              fontWeight: 500,
              fontSize: 14,
              padding: "10px 20px",
              borderRadius: 6,
            }}
          >
            {ctaLabel}
            <ArrowRight size={14} strokeWidth={2} />
          </span>
        )}
      </div>
    </Link>
  );
}

// Anchor stub routes — full pages ship in follow-up turns.
