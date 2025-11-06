import type { RuntimeMessage, StorageLocal } from "../types/core";

export const typedRuntimeSendMessage = chrome.runtime
  .sendMessage<RuntimeMessage>;

export const typedStorageLocalGetter = chrome.storage.local.get.bind(
  chrome.storage.local
) as (key: keyof Partial<StorageLocal>) => Promise<Partial<StorageLocal>>;

export const typedStorageLocalSetter = chrome.storage.local.set.bind(
  chrome.storage.local
) as (value: Partial<StorageLocal>) => Promise<void>;

export const typedRuntimeOnMessageAddListener =
  chrome.runtime.onMessage.addListener.bind(chrome.runtime.onMessage) as (
    listener: (message: RuntimeMessage) => void
  ) => void;

export const typedRuntimeOnMessageRemoveListener =
  chrome.runtime.onMessage.removeListener.bind(chrome.runtime.onMessage) as (
    listener: (message: RuntimeMessage) => void
  ) => void;
