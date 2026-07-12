import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { parseVoiceoverToOutline } from "./parser.js";
import { createJob, getJob, listJobsByStatus, updateJob, type JobPatch } from "./jobStore.js";

const PORT = Number(process.env.PORT ?? 4021);
const HOST = "127.0.0.1"; // local-only, per SPEC-018 security boundaries — no auth layer in v1

function sendJson(res: ServerResponse, statusCode: number, body: unknown): void {
  const payload = JSON.stringify(body, null, 2);
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(payload);
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 1_000_000) {
        reject(new Error("Request body too large"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

async function handlePostPresentations(req: IncomingMessage, res: ServerResponse): Promise<void> {
  let body: { title?: unknown; voiceover?: unknown };
  try {
    body = JSON.parse(await readBody(req));
  } catch {
    sendJson(res, 400, { error: "Invalid JSON body" });
    return;
  }

  if (typeof body.title !== "string" || !body.title.trim()) {
    sendJson(res, 400, { error: "'title' is required and must be a non-empty string" });
    return;
  }
  if (typeof body.voiceover !== "string" || !body.voiceover.trim()) {
    sendJson(res, 400, { error: "'voiceover' is required and must be a non-empty string" });
    return;
  }

  const outline = parseVoiceoverToOutline(body.title, body.voiceover);
  const job = createJob(body.title, body.voiceover, outline);
  sendJson(res, 201, job);
}

async function handlePatchPresentation(
  req: IncomingMessage,
  res: ServerResponse,
  id: string,
): Promise<void> {
  let body: JobPatch;
  try {
    body = JSON.parse(await readBody(req));
  } catch {
    sendJson(res, 400, { error: "Invalid JSON body" });
    return;
  }

  const updated = updateJob(id, body);
  if (!updated) {
    sendJson(res, 404, { error: `No job with id ${id}` });
    return;
  }
  sendJson(res, 200, updated);
}

const server = createServer((req, res) => {
  void (async () => {
    try {
      const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
      const parts = url.pathname.split("/").filter(Boolean); // ["api", "presentations", ...]

      if (parts[0] !== "api" || parts[1] !== "presentations") {
        sendJson(res, 404, { error: "Not found" });
        return;
      }

      // POST /api/presentations
      if (req.method === "POST" && parts.length === 2) {
        await handlePostPresentations(req, res);
        return;
      }

      // GET /api/presentations/jobs/pending
      if (req.method === "GET" && parts.length === 4 && parts[2] === "jobs" && parts[3] === "pending") {
        sendJson(res, 200, listJobsByStatus("pending"));
        return;
      }

      // GET /api/presentations/:id
      if (req.method === "GET" && parts.length === 3) {
        const job = getJob(parts[2]);
        if (!job) {
          sendJson(res, 404, { error: `No job with id ${parts[2]}` });
          return;
        }
        sendJson(res, 200, job);
        return;
      }

      // PATCH /api/presentations/:id
      if (req.method === "PATCH" && parts.length === 3) {
        await handlePatchPresentation(req, res, parts[2]);
        return;
      }

      sendJson(res, 404, { error: "Not found" });
    } catch (err) {
      sendJson(res, 500, { error: (err as Error).message });
    }
  })();
});

server.listen(PORT, HOST, () => {
  console.log(`presentation-api listening on http://${HOST}:${PORT}`);
  console.log(`  POST  /api/presentations              { title, voiceover }`);
  console.log(`  GET   /api/presentations/:id`);
  console.log(`  GET   /api/presentations/jobs/pending`);
  console.log(`  PATCH /api/presentations/:id           (used by \`npm run complete-job\`)`);
});
