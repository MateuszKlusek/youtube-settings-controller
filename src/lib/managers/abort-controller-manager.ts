import { ClassWithLogging } from "../tag-logging";

export class AbortControllerManager extends ClassWithLogging {
  private abortControllers: Map<number, AbortController> = new Map();

  constructor(logTag: string = "[AbortControllerManager]") {
    super(logTag);
    this.abortControllers = new Map();
  }

  public logNumberOfAbortControllers(): void {
    this.log(
      `${this.logTag} Number of abort controllers: ${this.abortControllers.size}`
    );
  }

  public abortAllAbortControllers(): void {
    this.abortControllers.forEach((controller) => {
      this.log(`Aborting controller`);
      controller.abort();
    });
    this.abortControllers.clear();
  }

  public createAbortController(version: number): AbortController {
    const abortController = new AbortController();
    this.abortControllers.set(version, abortController);
    this.log(`Created controller for version: ${version}`);
    return abortController;
  }

  public deleteAbortController(version: number): void {
    this.abortControllers.delete(version);
    this.log(`Deleted controller for version: ${version}`);
  }
}
