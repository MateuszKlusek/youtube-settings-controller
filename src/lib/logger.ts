import { debugLogsEnabled, SHORT_LOGS } from "../constants";
import { typedRuntimeSendMessage } from "./chrome";

export type LogMessage = {
  type: string;
  payload?: string | object;
  date: Date | string;
  contextId: string;
  logId: string;
  seq: number;
  videoId: string | undefined;
  version: string;
};

type PayloadMessage = Omit<
  LogMessage,
  "date" | "contextId" | "seq" | "logId" | "videoId" | "version"
> & {
  sendMessageToBackground?: boolean;
};

export class Logger {
  private contextId: string;
  private seq: number;
  private videoId: string | undefined;
  private version: string;

  constructor({ contextId, version }: { contextId: string; version: string }) {
    this.contextId = contextId;
    this.seq = 0;
    this.version = version;
  }

  public registerVideoId(videoId: string) {
    this.videoId = videoId;
  }

  public log({
    type,
    payload,
    sendMessageToBackground = true,
  }: PayloadMessage) {
    const logItem: LogMessage = {
      type,
      payload,
      date: new Date().toISOString(),
      contextId: this.contextId,
      seq: this.seq,
      logId: crypto.randomUUID(),
      videoId: this.videoId,
      version: this.version,
    };

    if (debugLogsEnabled) {
      if (SHORT_LOGS) {
        const shortLog = {
          videoId: logItem.videoId,
          type: logItem.type,
          payload: logItem.payload,
        };
        console.log(shortLog);
      } else {
        console.log(logItem);
      }
    }

    if (sendMessageToBackground) {
      typedRuntimeSendMessage({ type: "LOG_ENTRY", logItem })
        .then(() => {
          if (chrome.runtime.lastError) {
            return;
          }
        })
        .catch((error) => {
          if (debugLogsEnabled) {
            console.warn("Failed to send log message:", error);
          }
        });
    }
    this.incrementCounter();
  }

  private incrementCounter = () => {
    this.seq++;
  };
}
