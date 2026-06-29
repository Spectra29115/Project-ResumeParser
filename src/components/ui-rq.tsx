import type { CSSProperties, ReactNode, ButtonHTMLAttributes, InputHTMLAttributes } from "react";

/* ---------- Button ---------- */

type ButtonVariant = "filled" | "outlined" | "ghost" | "danger" | "success";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Button({
  variant = "filled",
  fullWidth,
  size = "md",
  style,
  children,
  ...rest
}: ButtonProps) {
  const base: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontFamily: "var(--font-sans)",
    fontWeight: variant === "filled" ? 600 : 500,
    borderRadius: 6,
    cursor: "pointer",
    transition: "background-color 150ms ease-out, color 150ms ease-out, border-color 150ms ease-out",
    width: fullWidth ? "100%" : undefined,
    height: size === "sm" ? 32 : size === "lg" ? 44 : 38,
    fontSize: size === "sm" ? 13 : size === "lg" ? 15 : 14,
    padding: size === "sm" ? "0 12px" : "0 16px",
    border: "1px solid transparent",
    whiteSpace: "nowrap",
  };
  const variants: Record<ButtonVariant, CSSProperties> = {
    filled: { backgroundColor: "var(--accent)", color: "#ffffff" },
    outlined: {
      backgroundColor: "var(--panel)",
      color: "var(--ink)",
      borderColor: "var(--border)",
    },
    ghost: { backgroundColor: "transparent", color: "var(--muted)" },
    danger: {
      backgroundColor: "var(--panel)",
      color: "var(--signal-red)",
      borderColor: "var(--signal-red)",
    },
    success: {
      backgroundColor: "var(--signal-green)",
      color: "#ffffff",
    },
  };
  return (
    <button {...rest} style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  );
}

/* ---------- Input ---------- */

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export function Input({ invalid, style, ...rest }: InputProps) {
  return (
    <input
      {...rest}
      style={{
        width: "100%",
        height: 40,
        padding: "0 12px",
        borderRadius: 6,
        border: `1px solid ${invalid ? "var(--signal-red)" : "var(--border)"}`,
        fontFamily: "var(--font-sans)",
        fontSize: 14,
        color: "var(--ink)",
        backgroundColor: "var(--panel)",
        outline: "none",
        transition: "border-color 150ms ease-out, box-shadow 150ms ease-out",
        ...style,
      }}
      onFocus={(e) => {
        if (invalid) return;
        e.currentTarget.style.borderColor = "var(--accent)";
        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.12)";
        rest.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = invalid ? "var(--signal-red)" : "var(--border)";
        e.currentTarget.style.boxShadow = "none";
        rest.onBlur?.(e);
      }}
    />
  );
}

/* ---------- Label ---------- */

export function Label({ children, optional }: { children: ReactNode; optional?: boolean }) {
  return (
    <label
      style={{
        display: "block",
        fontFamily: "var(--font-sans)",
        fontWeight: 500,
        fontSize: 13,
        color: "var(--ink)",
        marginBottom: 6,
      }}
    >
      {children}
      {optional && (
        <span
          style={{
            marginLeft: 6,
            fontWeight: 400,
            fontSize: 12,
            color: "var(--muted)",
          }}
        >
          (optional)
        </span>
      )}
    </label>
  );
}

/* ---------- Panel ---------- */

export function Panel({
  children,
  padding = 24,
  style,
}: {
  children: ReactNode;
  padding?: number;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        backgroundColor: "var(--panel)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding,
        boxShadow: "var(--shadow-card)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ---------- Pill / Badge ---------- */

type PillTone = "green" | "red" | "amber" | "blue" | "grey";

export function Pill({ tone = "blue", children }: { tone?: PillTone; children: ReactNode }) {
  const tones: Record<PillTone, { bg: string; fg: string }> = {
    green: { bg: "var(--signal-green-dim)", fg: "var(--signal-green)" },
    red: { bg: "var(--signal-red-dim)", fg: "var(--signal-red)" },
    amber: { bg: "var(--signal-amber-dim)", fg: "var(--signal-amber)" },
    blue: { bg: "var(--accent-dim)", fg: "var(--accent)" },
    grey: { bg: "#EEF1F6", fg: "var(--muted)" },
  };
  const t = tones[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        backgroundColor: t.bg,
        color: t.fg,
        borderRadius: 999,
        padding: "3px 10px",
        fontFamily: "var(--font-sans)",
        fontWeight: 500,
        fontSize: 12,
        lineHeight: 1.4,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

/* ---------- Score visualization ---------- */

export function scoreTone(score: number): PillTone {
  if (score >= 80) return "green";
  if (score >= 60) return "blue";
  return "amber";
}

export function scoreColor(score: number): string {
  if (score >= 80) return "var(--signal-green)";
  if (score >= 60) return "var(--accent)";
  return "var(--signal-amber)";
}

export function ScoreBar({ value, animate = true }: { value: number; animate?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%" }}>
      <div
        style={{
          flex: 1,
          height: 6,
          borderRadius: 999,
          backgroundColor: "var(--border)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${value}%`,
            height: "100%",
            backgroundColor: scoreColor(value),
            borderRadius: 999,
            transition: animate ? "width 600ms ease-out" : "none",
          }}
        />
      </div>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontWeight: 700,
          fontSize: 13,
          color: "var(--ink)",
          minWidth: 56,
          textAlign: "right",
        }}
      >
        {value}/100
      </span>
    </div>
  );
}

/* ---------- Status -> Pill mapping ---------- */

export function StatusPill({ status }: { status: "shortlisted" | "rejected" | "pending" | "priority" }) {
  if (status === "shortlisted") return <Pill tone="green">● Shortlisted</Pill>;
  if (status === "rejected") return <Pill tone="red">✗ Rejected</Pill>;
  if (status === "priority") return <Pill tone="blue">★ Priority</Pill>;
  return <Pill tone="amber">● Pending</Pill>;
}
