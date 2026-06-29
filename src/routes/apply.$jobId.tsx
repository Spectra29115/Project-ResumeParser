import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, type ChangeEvent, type DragEvent as ReactDragEvent, type FormEvent } from "react";
import { Upload, X, CheckCircle2 } from "lucide-react";
import { getJob } from "@/lib/mock-data";
import { Button, Input, Label } from "@/components/ui-rq";

export const Route = createFileRoute("/apply/$jobId")({
  loader: ({ params }) => {
    const job = getJob(params.jobId);
    if (!job) throw notFound();
    return { job };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `Apply — ${loaderData?.job.title ?? "Position"} — RecruitIQ` },
      {
        name: "description",
        content: `Submit your application for ${loaderData?.job.title ?? "this position"}.`,
      },
    ],
  }),
  notFoundComponent: () => (
    <main
      className="flex min-h-screen items-center justify-center px-6"
      style={{ backgroundColor: "var(--surface)" }}
    >
      <div className="text-center">
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600 }}>
          Position not found
        </h1>
        <Link to="/jobs" style={{ color: "var(--accent)", marginTop: 16, display: "inline-block" }}>
          ← Back to open positions
        </Link>
      </div>
    </main>
  ),
  errorComponent: ({ error }) => (
    <main className="flex min-h-screen items-center justify-center p-6">
      <p style={{ color: "var(--signal-red)" }}>{error.message}</p>
    </main>
  ),
  component: ApplyForm,
});

