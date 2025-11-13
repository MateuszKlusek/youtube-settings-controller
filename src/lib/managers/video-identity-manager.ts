import { DOM_TARGETS } from "../../constants";
import { ClassWithLogging } from "../tag-logging";

export class VideoIdentityManager extends ClassWithLogging {
  private videoIds: Set<string> = new Set();

  constructor(logTag: string = "[VideoIdentityManager]") {
    super(logTag);
    this.videoIds = new Set();
  }

  public async registerVideoId(): Promise<"restart" | undefined> {
    const videoId = await this.getVideoPlayerUrl();

    if (!videoId) {
      this.log(`Video ID is empty`);
      return;
    }

    if (this.videoIds.size === 0) {
      this.log(`First video ID registered: ${videoId}`);
      this.videoIds.add(videoId);
      return;
    }

    /**
     * critical, if the size is non zero, and the videoId is not in the set
     * with a success, I expect the videoId to be in the set
     */
    if (this.videoIds.has(videoId)) {
      this.log(
        `Video ID ${videoId} already registered, looks like the video is the same, refresh required`
      );
      return "restart";
    }
  }

  private getVideoPlayerUrl = async () => {
    const videoPlayer = document.querySelector<HTMLVideoElement>(
      DOM_TARGETS.VIDEO_PLAYER
    );
    return await videoPlayer?.getAttribute("src");
  };
}
