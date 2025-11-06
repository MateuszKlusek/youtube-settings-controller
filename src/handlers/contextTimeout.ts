import { STORAGE_LOG_SIZE_LIMIT } from "../constants";
import {
  typedStorageLocalGetter,
  typedStorageLocalSetter,
} from "../lib/chrome";
import type { ICallback } from "../lib/managers/contextTimeoutManager";

export const handleContextTimeout: ICallback = async (
  contextId,
  logMessages
) => {
  const storageLogQueue = await typedStorageLocalGetter("queuedLogs");
  const _queuedLogs = storageLogQueue?.queuedLogs || [];

  if (_queuedLogs.length >= STORAGE_LOG_SIZE_LIMIT) {
    _queuedLogs.shift();
  }

  _queuedLogs.push({
    id: contextId,
    date: new Date().toISOString(),
    logs: logMessages,
    videoId: logMessages?.[0]?.videoId,
  });

  await typedStorageLocalSetter({ queuedLogs: _queuedLogs });
};
