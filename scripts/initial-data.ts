import { MARKER, SCRIPT_TYPES, TOKEN_ATTRIBUTE } from "../src/constants";

const inject = async () => {
  const myScript = document.currentScript;
  const token = myScript ? myScript.getAttribute(TOKEN_ATTRIBUTE) : null;

  try {
    function postObj(obj: Record<string, unknown>) {
      let payload;
      try {
        payload = JSON.stringify(obj);
      } catch (err) {
        payload = JSON.stringify({
          error: "stringify_failed",
          message: String(err as Error),
        });
      }

      window.postMessage(
        { [MARKER]: true, token, payload, type: SCRIPT_TYPES.INITIAL_DATA },
        "*"
      );
    }

    function trySend() {
      if (
        typeof window.ytInitialPlayerResponse !== "undefined" &&
        window.ytInitialPlayerResponse !== null
      ) {
        postObj(window.ytInitialPlayerResponse);
        return true;
      }
      return false;
    }

    if (trySend()) return;

    const intervalMs = 250;
    const maxWaitMs = 5000;
    let waited = 0;
    const id = setInterval(() => {
      if (trySend()) {
        clearInterval(id);
        return;
      }
      waited += intervalMs;
      if (waited >= maxWaitMs) {
        clearInterval(id);
        postObj(window.ytInitialPlayerResponse || null);
      }
    }, intervalMs);
  } catch (err) {
    try {
      window.postMessage(
        {
          [MARKER]: true,
          token:
            (document.currentScript &&
              document.currentScript.getAttribute(TOKEN_ATTRIBUTE)) ||
            null,
          payload: JSON.stringify({
            error: "inject_exception",
            message: String(err),
          }),
        },
        "*"
      );
    } catch (e: unknown) {
      console.error("Inject script error", e);
    }
  }
};

inject();
