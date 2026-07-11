export interface DesignBriefInput {
  clientName: string;
  description: string;
  brandColors?: string[];
  deliverables?: string[];
  tone?: string;
}

function generateColorSection(colors?: string[]): string {
  if (!colors || colors.length === 0) {
    return "  - (To be defined by designer)\n";
  }
  return colors.map((c) => `  - ${c}`).join("\n") + "\n";
}

function generateDeliverablesSection(items?: string[]): string {
  if (!items || items.length === 0) {
    return "  - (To be determined with client)\n";
  }
  return items.map((d) => `  - ${d}`).join("\n") + "\n";
}

export function generateDesignBrief(input: DesignBriefInput): string {
  const lines: string[] = [];
  const separator = "─".repeat(60);

  lines.push(separator);
  lines.push("  CANVA DESIGN KIT — PROJECT BRIEF");
  lines.push(separator);
  lines.push("");
  lines.push(`  Client / Project : ${input.clientName}`);
  lines.push(`  Tone / Voice     : ${input.tone ?? "professional"}`);
  lines.push(`  Date Generated   : ${new Date().toISOString().split("T")[0]}`);
  lines.push("");
  lines.push("  1. PROJECT OVERVIEW");
  lines.push("  " + "─".repeat(56));
  lines.push("");
  lines.push(`  ${input.description}`);
  lines.push("");
  lines.push("  2. BRAND COLOR PALETTE");
  lines.push("  " + "─".repeat(56));
  lines.push("");
  lines.push(generateColorSection(input.brandColors));
  lines.push("  3. DELIVERABLES");
  lines.push("  " + "─".repeat(56));
  lines.push("");
  lines.push(generateDeliverablesSection(input.deliverables));
  lines.push("  4. DESIGN NOTES");
  lines.push("  " + "─".repeat(56));
  lines.push("");
  lines.push("  - All deliverables should follow the Canva Design Kit template.");
  lines.push("  - Export final files as PNG (1080x1080px for social) or PDF Print.");
  lines.push("  - Maintain consistent spacing and typography across all assets.");
  lines.push("  - Refer to brand guidelines for logo placement and minimum clearspace.");
  lines.push("");
  lines.push(separator);

  return lines.join("\n");
}
