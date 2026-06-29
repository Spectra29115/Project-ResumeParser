// Mock data used across the dashboard until Lovable Cloud is enabled.

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Full-time" | "Contract" | "Part-time";
  postedAt: string;
  status: "Active" | "Closed" | "Paused";
  received: number;
  shortlisted: number;
  cutoff: number;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  experienceYears: number;
  jobId: string;
  jobTitle: string;
  score: number;
  breakdown: { skills: number; experience: number; education: number; semantic: number };
  status: "shortlisted" | "rejected" | "pending" | "priority";
  source: "Gmail" | "Platform" | "Lever" | "Greenhouse" | "Outlook";
  receivedAt: string;
  parseMs: number;
  summary: string;
  matched: string[];
  missing: string[];
}

export const jobs: Job[] = [
  {
    id: "ml-eng",
    title: "Senior ML Engineer",
    company: "Acme Corp",
    location: "Pune, India",
    type: "Full-time",
    postedAt: "Jun 12",
    status: "Active",
    received: 3847,
    shortlisted: 200,
    cutoff: 75,
  },
  {
    id: "backend",
    title: "Backend Developer",
    company: "Acme Corp",
    location: "Remote",
    type: "Contract",
    postedAt: "Jun 08",
    status: "Active",
    received: 1204,
    shortlisted: 47,
    cutoff: 70,
  },
  {
    id: "frontend",
    title: "Frontend Engineer",
    company: "Acme Corp",
    location: "Bengaluru, India",
    type: "Full-time",
    postedAt: "Jun 02",
    status: "Paused",
    received: 892,
    shortlisted: 31,
    cutoff: 72,
  },
  {
    id: "data-sci",
    title: "Data Scientist",
    company: "Acme Corp",
    location: "Remote",
    type: "Full-time",
    postedAt: "May 28",
    status: "Closed",
    received: 2104,
    shortlisted: 88,
    cutoff: 78,
  },
];

const firstNames = [
  "Arjun", "Priya", "Rohan", "Sneha", "Vikram", "Ananya", "Karthik", "Diya",
  "Rahul", "Meera", "Aditya", "Kavya", "Siddharth", "Isha", "Ravi", "Tara",
  "Nikhil", "Lakshmi", "Aakash", "Pooja", "Manish", "Riya", "Yash", "Sara",
  "Aryan", "Neha", "Dhruv", "Anika", "Kabir", "Zara",
];
const lastNames = [
  "Mehta", "Nair", "Das", "Kulkarni", "Sharma", "Iyer", "Reddy", "Patel",
  "Gupta", "Khan", "Bose", "Chopra", "Rao", "Joshi", "Verma", "Kapoor",
];
const roles = ["ML Eng", "DS", "BE", "FE", "Full-stack", "DevOps"];
const sources: Candidate["source"][] = ["Gmail", "Platform", "Lever", "Greenhouse", "Outlook"];
const statuses: Candidate["status"][] = ["shortlisted", "pending", "rejected", "priority"];

function seeded(i: number, mod: number) {
  return Math.abs(Math.sin(i * 9301 + 49297) * 233280) % mod;
}

export const candidates: Candidate[] = Array.from({ length: 60 }, (_, i) => {
  const score = Math.round(45 + seeded(i, 50));
  const jobIdx = Math.floor(seeded(i + 7, jobs.length));
  const job = jobs[jobIdx];
  const fn = firstNames[Math.floor(seeded(i + 1, firstNames.length))];
  const ln = lastNames[Math.floor(seeded(i + 2, lastNames.length))];
  const status = score >= job.cutoff
    ? (i % 7 === 0 ? "priority" : "shortlisted")
    : score >= 60
    ? "pending"
    : "rejected";
  return {
    id: `APP-${2800 + i}`,
    name: `${fn} ${ln}`,
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}@email.com`,
    phone: `+91 9${String(80000000 + Math.floor(seeded(i + 3, 19999999))).padStart(9, "0")}`,
    role: roles[Math.floor(seeded(i + 4, roles.length))],
    experienceYears: Math.floor(2 + seeded(i + 5, 8)),
    jobId: job.id,
    jobTitle: job.title,
    score,
    breakdown: {
      skills: Math.round(score * 0.9 + seeded(i + 8, 10)),
      experience: Math.min(100, Math.round(score * 1.05 + seeded(i + 9, 8))),
      education: Math.round(score * 0.8 + seeded(i + 10, 15)),
      semantic: Math.min(100, Math.round(score * 0.95 + seeded(i + 11, 10))),
    },
    status: status as Candidate["status"],
    source: sources[Math.floor(seeded(i + 6, sources.length))],
    receivedAt: `Jun ${1 + Math.floor(seeded(i + 12, 28))}`,
    parseMs: Math.round(800 + seeded(i + 13, 1200)),
    summary:
      "Strong technical background with relevant production experience. Excellent fit on core skills with a few gaps on auxiliary tooling. Resume is well-structured and parses cleanly.",
    matched: ["Python", "TensorFlow", "Docker", "MLOps"].slice(0, 2 + Math.floor(seeded(i + 14, 3))),
    missing: ["Kubernetes", "GCP", "Rust"].slice(0, 1 + Math.floor(seeded(i + 15, 2))),
  };
});

export function getJob(id: string) {
  return jobs.find((j) => j.id === id);
}

export function getCandidatesForJob(jobId: string) {
  return candidates
    .filter((c) => c.jobId === jobId)
    .sort((a, b) => b.score - a.score);
}
