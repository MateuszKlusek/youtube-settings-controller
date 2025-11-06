import { handleContextTimeout } from "./handlers/contextTimeout";
import {
  typedRuntimeOnMessageAddListener,
  typedRuntimeSendMessage,
  typedStorageLocalGetter,
} from "./lib/chrome";
import { ContextTimeoutManager } from "./lib/managers/contextTimeoutManager";
import { registerDownloadsListeners } from "./listeners/downloads";
import type { ActiveDownloadsMap } from "./types/core";

console.log("Background worker starting...");
console.log("Timestamp:", new Date().toISOString());

chrome.runtime.onStartup.addListener(() => {
  console.log("Extension startup detected");
});

chrome.runtime.onInstalled.addListener((details) => {
  console.log("Extension installed/updated:", details.reason);
});

const activeDownloads: ActiveDownloadsMap = new Map();
const contextTimeoutManager = new ContextTimeoutManager(
  3000,
  handleContextTimeout
);

typedRuntimeOnMessageAddListener((msg) => {
  if (msg.type === "LOG_ENTRY") {
    const logItem = msg?.logItem ?? {};
    contextTimeoutManager.addEntry(logItem);
    return false;
  }

  if (msg.type === "DOWNLOAD_LOG_FILE") {
    typedStorageLocalGetter("queuedLogs")
      .then(({ queuedLogs }) => {
        console.log(
          "Retrieved logs from storage:",
          queuedLogs?.length || 0,
          "entries"
        );
        const logContent = JSON.stringify(queuedLogs || [], null, 2);
        const blob = new Blob([logContent], { type: "application/json" });

        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = reader.result as string;

          const timestamp = new Date().getTime();

          chrome.downloads.download(
            {
              url: dataUrl,
              filename: `yt-settings-controller-log-${timestamp}.json`,
              saveAs: true,
            },
            (downloadId) => {
              if (chrome.runtime.lastError) {
                console.error("Download error:", chrome.runtime.lastError);
                // User cancelled or download failed - notify popup to stop loading
                typedRuntimeSendMessage({
                  type: "DOWNLOAD_FINISHED",
                }).catch((error) => {
                  // Ignore if popup is closed
                  console.error(
                    "Could not send DOWNLOAD_FINISHED message:",
                    error
                  );
                });
              } else {
                console.log("Download initiated successfully, ID:", downloadId);
                activeDownloads.set(downloadId, { downloadId });
              }
            }
          );
        };
        reader.onerror = () => {
          console.error("FileReader error:", reader.error);
          typedRuntimeSendMessage({
            type: "DOWNLOAD_FINISHED",
          }).catch((error) => {
            console.error("Could not send DOWNLOAD_FINISHED message:", error);
          });
        };
        reader.readAsDataURL(blob);
      })
      .catch((error) => {
        console.error("Error geting logs from storage:", error);
        typedRuntimeSendMessage({
          type: "DOWNLOAD_FINISHED",
        }).catch((err) => {
          console.error("Could not send DOWNLOAD_FINISHED message:", err);
        });
      });

    return false;
  }

  return true;
});

registerDownloadsListeners({ activeDownloads });
