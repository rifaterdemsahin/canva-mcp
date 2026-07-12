import { test } from "node:test";
import assert from "node:assert/strict";
import { parseVoiceoverToOutline } from "../parser.js";

// The exact voiceover script the user supplied for the Coordinator/
// Sub-Agents comic deck (7_Testing_Known/coordinator_subagents_comic_flow.md).
// This parser must reproduce the same 8-section breakdown that was built
// by hand for that deck: Title, Act1-intro, Panel1..4, Act2, Act3.
const COORDINATOR_SCRIPT = `Act 1 — Problem

Meet our development team's central Coordinator, a bright orange robot managing our daily AI workflows. In Panel 1, the Coordinator kicks off the day with a clear visual command to its friendly, blue sub-agents: 'Let's build! Follow all instructions!' In Panel 2, Sub-Agent A, colored in cool shades of teal and blue, dives straight into coding, happily declaring, 'Writing code and running tests!' while perfectly adhering to our core formatting standards. Meanwhile, in Panel 3, Sub-Agent B works diligently in isolation, stating, 'Preparing the database migration scripts!' as it processes its own independent dataset. By Panel 4, both blue sub-agents complete their tasks and hand their work back to the orange coordinator, saying, 'Here are our completed tasks!' But this constant, manual coordination of separate files and bloated instructions is about to create a massive architectural bottleneck.

Act 2 — Solution

As our system scales, our central orange Coordinator robot faces a massive bottleneck, receiving towering stacks of unorganized data packages from its blue sub-agents. The Coordinator stands overwhelmed, holding separate, messy datasets of coding standards, PR checklists, and database migrations, desperately trying to figure out how to make them into a single coherent workflow. Naively dumping everything into one giant file—like raw text concatenation—only leads to a chaotic, redundant pile of data marked with a giant red 'X'. To resolve this, the Coordinator maps out a brilliant architectural plan: separating universal primitives from task-specific operational workflows.

Act 3 — Lesson

To solve this architectural bottleneck, we must divide and conquer. The orange coordinator robot realizes that stuffing everything into one massive file is highly inefficient, so it delegates task-specific workflows directly to specialized agents. By keeping only the universal coding and testing standards in the core CLAUDE.md, and offloading operational tasks like PR reviews, database migrations, and deployments to dedicated, on-demand Skills, the system remains clean, agile, and highly performant.`;

test("produces title slide + 3 acts x panel breakdown = 8 pages total", () => {
  const outline = parseVoiceoverToOutline("The Coordinator & Sub-Agents", COORDINATOR_SCRIPT);
  assert.equal(outline.title, "The Coordinator & Sub-Agents");
  assert.equal(outline.presentation_outlines.length, 8);
});

test("title slide lists the agenda of all 3 acts", () => {
  const outline = parseVoiceoverToOutline("The Coordinator & Sub-Agents", COORDINATOR_SCRIPT);
  const titleSlide = outline.presentation_outlines[0];
  assert.match(titleSlide.description, /Act 1 — Problem/);
  assert.match(titleSlide.description, /Act 2 — Solution/);
  assert.match(titleSlide.description, /Act 3 — Lesson/);
});

test("Act 1 intro slide precedes the 4 panel slides", () => {
  const outline = parseVoiceoverToOutline("T", COORDINATOR_SCRIPT);
  const pages = outline.presentation_outlines;
  assert.equal(pages[1].title, "Act 1 — Problem");
  assert.match(pages[1].description, /central Coordinator/);
  assert.equal(pages[2].title, "Panel 1");
  assert.equal(pages[3].title, "Panel 2");
  assert.equal(pages[4].title, "Panel 3");
  assert.equal(pages[5].title, "Panel 4");
});

test("multi-sentence quoted dialogue is captured whole, not fragmented at internal punctuation", () => {
  const outline = parseVoiceoverToOutline("T", COORDINATOR_SCRIPT);
  const panel1 = outline.presentation_outlines[2];
  assert.match(
    panel1.description,
    /Speech bubble: "Let's build! Follow all instructions!"/,
  );
});

test("single-sentence dialogue is captured correctly for each panel", () => {
  const outline = parseVoiceoverToOutline("T", COORDINATOR_SCRIPT);
  const [, , panel1, panel2, panel3, panel4] = outline.presentation_outlines;
  assert.match(panel2.description, /Speech bubble: "Writing code and running tests!"/);
  assert.match(panel3.description, /Speech bubble: "Preparing the database migration scripts!"/);
  assert.match(panel4.description, /Speech bubble: "Here are our completed tasks!"/);
  assert.match(panel4.description, /architectural bottleneck/);
});

test("Panel 4 slide keeps the bottleneck foreshadowing sentence that follows the quote", () => {
  const outline = parseVoiceoverToOutline("T", COORDINATOR_SCRIPT);
  const panel4 = outline.presentation_outlines[5];
  assert.match(panel4.description, /massive architectural bottleneck/);
});

test("Act 2 and Act 3 (no Panel mentions) become single slides each", () => {
  const outline = parseVoiceoverToOutline("T", COORDINATOR_SCRIPT);
  const pages = outline.presentation_outlines;
  assert.equal(pages[6].title, "Act 2 — Solution");
  assert.equal(pages[7].title, "Act 3 — Lesson");
  assert.match(pages[6].description, /massive bottleneck/);
  assert.match(pages[7].description, /divide and conquer/i);
});

test("contraction apostrophes inside dialogue do not break quote extraction", () => {
  // "Let's" contains an apostrophe that must NOT be treated as a closing quote.
  const outline = parseVoiceoverToOutline("T", COORDINATOR_SCRIPT);
  const panel1 = outline.presentation_outlines[2];
  // If the apostrophe in "Let's" were mistaken for a closing quote, this
  // exact phrase would never appear intact.
  assert.match(panel1.description, /Let's build! Follow all instructions!/);
});

test("fallback: voiceover with no Act headings still produces a valid outline", () => {
  const outline = parseVoiceoverToOutline("Simple Deck", "Just one plain sentence with no structure.");
  assert.equal(outline.title, "Simple Deck");
  assert.ok(outline.presentation_outlines.length >= 1);
  assert.match(outline.presentation_outlines[0].description, /plain sentence/);
});

test("fallback: empty voiceover does not throw and returns at least one page", () => {
  const outline = parseVoiceoverToOutline("Empty", "");
  assert.equal(outline.presentation_outlines.length, 1);
});

test("fallback with inline Panel mentions but no Act headings still chunks by panel", () => {
  const outline = parseVoiceoverToOutline(
    "No Acts",
    "Intro text here. In Panel 1, something happens. In Panel 2, something else happens.",
  );
  const pages = outline.presentation_outlines;
  assert.equal(pages[0].title, "Overview");
  assert.equal(pages[1].title, "Panel 1");
  assert.equal(pages[2].title, "Panel 2");
});
