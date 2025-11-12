import {
  clickOnOption,
  goToAudioTrackMenu,
  toggleSettingsMenu,
} from "../steps";
import type { SequenceExecutionResult } from "../types/core";
import { Logger } from "./logger";
import { VideoIdentityManager } from "./managers/videoIdentityManager";
import { retry } from "./misc";

export async function executeSequence({
  defaultAudioTrackDisplayName,
  logger,
  signal,
  videoIdentityManager,
}: {
  logger: Logger;
  defaultAudioTrackDisplayName: string;
  signal: AbortSignal;
  videoIdentityManager: VideoIdentityManager;
}): Promise<SequenceExecutionResult> {
  // TODO implement state defaulting
  try {
    let status: SequenceExecutionResult = "FAILED";

    if (signal.aborted) throw new Error("Sequence aborted");

    await retry(
      async () => await toggleSettingsMenu({ logger, goal: "open", signal }),
      10,
      1000,
      signal
    );

    if (signal.aborted) throw new Error("Sequence aborted");

    await retry(
      async () => await goToAudioTrackMenu(logger, signal),
      10,
      1000,
      signal
    );

    if (signal.aborted) throw new Error("Sequence aborted");

    await videoIdentityManager.registerVideoId();

    await retry(
      async () =>
        (status = await clickOnOption({
          defaultAudioTrackDisplayName,
          logger,
          signal,
        })),
      10,
      1000,
      signal
    );
    return status;
  } catch (error) {
    const isSkipped =
      error instanceof Error && error.message.includes("Skipped");
    logger.log({
      type: "SEQUENCE_FAILED",
      payload: (error as Error)?.message,
    });

    return isSkipped ? "SKIPPED" : "FAILED";
  }
}
