import { useFeatureSupport } from "@canva/app-hooks";
import { Button, Rows, Text } from "@canva/app-ui-kit";
import {
  addElementAtPoint,
  getCurrentPageContext,
  openDesign,
  type DesignEditing,
  type ShapeElementAtPoint,
} from "@canva/design";
import { FormattedMessage, useIntl } from "react-intl";
import { useState, useCallback } from "react";
import * as styles from "styles/components.css";

const DARK_BG = "#0B0F19";
const SHAPE_VIEW_BOX = { top: 0, left: 0, width: 200, height: 200 };

/** Circle path in a 100×100 viewBox (arc commands only — no Q). */
const CIRCLE_PATH =
  "M 50 0 A 50 50 0 1 1 50 100 A 50 50 0 1 1 50 0 Z";

const BADGE_PALETTE: Array<{ bg: string; fg: string }> = [
  { bg: "#1D4ED8", fg: "#FFFFFF" },
  { bg: "#DC2626", fg: "#FFFFFF" },
  { bg: "#059669", fg: "#FFFFFF" },
  { bg: "#F59E0B", fg: "#111827" },
  { bg: "#7C3AED", fg: "#FFFFFF" },
  { bg: "#0E7490", fg: "#FFFFFF" },
  { bg: "#DB2777", fg: "#FFFFFF" },
  { bg: "#4D7C0F", fg: "#FFFFFF" },
  { bg: "#0F172A", fg: "#FBBF24" },
  { bg: "#EA580C", fg: "#FFFFFF" },
];

type ShapeComponent = {
  paths: ShapeElementAtPoint["paths"];
};

// SPEC-017: hand-authored straight-line-only paths (no bezier) for the
// Claude AI Architect course's 4 reusable components. Coordinates and
// rationale are documented in 4_Formula/architecture_components_app_spec.md.
const SHAPE_COMPONENTS: Record<
  "shield" | "hexagon" | "cylinder" | "octagon",
  ShapeComponent
> = {
  shield: {
    paths: [
      { d: "M 60 20 L 140 20 L 170 70 L 100 190 L 30 70 Z", fill: { color: "#06B6D4" } },
      { d: "M 72 32 L 128 32 L 155 72 L 100 172 L 45 72 Z", fill: { color: DARK_BG } },
      { d: "M 84 44 L 116 44 L 138 74 L 100 152 L 62 74 Z", fill: { color: "#06B6D4" } },
    ],
  },
  hexagon: {
    paths: [
      { d: "M 100 15 L 174 58 L 174 143 L 100 185 L 26 143 L 26 58 Z", fill: { color: "#A855F7" } },
      { d: "M 100 40 L 152 70 L 152 130 L 100 160 L 48 130 L 48 70 Z", fill: { color: DARK_BG } },
      { d: "M 100 65 L 130 83 L 130 117 L 100 135 L 70 117 L 70 83 Z", fill: { color: "#A855F7" } },
    ],
  },
  cylinder: {
    paths: [
      { d: "M 40 30 L 160 30 L 160 70 L 40 70 Z", fill: { color: "#10B981" } },
      { d: "M 40 30 L 160 30 L 160 38 L 40 38 Z", fill: { color: "#34D399" } },
      { d: "M 40 78 L 160 78 L 160 118 L 40 118 Z", fill: { color: "#10B981" } },
      { d: "M 40 126 L 160 126 L 160 166 L 40 166 Z", fill: { color: "#10B981" } },
    ],
  },
  octagon: {
    paths: [
      { d: "M 70 30 L 130 30 L 170 70 L 170 130 L 130 170 L 70 170 L 30 130 L 30 70 Z", fill: { color: "#F59E0B" } },
      { d: "M 75 41 L 126 41 L 160 75 L 160 126 L 126 160 L 75 160 L 41 126 L 41 75 Z", fill: { color: DARK_BG } },
      { d: "M 90 76 L 111 76 L 125 90 L 125 111 L 111 125 L 90 125 L 76 111 L 76 90 Z", fill: { color: "#F59E0B" } },
      { d: "M 95 30 L 105 30 L 105 76 L 95 76 Z", fill: { color: "#F59E0B" } },
      { d: "M 95 125 L 105 125 L 105 170 L 95 170 Z", fill: { color: "#F59E0B" } },
      { d: "M 125 95 L 170 95 L 170 105 L 125 105 Z", fill: { color: "#F59E0B" } },
      { d: "M 30 95 L 75 95 L 75 105 L 30 105 Z", fill: { color: "#F59E0B" } },
    ],
  },
};

