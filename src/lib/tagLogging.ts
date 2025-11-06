import { isDevelopment } from "../constants";

export class ClassWithLogging {
  protected logTag: string;
  protected isDevelopment: boolean;

  constructor(logTag?: string) {
    this.logTag = logTag || `[${this.constructor.name}]`;
    this.isDevelopment = isDevelopment;
  }

  protected log(...args: unknown[]) {
    if (this.isDevelopment) {
      console.log(this.logTag, ...args);
    }
  }

  protected warn(...args: unknown[]) {
    if (this.isDevelopment) {
      console.warn(this.logTag, ...args);
    }
  }

  protected error(...args: unknown[]) {
    if (this.isDevelopment) {
      console.error(this.logTag, ...args);
    }
  }
}
