import { Button, Container, Divider, Switch, Title } from "@mantine/core";
import { useEffect } from "react";
import { ERROR_MESSAGES, isDevelopment } from "../constants";
import { useChromeStorage } from "../hooks/useChromeStorage";
import { useIsLoading } from "../hooks/useIsLoading";
import {
  typedRuntimeOnMessageAddListener,
  typedRuntimeOnMessageRemoveListener,
  typedRuntimeSendMessage,
} from "../lib/chrome";
import type { Message } from "../types/core";

export const App = () => {
  const [extensionEnabled, setExtensionEnabled] = useChromeStorage(
    "extensionEnabled",
    true
  );

  const downloadButtonLoading = useIsLoading();

  useEffect(() => {
    const messageListener = (message: Message) => {
      if (message.type === "DOWNLOAD_FINISHED") {
        downloadButtonLoading.stopLoading();
      }
    };

    typedRuntimeOnMessageAddListener(messageListener);

    return () => {
      typedRuntimeOnMessageRemoveListener(messageListener);
    };
  }, [downloadButtonLoading]);

  const handleDownloadLogs = async () => {
    downloadButtonLoading.startLoading();
    try {
      const response = await new Promise<{ ok: boolean; error?: string }>(
        (resolve) => {
          typedRuntimeSendMessage({ type: "DOWNLOAD_LOG_FILE" }, (response) => {
            if (chrome.runtime?.lastError) {
              resolve({ ok: false, error: chrome.runtime.lastError.message });
            } else {
              resolve(response || { ok: false, error: "No response" });
            }
          });
        }
      );

      if (response?.error === ERROR_MESSAGES.CHROME_APIS_NOT_AVAILABLE) {
        setTimeout(() => {
          downloadButtonLoading.stopLoading();
        }, 500);
      }
    } catch (error) {
      console.error("Error during download:", error);
      downloadButtonLoading.stopLoading();
    }
  };

  return (
    <Container
      size="md"
      className="flex flex-col justify-center gap-4 py-4 px-6 bg-white flex-1"
    >
      <Title order={5}>
        YouTube Settings Controller {isDevelopment ? "[DEV]" : ""}
      </Title>
      <Switch
        checked={!!extensionEnabled}
        label="Extension enabled"
        onChange={(event) => setExtensionEnabled?.(event.currentTarget.checked)}
      />

      <Divider color="blue" size="xs" />
      <Button
        onClick={handleDownloadLogs}
        loading={downloadButtonLoading.isLoading}
        size="compact-sm"
      >
        Download logs
      </Button>
    </Container>
  );
};