export const App = () => {
  const isSupported = useFeatureSupport();
  const [status, setStatus] = useState<string | null>(null);
  const intl = useIntl();

  const addLowerThird = useCallback(async () => {
    if (!isSupported(addElementAtPoint)) {
      setStatus("Feature not supported on this page");
      return;
    }

    try {
      const context = await getCurrentPageContext();
      const pageWidth = context.dimensions?.width ?? 1920;
      const pageHeight = context.dimensions?.height ?? 1080;

      const lowerThirdY = pageHeight - 120;
      const lowerThirdWidth = pageWidth * 0.6;
      const lowerThirdX = (pageWidth - lowerThirdWidth) / 2;

      await addElementAtPoint({
        type: "text",
        top: lowerThirdY,
        left: lowerThirdX,
        width: lowerThirdWidth,
        children: ["tuncer karaarslan"],
      });

      setStatus("Lower third text added successfully");
    } catch (error) {
      setStatus(`Error: ${(error as Error).message}`);
    }
  }, [isSupported]);

  const addShapeComponent = useCallback(
    async (name: keyof typeof SHAPE_COMPONENTS, label: string) => {
      if (!isSupported(addElementAtPoint)) {
        setStatus("Feature not supported on this page");
        return;
      }

      try {
        const context = await getCurrentPageContext();
        const pageWidth = context.dimensions?.width ?? 1920;
        const pageHeight = context.dimensions?.height ?? 1080;

        const size = Math.min(pageWidth, pageHeight) * 0.3;
        const top = (pageHeight - size) / 2;
        const left = (pageWidth - size) / 2;

        await addElementAtPoint({
          type: "shape",
          top,
          left,
          width: size,
          height: size,
          viewBox: SHAPE_VIEW_BOX,
          paths: SHAPE_COMPONENTS[name].paths,
        });

        setStatus(`${label} component added successfully`);
      } catch (error) {
        setStatus(`Error: ${(error as Error).message}`);
      }
    },
    [isSupported],
  );

  const insertGroupedNumberBadges = useCallback(async () => {
    if (!isSupported(addElementAtPoint)) {
      setStatus("Feature not supported on this page");
      return;
    }

    try {
      const context = await getCurrentPageContext();
      const pageWidth = context.dimensions?.width ?? 1080;
      const pageHeight = context.dimensions?.height ?? 1080;
      const cols = 10;
      const rows = 10;
      const margin = 36;
      const titleH = 56;
      const gap = 10;
      const size = Math.min(
        (pageWidth - margin * 2 - gap * (cols - 1)) / cols,
        (pageHeight - margin - titleH - gap * (rows - 1)) / rows,
      );

      await addElementAtPoint({
        type: "text",
        top: 12,
        left: margin,
        width: pageWidth - margin * 2,
        children: ["1–100  ·  each number grouped with its circle (⌘G)"],
        fontSize: 18,
        fontWeight: "bold",
        color: "#334155",
        textAlign: "center",
      });

      for (let n = 1; n <= 100; n++) {
        const idx = n - 1;
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const left = margin + col * (size + gap);
        const top = titleH + row * (size + gap);
        const { bg, fg } =
          BADGE_PALETTE[Math.floor(idx / 10)] ??
          ({ bg: "#1D4ED8", fg: "#FFFFFF" } as const);
        await addElementAtPoint({
          type: "group",
          top,
          left,
          children: [
            {
              type: "shape",
              paths: [{ d: CIRCLE_PATH, fill: { color: bg } }],
              viewBox: { top: 0, left: 0, width: 100, height: 100 },
              width: size,
              height: size,
              top: 0,
              left: 0,
            },
            {
              type: "text",
              children: [String(n)],
              color: fg,
              fontSize: n >= 100 ? 18 : 22,
              fontWeight: "bold",
              textAlign: "center",
              width: size,
              top: size * 0.32,
              left: 0,
            },
          ],
        });
        if (n % 10 === 0) {
          setStatus(`Inserted grouped badges ${n}/100…`);
        }
      }
      setStatus("Done — 100 number+circle groups. Drag any badge; they move together.");
    } catch (error) {
      setStatus(`Error: ${(error as Error).message}`);
    }
  }, [isSupported]);

  const groupExistingNumberCircles = useCallback(async () => {
    try {
      let grouped = 0;
      await openDesign({ type: "current_page" }, async (session) => {
        if (session.page.type !== "absolute" || session.page.locked) {
          setStatus("This page type does not support grouping");
          return;
        }
        const elements = session.page.elements.toArray();
        const shapes = elements.filter(
          (
            el,
          ): el is DesignEditing.ShapeElement | DesignEditing.RectElement =>
            (el.type === "shape" || el.type === "rect") && !el.locked,
        );
        const texts = elements.filter(
          (el): el is DesignEditing.TextElement =>
            el.type === "text" && !el.locked,
        );
        const used = new Set<unknown>();
        for (const shape of shapes) {
          const cx = shape.left + shape.width / 2;
          const cy = shape.top + shape.height / 2;
          const text = texts.find((t) => {
            if (used.has(t)) return false;
            const tw = "width" in t && typeof t.width === "number" ? t.width : 40;
            const th = "height" in t && typeof t.height === "number" ? t.height : 24;
            const tx = t.left + tw / 2;
            const ty = t.top + th / 2;
            return (
              Math.abs(tx - cx) < shape.width / 2 &&
              Math.abs(ty - cy) < shape.height / 2
            );
          });
          if (!text) continue;
          used.add(text);
          try {
            await session.helpers.group({
              elements: [shape, text],
            });
            grouped += 1;
          } catch {
            // pair already grouped or unsupported — continue
          }
        }
        await session.sync();
      });
      setStatus(
        grouped > 0
          ? `Grouped ${grouped} number+circle pairs (⌘G). They now move together.`
          : "No overlapping circle+number pairs found to group.",
      );
    } catch (error) {
      setStatus(`Error: ${(error as Error).message}`);
    }
  }, []);

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>
          <FormattedMessage
            defaultMessage="Create native Canva groups (same as selecting the circle + number and pressing <strong>⌘G</strong>) so each badge moves as one unit."
            description="Instructions for grouping number badges."
            values={{
              strong: (chunks) => <strong>{chunks}</strong>,
            }}
          />
        </Text>
        <Button
          variant="primary"
          onClick={insertGroupedNumberBadges}
          disabled={!isSupported(addElementAtPoint)}
          stretch
        >
          {intl.formatMessage({
            defaultMessage: "Insert 1–100 grouped badges (⌘G)",
            description: "Button to insert 100 grouped number circles",
          })}
        </Button>
        <Button
          variant="secondary"
          onClick={groupExistingNumberCircles}
          stretch
        >
          {intl.formatMessage({
            defaultMessage: "⌘G pair circles + numbers already on page",
            description: "Button to group existing circle and number pairs",
          })}
        </Button>
        <Text>
          <FormattedMessage
            defaultMessage="
              Click the button below to add a lower third text element with the
              name <strong>tuncer karaarslan</strong> to the current page.
              After adding, apply a <strong>Fade</strong> entrance animation
              manually in the Canva editor.
            "
            description="Instructions for adding lower third text."
            values={{
              strong: (chunks) => <strong>{chunks}</strong>,
            }}
          />
        </Text>
        <Button
          variant="primary"
          onClick={addLowerThird}
          disabled={!isSupported(addElementAtPoint)}
          stretch
        >
          {intl.formatMessage({
            defaultMessage: "Add Lower Third",
            description: "Button text to add lower third text element",
          })}
        </Button>

        <Text>
          <FormattedMessage
            defaultMessage="Reusable Claude AI Architect course components — click to add a native shape to the current page."
            description="Instructions for adding reusable shape components."
          />
        </Text>
        <Button
          variant="secondary"
          onClick={() => addShapeComponent("shield", "Shield")}
          disabled={!isSupported(addElementAtPoint)}
          stretch
        >
          {intl.formatMessage({
            defaultMessage: "Add Shield (Cyan)",
            description: "Button text to add the shield component",
          })}
        </Button>
        <Button
          variant="secondary"
          onClick={() => addShapeComponent("hexagon", "Hexagon")}
          disabled={!isSupported(addElementAtPoint)}
          stretch
        >
          {intl.formatMessage({
            defaultMessage: "Add Hexagon (Purple)",
            description: "Button text to add the hexagon component",
          })}
        </Button>
        <Button
          variant="secondary"
          onClick={() => addShapeComponent("cylinder", "Cylinder")}
          disabled={!isSupported(addElementAtPoint)}
          stretch
        >
          {intl.formatMessage({
            defaultMessage: "Add Cylinder (Emerald)",
            description: "Button text to add the cylinder component",
          })}
        </Button>
        <Button
          variant="secondary"
          onClick={() => addShapeComponent("octagon", "Octagon")}
          disabled={!isSupported(addElementAtPoint)}
          stretch
        >
          {intl.formatMessage({
            defaultMessage: "Add Octagon (Amber)",
            description: "Button text to add the octagon component",
          })}
        </Button>

        {status && (
          <Text tone={status.startsWith("Error") ? "critical" : "positive"}>
            {status}
          </Text>
        )}
      </Rows>
    </div>
  );
};
