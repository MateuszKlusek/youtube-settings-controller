import type { Logger } from "./logger";

export const waitForElementToDisappear = ({
  callback,
  selector,
  logger,
  signal,
}: {
  callback: () => void;
  selector: string;
  logger: Logger;
  signal: AbortSignal;
}): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new Error("Wait for element to disappear aborted"));
      return;
    }
    const targetNode = document.body;

    if (!document.querySelector(selector)) {
      logger.log({
        type: "ELEMENT_ALREADY_DISAPPEARED",
        payload: selector,
        sendMessageToBackground: false,
      });
      if (signal.aborted) {
        reject(new Error("Operation aborted"));
        return;
      }
      callback();
      resolve();
      return;
    }

    const observer = new MutationObserver(() => {
      if (signal?.aborted) {
        observer.disconnect();
        reject(new Error("Operation aborted"));
        return;
      }
      const exists = document.querySelector(selector);
      if (!exists) {
        logger.log({
          type: "ELEMENT_DISAPPEARED",
          payload: selector,
          sendMessageToBackground: false,
        });
        observer.disconnect();
        if (signal.aborted) {
          reject(new Error("Operation aborted"));
          return;
        }
        resolve();
        callback();
      }
    });

    if (signal) {
      signal.addEventListener("abort", () => {
        observer.disconnect();
        reject(new Error("Operation aborted"));
      });
    }

    observer.observe(targetNode, {
      childList: true,
      subtree: true,
    });
  });
};

export const waitForElementToAppear = ({
  callback,
  selector,
  logger,
  signal,
}: {
  callback: () => void;
  selector: string;
  logger: Logger;
  signal: AbortSignal;
}): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new Error("Wait for element to appear aborted"));
      return;
    }
    const targetNode = document.body;

    if (document.querySelector(selector)) {
      logger.log({
        type: "ELEMENT_ALREADY_EXISTS",
        payload: selector,
        sendMessageToBackground: false,
      });
      if (signal.aborted) {
        reject(new Error("Operation aborted"));
        return;
      }
      callback();
      resolve();
      return;
    }

    const observer = new MutationObserver(() => {
      if (signal?.aborted) {
        observer.disconnect();
        reject(new Error("Operation aborted"));
        return;
      }

      const exists = document.querySelector(selector);
      if (exists) {
        logger.log({
          type: "ELEMENT_APPEARED",
          payload: selector,
          sendMessageToBackground: false,
        });
        observer.disconnect();
        if (signal.aborted) {
          reject(new Error("Operation aborted"));
          return;
        }
        callback();
        resolve();
      }
    });

    if (signal) {
      signal.addEventListener("abort", () => {
        observer.disconnect();
        reject(new Error("Operation aborted"));
      });
    }

    observer.observe(targetNode, {
      childList: true,
      subtree: true,
    });
  });
};
