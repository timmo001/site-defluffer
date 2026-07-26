import { toggleExtension } from "./toggle-extension.js";

const TOGGLE_COMMAND = "toggle-extension";

chrome.commands.onCommand.addListener((command) => {
  if (command !== TOGGLE_COMMAND) {
    return;
  }

  toggleExtension();
});