function ApplyForm() {
  const { job } = Route.useLoaderData();
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resume, setResume] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    linkedin: "",
    portfolio: "",
    coverLetter: "",
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  }

  function handleFile(file: File | null) {
    setResumeError(null);
    if (!file) {
      setResume(null);
      return;
    }
    const okType = /\.(pdf|docx)$/i.test(file.name);
    const okSize = file.size <= 5 * 1024 * 1024;
    if (!okType) {
      setResumeError("Resume must be a PDF or DOCX file.");
      return;
    }
    if (!okSize) {
      setResumeError("File is larger than 5MB.");
      return;
    }
    setResume(file);
  }

  function handleDrop(e: ReactDragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.fullName.trim()) errs.fullName = "Required";
    else if (form.fullName.length > 100) errs.fullName = "Must be less than 100 characters";
    if (!form.email.trim()) errs.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Invalid email address";
    if (!form.phone.trim()) errs.phone = "Required";
    if (!resume) setResumeError("Please upload your resume.");
    setErrors(errs);
    return Object.keys(errs).length === 0 && !!resume;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    // Simulate upload — replace with createServerFn once Lovable Cloud is enabled.
    await new Promise((r) => setTimeout(r, 900));
    const ref = `APP-${Math.floor(2000 + Math.random() * 8000)}`;
    setSubmitting(false);
    setSubmitted(ref);
  }

  if (submitted) {
    return (
      <main
        className="flex min-h-screen items-center justify-center px-6"
        style={{ backgroundColor: "var(--surface)" }}
      >
        <div className="text-center" style={{ maxWidth: 440 }}>
          <CheckCircle2
            size={64}
            strokeWidth={1.5}
            style={{ color: "var(--signal-green)", margin: "0 auto" }}
          />
          <h1
            className="mt-6"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: 24,
              color: "var(--ink)",
            }}
          >
            Application submitted
          </h1>
          <p
            className="mt-3"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 15,
              color: "var(--muted)",
              lineHeight: 1.55,
            }}
          >
            We've received your application for {job.title} at {job.company}.
          </p>
          <p
            className="mt-5"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              color: "var(--ink)",
            }}
          >
            Reference: #{submitted}
          </p>
          <Link
            to="/jobs"
            className="mt-8 inline-block"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 500,
              fontSize: 14,
              color: "var(--accent)",
            }}
          >
            View more open positions →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--surface)" }}>
      <div
        className="border-b"
        style={{ backgroundColor: "var(--panel)", borderColor: "var(--border)" }}
      >
        <div className="mx-auto flex h-14 max-w-[560px] items-center px-6">
          <Link
            to="/"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 16, color: "var(--ink)" }}
          >
            RecruitIQ
          </Link>
        </div>
      </div>

      <div className="mx-auto px-6 py-10" style={{ maxWidth: 560 }}>
        <div
          style={{
            backgroundColor: "var(--panel)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: 24,
            marginBottom: 32,
          }}
        >
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
          <p
            className="mt-2"
            style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--muted)" }}
          >
            {job.company} · {job.location} · {job.type}
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <Field label="Full name" error={errors.fullName} required>
            <Input
              value={form.fullName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => update("fullName", e.target.value)}
              maxLength={100}
              invalid={!!errors.fullName}
            />
          </Field>

          <Field label="Email address" error={errors.email} required>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              maxLength={255}
              invalid={!!errors.email}
            />
          </Field>

          <Field label="Phone number" error={errors.phone} required>
            <Input
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              maxLength={32}
              invalid={!!errors.phone}
            />
          </Field>

          <Field label="LinkedIn profile URL" optional>
            <Input
              type="url"
              value={form.linkedin}
              onChange={(e) => update("linkedin", e.target.value)}
              maxLength={300}
            />
          </Field>

          <Field label="Portfolio / GitHub URL" optional>
            <Input
              type="url"
              value={form.portfolio}
              onChange={(e) => update("portfolio", e.target.value)}
              maxLength={300}
            />
          </Field>

          <div style={{ marginBottom: 20 }}>
            <Label>Resume</Label>
            {resume ? (
              <div
                className="flex items-center justify-between"
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  padding: "14px 16px",
                  backgroundColor: "var(--panel)",
                }}
              >
                <div style={{ fontFamily: "var(--font-sans)", fontSize: 14 }}>
                  <div style={{ color: "var(--ink)", fontWeight: 500 }}>{resume.name}</div>
                  <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 2 }}>
                    {(resume.size / 1024).toFixed(0)} KB
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setResume(null)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--muted)",
                    cursor: "pointer",
                    padding: 4,
                  }}
                  aria-label="Remove resume"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                style={{
                  display: "block",
                  border: `1.5px dashed ${dragOver ? "var(--accent)" : "var(--border)"}`,
                  borderRadius: 10,
                  backgroundColor: dragOver ? "var(--accent-dim)" : "var(--surface)",
                  padding: 32,
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "background-color 150ms ease-out, border-color 150ms ease-out",
                }}
              >
                <input
                  type="file"
                  accept=".pdf,.docx"
                  style={{ display: "none" }}
                  onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                />
                <Upload size={22} style={{ color: "var(--muted)", margin: "0 auto 10px" }} />
                <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--ink)" }}>
                  Drop your resume here or{" "}
                  <span style={{ color: "var(--accent)", fontWeight: 500 }}>browse files</span>
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 12,
                    color: "var(--muted)",
                    marginTop: 6,
                  }}
                >
                  PDF or DOCX · Max 5MB
                </div>
              </label>
            )}
            {resumeError && (
              <div
                style={{
                  marginTop: 6,
                  color: "var(--signal-red)",
                  fontSize: 12,
                  fontFamily: "var(--font-sans)",
                }}
              >
                {resumeError}
              </div>
            )}
          </div>

          <Field label="Cover letter" optional>
            <textarea
              value={form.coverLetter}
              onChange={(e) => update("coverLetter", e.target.value)}
              rows={4}
              maxLength={2000}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 6,
                border: "1px solid var(--border)",
                fontFamily: "var(--font-sans)",
                fontSize: 14,
                backgroundColor: "var(--panel)",
                resize: "vertical",
                outline: "none",
                color: "var(--ink)",
              }}
            />
          </Field>

          <Button type="submit" fullWidth size="lg" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit application"}
          </Button>

          <p
            className="text-center"
            style={{
              marginTop: 16,
              fontFamily: "var(--font-sans)",
              fontSize: 12,
              color: "var(--muted)",
            }}
          >
            Your information is only shared with {job.company}.
          </p>
        </form>
      </div>
    </main>
  );
}

function Field({
  label,
  children,
  error,
  optional,
  required,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  optional?: boolean;
  required?: boolean;
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <Label optional={optional}>
        {label}
        {required && " *"}
      </Label>
      {children}
      {error && (
        <div
          style={{
            marginTop: 6,
            color: "var(--signal-red)",
            fontSize: 12,
            fontFamily: "var(--font-sans)",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
