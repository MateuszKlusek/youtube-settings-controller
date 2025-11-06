import type { typedRuntimeOnMessageAddListener } from "../lib/chrome";
import type { LogMessage } from "../lib/logger";

// --------------------- YTData (payload) ------------------------------------ //
export type YTData = YTDataCaptions & YTDataStreamingData & YTDataVideoDetails;

type YTDataCaptions = {
  captions?: {
    playerCaptionsTracklistRenderer?: {
      audioTracks?: {
        audioTrackId: string;
        captionsInitialState: string;
        defaultCaptionTrackIndex: number;
        hasDefaultTrack: boolean;
      }[];
      defaultAudioTrackIndex: number;
    };
  };
};

type YTDataStreamingData = {
  streamingData?: {
    adaptiveFormats?: {
      audioTrack?: {
        displayName: string;
        id: string;
        audioIsDefault?: boolean;
        isAutoDubbed?: boolean;
      };
    }[];
  };
};

type YTDataVideoDetails = {
  videoDetails?: {
    title: string;
    videoId: string;
  };
};

// --------------------- ActiveDownloads -------------------------------- //

export type ActiveDownloadsItem = {
  downloadId: number | undefined;
};

export type ActiveDownloadsMap = Map<number, ActiveDownloadsItem>;

// --------------------- RuntimeMessage -------------------------------- //

export type RuntimeMessage =
  | { type: "LOG_ENTRY"; logItem: LogMessage }
  | { type: "DOWNLOAD_LOG_FILE" }
  | { type: "DOWNLOAD_FINISHED" };

export type RuntimeMessageType = RuntimeMessage["type"];

// --------------------- Storage --------------------------------------- //

export type StorageLocal = {
  queuedLogs: {
    id: string;
    date: Date | string;
    logs: LogMessage[];
    videoId: string | undefined;
  }[];
  testing: number;
};

export type StorageSync = {
  extensionEnabled: boolean;
};

// --------------------- Chrome Derived -------------------------------- //

export type MessageListener = Parameters<
  typeof typedRuntimeOnMessageAddListener
>[0];

export type Message = Parameters<MessageListener>[0];

// --------------------- Sequence Execution -------------------------------- //

export type SequenceExecutionResult = "SUCCESS" | "SKIPPED" | "FAILED";
