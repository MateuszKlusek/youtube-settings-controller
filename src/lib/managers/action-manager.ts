import { ClassWithLogging } from "../tag-logging";

export class ActionManager extends ClassWithLogging {
  private activeExecutions: Map<string, Promise<void>> = new Map();

  constructor(logTag: string = "[ActionManager]") {
    super(logTag);
  }

  async executeAction<T>(
    videoId: string,
    action: () => Promise<T>
  ): Promise<T | null> {
    if (!videoId) {
      return action();
    }

    if (this.activeExecutions.has(videoId)) {
      this.log(
        `Skipping execution for videoId ${videoId} - already in progress`
      );
      return null;
    }

    const executionPromise = action()
      .then((result) => {
        return result;
      })
      .catch((error) => {
        this.error(`Error executing action for videoId ${videoId}:`, error);
        throw error;
      })
      .finally(() => {
        this.activeExecutions.delete(videoId);
        this.log(`Released lock for videoId ${videoId}`);
      });

    this.activeExecutions.set(videoId, executionPromise as Promise<void>);

    return executionPromise;
  }

  public isExecuting(videoId: string): boolean {
    return this.activeExecutions.has(videoId);
  }

  public getActiveCount(): number {
    return this.activeExecutions.size;
  }

  public clear(): void {
    this.activeExecutions.clear();
  }
}
