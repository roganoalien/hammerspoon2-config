// On-screen 3×3 menu is split across this folder:
//   menu.ts / draw.ts / menus.ts / tint.ts / config.ts / types.ts
// It is independent of the direct window-position hotkeys below.
import { openMenu } from "./menu";
import { handleWindowPos } from "./utils";

hs.hotkey.bind(["ctrl", "cmd"], "down", () => handleWindowPos("down"));
hs.hotkey.bind(["ctrl", "cmd"], "left", () => handleWindowPos("left"));
hs.hotkey.bind(["ctrl", "cmd"], "right", () => handleWindowPos("right"));
hs.hotkey.bind(["ctrl", "cmd"], "up", () => handleWindowPos("up"));

// Open the on-screen menu.
hs.hotkey.bind(["ctrl", "cmd"], "w", openMenu);
