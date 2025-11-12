import { DOM_TARGETS } from "./constants";
import type { Logger } from "./lib/logger";
import {
  waitForElementToAppear,
  waitForElementToDisappear,
} from "./lib/observer";
import type { SequenceExecutionResult } from "./types/core";

export async function toggleSettingsMenu({
  logger,
  goal,
  signal,
}: {
  logger: Logger;
  goal: "open" | "close";
  signal: AbortSignal;
}): Promise<boolean> {
  const menuButton = document.querySelector<HTMLButtonElement>(
    DOM_TARGETS.SETTINGS_BUTTON
  );

  if (!menuButton) {
    console.error("Settings button not found");
    return false;
  }

  menuButton.click();
  const awaitingFunction =
    goal === "open" ? waitForElementToAppear : waitForElementToDisappear;

  const selector = DOM_TARGETS.SETTINGS_BUTTON_OPENED;

  await awaitingFunction({
    callback: async () => {
      return true;
    },
    selector,
    logger,
    signal,
  });
  return true;
}

export async function goToAudioTrackMenu(
  logger: Logger,
  signal: AbortSignal
): Promise<boolean> {
  await waitForElementToAppear({
    callback: async () => {
      const audioMenuItem = document.querySelector<HTMLElement>(
        DOM_TARGETS.AUDIO_TRACK_MENU_ITEM
      );
      if (audioMenuItem) {
        logger.log({ type: "CLICK_AUDIO_TRACK_MENU" });
        audioMenuItem.click();
        return true;
      }
      throw new Error("Audio menu item not found");
    },
    selector: DOM_TARGETS.AUDIO_TRACK_MENU_ITEM,
    logger,
    signal,
  });
  return true;
}

export const clickOnOption = async ({
  defaultAudioTrackDisplayName,
  logger,
  signal,
}: {
  defaultAudioTrackDisplayName: string;
  logger: Logger;
  signal: AbortSignal;
}): Promise<SequenceExecutionResult> => {
  let status: SequenceExecutionResult = "FAILED";

  await waitForElementToDisappear({
    callback: async () => {},
    selector: DOM_TARGETS.AUDIO_TRACK_MENU_ITEM,
    logger,
    signal,
  });

  await waitForElementToAppear({
    callback: async () => {
      const selectedAudioTrack = document.querySelector<HTMLButtonElement>(
        DOM_TARGETS.SELECTED_AUDIO_TRACK
      );
      const selectedAudioTrackText = selectedAudioTrack?.textContent?.trim();

      logger.log({
        type: "SELECTED_AUDIO_TRACK",
        payload: selectedAudioTrackText,
      });
      logger.log({
        type: "WANTED_AUDIO_TRACK",
        payload: defaultAudioTrackDisplayName,
      });

      if (selectedAudioTrackText !== defaultAudioTrackDisplayName) {
        const element = Array.from(
          document.querySelectorAll<HTMLElement>(DOM_TARGETS.AUDIO_TRACK_OPTION)
        ).find((el) => el.textContent.trim() === defaultAudioTrackDisplayName);
        element?.click();
        logger.log({
          type: "CLICKED_ON_WANTED_AUDIO_TRACK",
          payload: defaultAudioTrackDisplayName,
        });
        status = "SUCCESS_CHANGED";
      } else {
        logger.log({
          type: "SKIPPED_AUDIO_TRACK_SELECTION_IS_DEFAULT",
          payload: selectedAudioTrackText,
        });
        status = "SUCCESS_NO_CHANGE";
      }
    },
    selector: DOM_TARGETS.SELECTED_AUDIO_TRACK,
    logger,
    signal,
  });

  await toggleSettingsMenu({ logger, goal: "close", signal });
  return status;
};
