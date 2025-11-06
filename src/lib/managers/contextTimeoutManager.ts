import type { LogMessage } from "../logger";

type ContextMap = Record<string, LogMessage[]>;

export type ICallback = (
  contextId: string,
  logMessages: LogMessage[]
) => Promise<void>;

export class ContextTimeoutManager {
  private contextData: ContextMap = {};
  private timers: Record<string, ReturnType<typeof setTimeout>> = {};
  private duration: number;
  private callback: ICallback;
  private callbackChain: Promise<void> = Promise.resolve();

  constructor(duration: number, callback: ICallback) {
    this.duration = duration;
    this.callback = callback;
  }

  public addEntry(entry: LogMessage) {
    const { contextId } = entry;

    if (!this.contextData[contextId]) {
      this.contextData[contextId] = [];
    }
    this.contextData[contextId].push(entry);

    if (this.timers[contextId]) {
      clearTimeout(this.timers[contextId]);
    }

    this.timers[contextId] = setTimeout(() => {
      this.callbackChain = this.callbackChain
        .then(async () => {
          await this.callback(contextId, this.contextData[contextId]);
        })
        .catch((error) => {
          console.error("Error in context timeout callback:", error);
        })
        .finally(() => {
          delete this.contextData[contextId];
          delete this.timers[contextId];
        });
    }, this.duration);
  }

  public cleanContext(contextId: string) {
    if (this.contextData[contextId]) {
      clearTimeout(this.timers[contextId]);
      delete this.contextData[contextId];
    }
    delete this.timers[contextId];
  }
}
