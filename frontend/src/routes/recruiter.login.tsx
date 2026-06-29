import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button, Input, Label } from "@/components/ui-rq";

export const Route = createFileRoute("/recruiter/login")({
  head: () => ({
    meta: [
      { title: "Sign in — RecruitIQ" },
      { name: "description", content: "Sign in to your RecruitIQ recruiter account." },
    ],
  }),
  component: RecruiterLogin,
});

function RecruiterLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Enter your email and password.");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));
    // Mock auth — any non-empty credentials let you in until Lovable Cloud is wired.
    navigate({ to: "/recruiter/dashboard/jobs" });
  }

  return (
    <main
      className="flex min-h-screen items-center justify-center px-6"
      style={{ backgroundColor: "var(--surface)" }}
    >
      <div
        style={{
          width: 400,
          padding: 40,
          backgroundColor: "var(--panel)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          boxShadow: "var(--shadow-card)",
        }}
      >
        <Link
          to="/"
          className="block text-center"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: 20,
            color: "var(--accent)",
            letterSpacing: "-0.01em",
          }}
        >
          RecruitIQ
        </Link>

        <h1
          className="mt-8"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: 24,
            color: "var(--ink)",
          }}
        >
          Sign in to your account
        </h1>

        {error && (
          <div
            className="mt-6"
            style={{
              backgroundColor: "var(--signal-red-dim)",
              border: "1px solid var(--signal-red)",
              borderRadius: 6,
              padding: "10px 14px",
              color: "var(--signal-red)",
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6" noValidate>
          <div style={{ marginBottom: 16 }}>
            <Label>Work email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={255}
              autoComplete="email"
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <Label>Password</Label>
            <div style={{ position: "relative" }}>
              <Input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                maxLength={128}
                autoComplete="current-password"
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                aria-label={showPw ? "Hide password" : "Show password"}
                style={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  width: 28,
                  height: 24,
                  border: "none",
                  background: "transparent",
                  color: "var(--muted)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <Button type="submit" fullWidth size="lg" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </Button>

          <div className="mt-3 text-right">
            <a
              href="#"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                color: "var(--accent)",
              }}
            >
              Forgot your password?
            </a>
          </div>
        </form>

        <hr style={{ margin: "24px 0", borderColor: "var(--border)", borderTop: "1px solid" }} />

        <p
          className="text-center"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 12,
            color: "var(--muted)",
            lineHeight: 1.5,
          }}
        >
          Don't have an account? Contact your HR administrator to get access.
        </p>
      </div>
    </main>
  );
}
