import { QUEUE_LOGS_KEY, STORAGE_LOG_SIZE_LIMIT } from "../constants";
import {
  typedStorageLocalGetter,
  typedStorageLocalSetter,
} from "../lib/chrome";
import type { ICallback } from "../lib/managers/contextTimeoutManager";

export const handleContextTimeout: ICallback = async (
  contextId,
  logMessages
) => {
  const storageLocal = await typedStorageLocalGetter(QUEUE_LOGS_KEY);
  let queuedLogsPayload = storageLocal?.[QUEUE_LOGS_KEY] || [];

  if (queuedLogsPayload.length >= STORAGE_LOG_SIZE_LIMIT) {
    queuedLogsPayload = queuedLogsPayload.slice(-(STORAGE_LOG_SIZE_LIMIT - 1));
  }

  queuedLogsPayload.push({
    id: contextId,
    date: new Date().toISOString(),
    logs: logMessages,
    videoId: logMessages?.[0]?.videoId,
  });

  await typedStorageLocalSetter({ [QUEUE_LOGS_KEY]: queuedLogsPayload });
};
