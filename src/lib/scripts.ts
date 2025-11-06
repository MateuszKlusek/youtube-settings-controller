import { TOKEN_ATTRIBUTE } from "../constants";

export const injectExternalScript = (token: string, scriptPath: string) => {
  const scriptEl = document.createElement("script");
  scriptEl.setAttribute(TOKEN_ATTRIBUTE, token);

  scriptEl.src = chrome.runtime.getURL(scriptPath);

  (document.head || document.documentElement).appendChild(scriptEl);
};

export const makeToken = (len = 16) => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let s = "";
  for (let i = 0; i < len; i++)
    s += chars[Math.floor(Math.random() * chars.length)];
  return s;
};
