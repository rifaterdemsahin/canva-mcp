import fs from 'fs';
import path from 'path';

// Retrieve access token from .env or CLI args
let accessToken = process.env.CANVA_ACCESS_TOKEN;
const designId = 'DAHQCqMC7Ck';

if (!accessToken) {
  // Try loading from .env in the parent directory or current directory
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const match = envContent.match(/CANVA_ACCESS_TOKEN=["']?([^"'\r\n]+)/);
      if (match) {
        accessToken = match[1];
      }
    }
  } catch (_) {}
}

// Fallback to command line arguments
if (process.argv[2]) {
  accessToken = process.argv[2];
}

if (!accessToken) {
  console.error("Error: CANVA_ACCESS_TOKEN not found in environment, .env, or command line arguments.");
  process.exit(1);
}

async function run() {
  try {
    console.log(`Fetching metadata for design ${designId}...`);
    const designRes = await fetch(`https://api.canva.com/rest/v1/designs/${designId}`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (!designRes.ok) {
      console.error(`Error: Failed to fetch design info (HTTP ${designRes.status}):`, await designRes.text());
      process.exit(1);
    }

    const designInfo = await designRes.json();
    const title = designInfo.design?.title || 'Untitled Design';
    const editUrl = designInfo.design?.urls?.edit_url || '';
    const viewUrl = designInfo.design?.urls?.view_url || '';

    console.log(`Fetching pages for design ${designId}...`);
    const pagesRes = await fetch(`https://api.canva.com/rest/v1/designs/${designId}/pages?limit=50`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (!pagesRes.ok) {
      console.error(`Error: Failed to fetch pages (HTTP ${pagesRes.status}):`, await pagesRes.text());
      process.exit(1);
    }

    const pagesData = await pagesRes.json();
    const items = pagesData.items || [];

    console.log("\n## Canva Pages Table\n");
    console.log(`### 🎨 Design: ${title} (${designId})`);
    console.log(`- **Edit URL:** [Open in Canva](${editUrl})`);
    console.log(`- **View URL:** [View Design](${viewUrl})\n`);
    console.log("| Slide Index | Slide Name (Documentation-only) | Thumbnail URL |");
    console.log("|---|---|---|");

    items.forEach((page, idx) => {
      // Canva pages don't have custom names in the API, we index them
      const slideIndex = idx + 1;
      const docName = `Slide ${slideIndex.toString().padStart(2, '0')}`;
      const thumbnail = page.thumbnail?.url || '—';
      console.log(`| ${slideIndex} | ${docName} | [Thumbnail](${thumbnail}) |`);
    });

    console.log(`\nTotal: ${items.length} page(s) found.`);

  } catch (error) {
    console.error("Execution failed:", error);
    process.exit(1);
  }
}

run();
