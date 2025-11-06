import { MARKER } from "./constants";
import { executeSequence } from "./lib/execution";
import { Logger } from "./lib/logger";
import { AbortControllerManager } from "./lib/managers/abortControllerManager";
import { ActionManager } from "./lib/managers/actionManager";
import { SetupMessageListenerManager } from "./lib/managers/setupMessageListenerManager";
import { VideoIdentityManager } from "./lib/managers/videoIdentityManager";
import { getTracksDataFromPayload, getVideoIdFromUrl } from "./lib/misc";
import { injectExternalScript, makeToken } from "./lib/scripts";
import type { YTData } from "./types/core";

// --------------------- managers --------------------------------------- //

const actionManager = new ActionManager();
const abortControllerManager = new AbortControllerManager();
const setupMessageListenerManager = new SetupMessageListenerManager();

// --------------------- message handler -------------------------------- //

function setupMessageListener() {
  const currentVersion = setupMessageListenerManager.createNewVersion();
  abortControllerManager.logNumberOfAbortControllers();
  abortControllerManager.abortAllAbortControllers();

  window.removeEventListener("message", handleMessage);
  window.addEventListener("message", handleMessage);

  async function handleMessage(event) {
    if (!setupMessageListenerManager.isCurrentVersion(currentVersion)) return;
    if (event.origin !== window.location.origin) return;
    if (event.source !== window) return;
    if (!location.href.includes("watch?v=")) return;

    const data = event.data;
    if (!data || data[MARKER] !== true) return;
    if (data.token !== TOKEN) return;

    let storageProperties;
    try {
      storageProperties = await chrome?.storage?.sync?.get("extensionEnabled");
    } catch (err) {
      console.error("Error getting storage properties:", err);
      storageProperties = false;
    }

    if (!storageProperties?.extensionEnabled) return;

    const uuid = crypto.randomUUID();
    const logger = new Logger(uuid);
    const videoIdentityManager = new VideoIdentityManager();

    try {
      let payload: YTData | null = null;
      try {
        payload = JSON.parse(data?.payload || "{}") as YTData;
      } catch (e) {
        logger.log({
          type: "FAILED_TO_PARSE_PAYLOAD",
          payload: (e as Error)?.message,
        });
        return;
      }

      const urlVideoId = getVideoIdFromUrl();
      const payloadVideoId = payload?.videoDetails?.videoId;

      if (urlVideoId && payloadVideoId && urlVideoId !== payloadVideoId) {
        logger.registerVideoId(payloadVideoId);
        logger.log({
          type: "VIDEO_ID_MISMATCH",
          payload: `URL videoId: ${urlVideoId}, Payload videoId: ${payloadVideoId} - ignoring message`,
        });
        return;
      }

      const videoId = payloadVideoId || urlVideoId || "";
      logger.registerVideoId(videoId);

      logger.log({ type: "PAYLOAD", payload });

      logger.log({
        type: "VIDEO_ID_CHECK",
        payload: { urlVideoId, payloadVideoId },
      });
      logger.log({ type: "MESSAGE_TYPE", payload: data?.type });

      const { defaultAudioTrackDisplayName, audioIdToDisplayNameLookup } =
        getTracksDataFromPayload(payload);

      if (
        !defaultAudioTrackDisplayName ||
        audioIdToDisplayNameLookup.size < 2
      ) {
        logger.log({ type: "SKIPPED_SEQUENCE_NO_TRACK_SELECTION_POSSIBLE" });
        return;
      }

      const signal =
        abortControllerManager.createAbortController(currentVersion).signal;
      abortControllerManager.logNumberOfAbortControllers();

      // --------------------- sequence execution -------------------------------- //
      try {
        const result = await actionManager.executeAction(videoId, async () => {
          if (signal.aborted) return;

          logger.log({
            type: "ACTION_STARTED",
            payload: `Executing sequence for videoId: ${videoId}`,
          });

          for (let attempts = 1; attempts <= 3; attempts++) {
            const sequenceExecutionResult = await executeSequence({
              defaultAudioTrackDisplayName,
              logger,
              signal,
              videoIdentityManager,
            });

            if (signal.aborted) break;

            if (sequenceExecutionResult === "SUCCESS") {
              const registerVideoIdResult =
                await videoIdentityManager.registerVideoId();
              if (registerVideoIdResult === "restart") {
                // TODO implement restart (actually implement the defaulting state/cleanup)
                continue;
              }
            }

            break;
          }

          logger.log({
            type: "ACTION_COMPLETED",
            payload: `Completed sequence for videoId: ${videoId}`,
          });
        });

        if (result === null) {
          logger.log({
            type: "ACTION_SKIPPED",
            payload: `Skipped execution for videoId: ${videoId} - already in progress`,
          });
        }
      } catch (e) {
        logger.log({
          type: "FAILED_TO_PARSE_PAYLOAD_FROM_INJECTED_SCRIPT",
          payload: (e as Error)?.message,
        });
      } finally {
        if (setupMessageListenerManager.isCurrentVersion(currentVersion)) {
          abortControllerManager.deleteAbortController(currentVersion);
        }
        abortControllerManager.logNumberOfAbortControllers();
      }
    } catch (e) {
      logger.log({
        type: "FAILED_TO_PARSE_PAYLOAD_FROM_INJECTED_SCRIPT",
        payload: (e as Error)?.message,
      });
    }
  }
}

// --------------------- message listeners registration ------------------ //

setupMessageListener();

const pushState = history.pushState;
history.pushState = function (...args) {
  pushState.apply(this, args);
  setupMessageListener();
};

const replaceState = history.replaceState;
history.replaceState = function (...args) {
  replaceState.apply(this, args);
  setupMessageListener();
};

window.addEventListener("popstate", setupMessageListener);

// --------------------- script injections ------------------------------ //

const TOKEN = makeToken();
injectExternalScript(TOKEN, "scripts/initial-data.js");
injectExternalScript(TOKEN, "scripts/navigation-data.js");
