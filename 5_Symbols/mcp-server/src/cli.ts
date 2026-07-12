#!/usr/bin/env node
/**
 * Local Canva CLI — drive the Connect API from the terminal using .env secrets.
 *
 * Usage (from 5_Symbols/mcp-server, after `npm run build`):
 *   npm run canva:whoami
 *   npm run canva:create -- --title "My Document" [--type doc|whiteboard|presentation]
 *
 * Secrets come from .env (never committed): CANVA_ACCESS_TOKEN, CANVA_CLIENT_ID,
 * CANVA_CLIENT_SECRET — see .env.example and 4_Formula/canva_credentials.md.
 */
import { createDesign } from "../tools/canva-api.js";

function getArg(name: string, fallback?: string): string | undefined {
  const idx = process.argv.indexOf(`--${name}`);
  return idx !== -1 && process.argv[idx + 1] ? process.argv[idx + 1] : fallback;
}

async function whoami(accessToken: string): Promise<void> {
  const res = await fetch("https://api.canva.com/rest/v1/users/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    console.error(`whoami failed: HTTP ${res.status}: ${await res.text()}`);
    process.exit(1);
  }
  console.log(JSON.stringify(await res.json(), null, 2));
}

async function main(): Promise<void> {
  const command = process.argv[2];
  const accessToken = process.env.CANVA_ACCESS_TOKEN;

  if (!accessToken) {
    console.error(
      "CANVA_ACCESS_TOKEN not set. Complete the OAuth PKCE flow via auth.html and put the token in .env\n" +
        "(see 4_Formula/canva_credentials.md). Run with: node --env-file=.env dist/src/cli.js"
    );
    process.exit(1);
  }

  switch (command) {
    case "whoami":
      await whoami(accessToken);
      break;

    case "list-designs": {
      const res = await fetch("https://api.canva.com/rest/v1/designs?limit=20", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.status === 403) {
        console.error(
          "403 missing_scope — the token lacks design:meta:read.\n" +
            "Add 'design:meta:read' to the integration scopes at\n" +
            "https://www.canva.com/developers/integrations/connect-api/OC-AZ9VpNJiU0ps/configuration\n" +
            "then re-run the PKCE flow (auth.html) and update CANVA_ACCESS_TOKEN in .env.\n" +
            "Background: 6_Semblance/canva_document_visibility.md"
        );
        process.exit(1);
      }
      if (!res.ok) {
        console.error(`list-designs failed: HTTP ${res.status}: ${await res.text()}`);
        process.exit(1);
      }
      const data = await res.json();
      for (const d of data.items ?? []) {
        console.log(`${d.id}  ${d.title ?? "(untitled)"}  ${d.urls?.edit_url ?? ""}`);
      }
      console.log(`\n${(data.items ?? []).length} design(s) listed.`);
      break;
    }

    case "create-design": {
      const title = getArg("title", `Pexabo Canva MCP — ${new Date().toISOString().slice(0, 16)}`)!;
      const type = getArg("type", "doc")!;
      console.log(`Creating Canva ${type}: "${title}" ...`);
      const result = await createDesign(title, accessToken, type);
      if (!result.success) {
        console.error(`FAILED: ${result.error}`);
        process.exit(1);
      }
      console.log(`Created ✅`);
      console.log(`  Design ID: ${result.designId}`);
      console.log(`  Title:     ${result.title}`);
      console.log(`  Edit URL:  ${result.editUrl}`);
      console.log(`  View URL:  ${result.viewUrl}`);
      break;
    }

    default:
      console.error("Usage: cli.js <whoami|create-design|list-designs> [--title <t>] [--type doc|whiteboard|presentation]");
      process.exit(1);
  }
}

main().catch((err) => {
  console.error("CLI error:", err);
  process.exit(1);
});
