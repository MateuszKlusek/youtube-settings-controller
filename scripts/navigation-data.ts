import { MARKER, SCRIPT_TYPES, TOKEN_ATTRIBUTE } from "../src/constants";

const injectFetchProxy = async () => {
  const myScript = document.currentScript;
  const token = myScript ? myScript.getAttribute(TOKEN_ATTRIBUTE) : null;

  const realFetch = window.fetch;
  window.fetch = async function (input, init) {
    const response = await realFetch(input, init);
    const clone = response.clone();
    clone
      .text()
      .then((text) => {
        if (response.url.includes("player?")) {
          window.postMessage(
            {
              [MARKER]: true,
              token,
              payload: text,
              type: SCRIPT_TYPES.NAVIGATION_DATA,
            },
            "*"
          );
        }
      })
      .catch((e) => console.log("Read body failed", e));
    return response;
  };
};

injectFetchProxy();
