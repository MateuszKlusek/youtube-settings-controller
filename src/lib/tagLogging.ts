import { debugLogsEnabled } from "../constants";

export class ClassWithLogging {
  protected logTag: string;
  protected debugLogsEnabled: boolean;

  constructor(logTag?: string) {
    this.logTag = logTag || `[${this.constructor.name}]`;
    this.debugLogsEnabled = debugLogsEnabled;
  }

  protected log(...args: unknown[]) {
    if (this.debugLogsEnabled) {
      console.log(this.logTag, ...args);
    }
  }

  protected warn(...args: unknown[]) {
    if (this.debugLogsEnabled) {
      console.warn(this.logTag, ...args);
    }
  }

  protected error(...args: unknown[]) {
    if (this.debugLogsEnabled) {
      console.error(this.logTag, ...args);
    }
  }
}
