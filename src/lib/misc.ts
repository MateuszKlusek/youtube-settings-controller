import type { YTData } from "../types/core";

export const retry = async <T>(
  operation: () => T | Promise<T>,
  maxAttempts: number = 10,
  delay: number = 2000,
  signal: AbortSignal
): Promise<T> => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    if (signal.aborted) throw new Error("Operation aborted");
    try {
      const result = await operation();
      if (signal.aborted) throw new Error("Operation aborted");
      if (result) {
        return result;
      }
      throw new Error(`Operation returned false on attempt ${attempt}`);
    } catch (error) {
      if (signal.aborted) throw new Error("Operation aborted");
      console.log(
        `Attempt ${attempt}/${maxAttempts} failed:`,
        (error as Error).message
      );

      if (attempt === maxAttempts) {
        throw new Error(`Operation failed after ${maxAttempts} attempts`);
      }

      await new Promise((resolve, reject) => {
        if (signal?.aborted) {
          reject(new Error("Operation aborted"));
          return;
        }
        const timeout = setTimeout(resolve, delay);
        signal?.addEventListener("abort", () => {
          clearTimeout(timeout);
          reject(new Error("Operation aborted"));
        });
      });
    }
  }
  throw new Error("Unexpected end of retry loop");
};

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// so far it's only for watch?v=
// potential to expand with shorts and animated thumbnails
export const getVideoIdFromUrl = (): string | undefined => {
  const url = location.href;
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : undefined;
};

export const getTracksDataFromPayload = (
  payload: YTData
): {
  defaultAudioTrackDisplayName: string | undefined;
  audioIdToDisplayNameLookup: Map<string, string>;
} => {
  let defaultAudioTrackDisplayName;
  const audioIdToDisplayNameLookup = new Map<string, string>();
  payload?.streamingData?.adaptiveFormats?.forEach((i) => {
    if (i.audioTrack) {
      audioIdToDisplayNameLookup.set(i.audioTrack.id, i.audioTrack.displayName);
    }
    if (!i.audioTrack?.isAutoDubbed) {
      defaultAudioTrackDisplayName = i.audioTrack?.displayName;
    }
  });

  return {
    defaultAudioTrackDisplayName,
    audioIdToDisplayNameLookup,
  };
};
