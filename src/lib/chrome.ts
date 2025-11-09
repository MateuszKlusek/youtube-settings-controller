import { ERROR_MESSAGES } from "../constants";
import type { RuntimeMessage, StorageLocal } from "../types/core";

const isChromeAvailable = () =>
  typeof chrome !== "undefined" && chrome?.runtime && chrome?.storage;

// TODO: to implement all proxied methods and properties as I go along

const getChromeRuntime = () => {
  if (isChromeAvailable()) {
    return chrome.runtime;
  }

  return {
    sendMessage: <T = unknown>(
      message: T,
      callback?: (response: T) => void
    ) => {
      console.warn(
        "[DEV] chrome.runtime.sendMessage called but Chrome APIs are not available"
      );
      if (callback) {
        callback({
          ok: false,
          error: ERROR_MESSAGES.CHROME_APIS_NOT_AVAILABLE,
        } as T);
      }
    },
    onMessage: {
      addListener: (
        ...args: Parameters<typeof chrome.runtime.onMessage.addListener>
      ) => {
        void args;
        console.warn(
          "[DEV] chrome.runtime.onMessage.addListener called but Chrome APIs are not available"
        );
      },
      removeListener: (
        ...args: Parameters<typeof chrome.runtime.onMessage.removeListener>
      ) => {
        void args;
        console.warn(
          "[DEV] chrome.runtime.onMessage.removeListener called but Chrome APIs are not available"
        );
      },
    },
    lastError: undefined,
  } as typeof chrome.runtime;
};

const getChromeStorage = () => {
  if (isChromeAvailable()) {
    return chrome.storage;
  }

  return {
    local: {
      get: (...args: Parameters<typeof chrome.storage.local.get>) => {
        void args;
        console.warn(
          "[DEV] chrome.storage.local.get called but Chrome APIs are not available"
        );
      },
      set: (...args: Parameters<typeof chrome.storage.local.set>) => {
        void args;
        console.warn(
          "[DEV] chrome.storage.local.set called but Chrome APIs are not available"
        );
      },
    },
  } as typeof chrome.storage;
};

const chromeRuntime = getChromeRuntime();
const chromeStorage = getChromeStorage();

// ----------------------------- Exports ----------------------------- //

export const typedRuntimeSendMessage =
  chromeRuntime.sendMessage<RuntimeMessage>;

export const typedStorageLocalGetter = chromeStorage.local.get.bind(
  chromeStorage.local
) as (key: keyof Partial<StorageLocal>) => Promise<Partial<StorageLocal>>;

export const typedStorageLocalSetter = chromeStorage.local.set.bind(
  chromeStorage.local
) as (value: Partial<StorageLocal>) => Promise<void>;

export const typedRuntimeOnMessageAddListener =
  chromeRuntime.onMessage.addListener.bind(chromeRuntime.onMessage) as (
    listener: (message: RuntimeMessage) => void
  ) => void;

export const typedRuntimeOnMessageRemoveListener =
  chromeRuntime.onMessage.removeListener.bind(chromeRuntime.onMessage) as (
    listener: (message: RuntimeMessage) => void
  ) => void;
