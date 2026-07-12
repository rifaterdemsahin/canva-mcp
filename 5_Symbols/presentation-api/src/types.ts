export interface OutlinePage {
  title: string;
  description: string;
}

export interface ParsedOutline {
  title: string;
  presentation_outlines: OutlinePage[];
}

export type JobStatus = "pending" | "done" | "failed";

export interface PresentationJob {
  id: string;
  status: JobStatus;
  title: string;
  voiceover: string;
  outline: ParsedOutline;
  created_at: string;
  updated_at: string;
  design_id?: string;
  edit_url?: string;
  view_url?: string;
  error?: string;
}
