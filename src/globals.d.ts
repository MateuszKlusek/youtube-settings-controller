export {};

declare global {
  interface Window {
    ytplayer?: {
      config?: {
        args?: Record<string, unknown>;
      };
    };
    ytInitialPlayerResponse: Record<string, unknown>;
  }
}
