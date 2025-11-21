import { isProduction } from "../constants";
import { typedRuntimeSendMessage } from "../lib/chrome";
import type { ActiveDownloadsMap } from "../types/core";

const finishingDownloadStates = ["complete", "interrupted"];

export const registerDownloadsListeners = ({
  activeDownloads,
}: {
  activeDownloads: ActiveDownloadsMap;
}) => {
  if (isProduction) {
    return;
  }

  return chrome.downloads.onChanged.addListener((downloadDelta) => {
    const downloadId = downloadDelta.id;

    for (const [messageId, downloadInfo] of activeDownloads.entries()) {
      if (
        downloadInfo.downloadId === downloadId &&
        finishingDownloadStates.includes(downloadDelta?.state?.current || "")
      ) {
        try {
          typedRuntimeSendMessage(
            {
              type: "DOWNLOAD_FINISHED",
            },
            () => {
              // silent the errors because the popup receiver is closed
              if (chrome?.runtime?.lastError) {
                return;
              }
            }
          );
          activeDownloads.delete(messageId);
        } catch (error) {
          console.error("Could not send DOWNLOAD_FINISHED message:", error);
        }
      }
      break;
    }
  });
};
