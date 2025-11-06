import { ClassWithLogging } from "../tagLogging";

export class SetupMessageListenerManager extends ClassWithLogging {
  private messageListenerVersion: number = 0;

  constructor(logTag: string = "[SetupMessageListener]") {
    super(logTag);
  }

  public createNewVersion(): number {
    const currentVersion = ++this.messageListenerVersion;
    this.log(`Version: ${currentVersion}`);
    return currentVersion;
  }

  public isCurrentVersion(version: number): boolean {
    return version === this.messageListenerVersion;
  }

  public getMessageListenerVersion(): number {
    return this.messageListenerVersion;
  }
}
