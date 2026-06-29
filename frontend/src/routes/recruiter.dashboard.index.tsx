import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/recruiter/dashboard/")({
  beforeLoad: () => {
    throw redirect({ to: "/recruiter/dashboard/jobs" });
  },
});
