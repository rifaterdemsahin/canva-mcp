import { randomUUID } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { JobStatus, ParsedOutline, PresentationJob } from "./types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
// Local JSON job store (v1) — see 4_Formula/voiceover_presentation_api_spec.md
// "Job Store" section for why this isn't Supabase yet.
const DATA_DIR = join(__dirname, "..", ".data");
const JOBS_FILE = join(DATA_DIR, "jobs.json");

function ensureStore(): void {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  if (!existsSync(JOBS_FILE)) writeFileSync(JOBS_FILE, "[]\n", "utf-8");
}

function loadJobs(): PresentationJob[] {
  ensureStore();
  const raw = readFileSync(JOBS_FILE, "utf-8");
  try {
    return JSON.parse(raw) as PresentationJob[];
  } catch {
    return [];
  }
}

function saveJobs(jobs: PresentationJob[]): void {
  ensureStore();
  writeFileSync(JOBS_FILE, JSON.stringify(jobs, null, 2) + "\n", "utf-8");
}

export function createJob(title: string, voiceover: string, outline: ParsedOutline): PresentationJob {
  const now = new Date().toISOString();
  const job: PresentationJob = {
    id: randomUUID(),
    status: "pending",
    title,
    voiceover,
    outline,
    created_at: now,
    updated_at: now,
  };
  const jobs = loadJobs();
  jobs.push(job);
  saveJobs(jobs);
  return job;
}

export function getJob(id: string): PresentationJob | undefined {
  return loadJobs().find((j) => j.id === id);
}

export function listJobsByStatus(status: JobStatus): PresentationJob[] {
  return loadJobs().filter((j) => j.status === status);
}

export interface JobPatch {
  status?: JobStatus;
  design_id?: string;
  edit_url?: string;
  view_url?: string;
  error?: string;
}

export function updateJob(id: string, patch: JobPatch): PresentationJob | undefined {
  const jobs = loadJobs();
  const idx = jobs.findIndex((j) => j.id === id);
  if (idx === -1) return undefined;
  jobs[idx] = { ...jobs[idx], ...patch, updated_at: new Date().toISOString() };
  saveJobs(jobs);
  return jobs[idx];
}
