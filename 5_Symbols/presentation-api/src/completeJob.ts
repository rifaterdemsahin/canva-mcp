#!/usr/bin/env node
/**
 * Writes back the result of an agent-run MCP generation to the job store.
 *
 * This does NOT call Canva or any MCP tool — it is pure deterministic code.
 * The actual Canva generation (request-outline-review -> generate-design-
 * structured -> create-design-from-candidate) must be run interactively by
 * an agent with the Canva MCP connector attached (see SPEC-018 — this is
 * not automatable as a script). Once that's done, run this to record the
 * result:
 *
 *   npm run complete-job -- --id <job_id> --design-id <id> \
 *     --edit-url <url> --view-url <url>
 *
 * Or, to record a failure:
 *   npm run complete-job -- --id <job_id> --error "<message>"
 */
import { getJob, updateJob } from "./jobStore.js";

function getArg(name: string): string | undefined {
  const idx = process.argv.indexOf(`--${name}`);
  return idx !== -1 && process.argv[idx + 1] ? process.argv[idx + 1] : undefined;
}

function main(): void {
  const id = getArg("id");
  if (!id) {
    console.error("Usage: complete-job -- --id <job_id> [--design-id <id> --edit-url <url> --view-url <url> | --error <message>]");
    process.exit(1);
  }

  const job = getJob(id);
  if (!job) {
    console.error(`No job with id ${id}`);
    process.exit(1);
  }

  const error = getArg("error");
  const designId = getArg("design-id");
  const editUrl = getArg("edit-url");
  const viewUrl = getArg("view-url");

  if (!error && !designId) {
    console.error("Provide either --error <message>, or --design-id (with --edit-url / --view-url).");
    process.exit(1);
  }

  const updated = error
    ? updateJob(id, { status: "failed", error })
    : updateJob(id, { status: "done", design_id: designId, edit_url: editUrl, view_url: viewUrl });

  console.log(JSON.stringify(updated, null, 2));
}

main();
