// Menu session: binds the keys immediately, defers the window by SHOW_DELAY,
// and tears everything down on action or Escape. Replicates the "delayed
// window" trick from dmgerman/hammerspoon-2-config's hs_menu-gt.

import { SHOW_DELAY } from "./config";
import { draw } from "./draw";
import { MENU } from "./menus";

// Session state (one menu at a time).
let win: HSUIWindow | null = null;
let hotkeys: HSHotkey[] = [];
let showTimer: HSTimer | null = null;

const releaseKeys = () => {
	for (const hk of hotkeys) hk?.destroy();
	hotkeys = [];
};

const destroyWindow = () => {
	// Stopping the timer here is what makes an early key press cancel the draw.
	if (showTimer) {
		showTimer.stop();
		showTimer = null;
	}
	if (win) {
		win.destroy();
		win = null;
	}
};

const close = () => {
	releaseKeys();
	destroyWindow();
};

const bind = (mods: string[], key: string, pressed: () => void) => {
	const hk = hs.hotkey.bind(mods, key, pressed, null, null);
	if (hk) hotkeys.push(hk);
	else console.error(`[windowManager menu] could not bind ${key}`);
};

export const openMenu = () => {
	close(); // clean slate

	// 1) Bind all keys NOW — live during the delay.
	for (const button of MENU) {
		bind([], button.key, () => {
			button.fn();
			close();
		});
	}
	bind([], "escape", () => close());

	// 2) Defer only the window. A key press before this fires calls close(),
	//    which stops showTimer, so draw() never runs.
	if (SHOW_DELAY > 0) {
		showTimer = hs.timer.doAfter(SHOW_DELAY, () => {
			showTimer = null;
			win = draw(MENU);
		});
	} else {
		win = draw(MENU);
	}
};
