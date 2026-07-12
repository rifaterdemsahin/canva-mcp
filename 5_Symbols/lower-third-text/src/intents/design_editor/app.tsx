import { useFeatureSupport } from "@canva/app-hooks";
import { Button, Rows, Text } from "@canva/app-ui-kit";
import { addElementAtPoint, getCurrentPageContext } from "@canva/design";
import { FormattedMessage, useIntl } from "react-intl";
import { useState, useCallback } from "react";
import * as styles from "styles/components.css";

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

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
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
        {status && (
          <Text tone={status.startsWith("Error") ? "critical" : "positive"}>
            {status}
          </Text>
        )}
      </Rows>
    </div>
  );
};
