import type { QueueLogsKey } from "./types/core";

export const MARKER = "__EXT_INJECT__";
export const TOKEN_ATTRIBUTE = "data-token";

// no defaulting to empty values, I want an explicitly defined value for each mode
export const isDevelopment = import.meta.env.MODE === "development";
export const isProduction = import.meta.env.MODE === "production";

export const DOM_TARGETS = {
  SETTINGS_BUTTON: "button.ytp-settings-button",
  SETTINGS_MENU: ".ytp-settings-shown",
  SETTINGS_BUTTON_OPENED: ".ytp-settings-button[aria-expanded='true']",
  SETTINGS_BUTTON_CLOSED: ".ytp-settings-button[aria-expanded='false']",
  SETTINGS_MENU_CONTAINER: ".ytp-settings-menu",
  AUDIO_TRACK_MENU_ITEM: ".ytp-audio-menu-item",
  SELECTED_AUDIO_TRACK: '.ytp-panel-menu .ytp-menuitem[aria-checked="true"]',
  AUDIO_TRACK_OPTION: ".ytp-menuitem-label",
  VIDEO_PLAYER: "video.html5-main-video",
};

export const STORAGE_LOG_SIZE_LIMIT = 100;

export const SHORT_LOGS = true;

export const SCRIPT_TYPES = {
  INITIAL_DATA: "initial-data",
  NAVIGATION_DATA: "navigation-data",
};

export const QUEUE_LOGS_KEY: QueueLogsKey = isDevelopment
  ? "queuedLogsDev"
  : "queuedLogs";

export const ENVIRONMENT_NAME = isDevelopment ? "dev" : "prod";

export const ERROR_MESSAGES = {
  CHROME_APIS_NOT_AVAILABLE: "Chrome APIs not available",
};
