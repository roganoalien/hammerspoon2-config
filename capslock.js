// capslock.js
// Shows a menu bar item ONLY while a "NuPhy Halo96" keyboard is attached,
// and reflects Caps Lock state in the icon:
//   - caps lock ON  -> "capslock.fill"
//   - caps lock OFF -> "capslock"
//
// Two listeners:
//   1. hs.usb "added"/"removed" -> show/hide the menu bar item when the
//      NuPhy Halo96 connects or disconnects.
//   2. A polling timer (only active while the keyboard is attached) that
//      reads the Caps Lock state and refreshes the icon when it changes.
//
// IMPORTANT — why we use capsLockState() (system-wide) and not just the
// per-keyboard LED:
//   - keyboardCapsLockState(id) reads the keyboard's physical caps LED.
//     Many third-party keyboards (NuPhy in Mac mode / QMK-VIA firmware) do
//     NOT drive that LED from the macOS lock state, so it never changes and
//     the icon appears "stuck". The docs also note macOS has no public API
//     for per-keyboard *functional* caps state.
//   - capsLockState() is the single, reliable system-wide functional lock.
//     Pressing Caps Lock on ANY keyboard (including the NuPhy) flips it.
//   We gate the whole feature on the NuPhy being present, so it still only
//   runs "for" the NuPhy, but the state signal itself is the reliable one.
//
// As a bonus, we mirror the state onto the NuPhy's own caps LED via
// setKeyboardLED(), so the physical key light matches too.
//
// Docs:
//   https://cmsj.github.io/Hammerspoon2/main/ts/functions/hs.keyboard.capsLockState.html
//   https://cmsj.github.io/Hammerspoon2/main/ts/functions/hs.keyboard.keyboardCapsLockState.html
//   https://cmsj.github.io/Hammerspoon2/main/ts/functions/hs.keyboard.setKeyboardLED.html

const TARGET_KEYBOARD = "NuPhy Halo96";
const POLL_INTERVAL = 0.3; // seconds
const DEBUG = true; // set false once confirmed working
const SYNC_LED = true; // mirror state onto the NuPhy's physical caps LED

// Per-keyboard reads/LED writes need Input Monitoring permission.
try {
	hs.permissions.requestInputMonitoring();
} catch (err) {
	console.error(`capslock.js: requestInputMonitoring failed: ${err.message}`);
}

// --- State ------------------------------------------------------------------
let menuBar = null;       // HSMenuBarItem while connected
let pollTimer = null;     // HSTimer while connected
let lastCapsState = null; // cache so we only repaint on change

const iconCapsOn = HSImage.fromSymbol("capslock.fill");
const iconCapsOff = HSImage.fromSymbol("capslock");
if (iconCapsOn) iconCapsOn.template = true;
if (iconCapsOff) iconCapsOff.template = true;

// --- Helpers ----------------------------------------------------------------

const findTargetKeyboardID = () => {
	const kb = hs.keyboard
		.attachedKeyboards()
		.find((k) => k.productName === TARGET_KEYBOARD);
	return kb ? kb.keyboardID : null;
};

// Reliable system-wide functional caps lock state.
const isCapsOn = () => {
	try {
		return hs.keyboard.capsLockState();
	} catch (err) {
		console.error(`capslock.js: capsLockState failed: ${err.message}`);
		return false;
	}
};

// Update icon/tooltip only when the state actually changes.
const refreshIcon = (force = false) => {
	if (!menuBar) return;
	const on = isCapsOn();

	if (DEBUG) {
		const id = findTargetKeyboardID();
		let ledState = "n/a";
		if (id !== null) {
			try {
				ledState = String(hs.keyboard.keyboardCapsLockState(id));
			} catch (e) {
				ledState = `err(${e.message})`;
			}
		}
		console.log(`capslock.js: system=${on} nuphyLED=${ledState}`);
	}

	if (!force && on === lastCapsState) return;
	lastCapsState = on;

	menuBar.setIcon(on ? iconCapsOn : iconCapsOff);
	menuBar.setTooltip(`${TARGET_KEYBOARD} — Caps Lock ${on ? "ON" : "OFF"}`);

	// Mirror onto the NuPhy's physical caps LED so the key light matches.
	if (SYNC_LED) {
		const id = findTargetKeyboardID();
		if (id !== null) {
			try {
				hs.keyboard.setKeyboardLED(id, "caps", on);
			} catch (e) {
				console.error(`capslock.js: setKeyboardLED failed: ${e.message}`);
			}
		}
	}
};

// --- Listener 2: caps lock polling (only while keyboard attached) -----------
const startCapsWatcher = () => {
	if (pollTimer) return;
	pollTimer = hs.timer.doEvery(POLL_INTERVAL, () => refreshIcon());
};

const stopCapsWatcher = () => {
	if (!pollTimer) return;
	pollTimer.stop();
	pollTimer = null;
};

// --- Show / hide the menu bar item ------------------------------------------
const showMenuBar = () => {
	if (menuBar) {
		refreshIcon(true);
		return;
	}
	menuBar = hs.menubar.create();
	menuBar.setMenu([
		{ title: `${TARGET_KEYBOARD}`, disabled: true },
		{ title: "-" },
		{ title: "Reload config", fn: () => hs.reload() },
	]);
	lastCapsState = null;
	refreshIcon(true);
	startCapsWatcher();
	console.log(`capslock.js: ${TARGET_KEYBOARD} connected — menu bar item shown`);
};

const hideMenuBar = () => {
	stopCapsWatcher();
	if (menuBar) {
		menuBar.destroy();
		menuBar = null;
		lastCapsState = null;
		console.log(`capslock.js: ${TARGET_KEYBOARD} disconnected — menu bar item removed`);
	}
};

// --- Listener 1: device added / removed -------------------------------------
try {
	hs.usb.on("added", (device) => {
		if (device.productName === TARGET_KEYBOARD) showMenuBar();
	});
	hs.usb.on("removed", (device) => {
		if (device.productName === TARGET_KEYBOARD) hideMenuBar();
	});
} catch (err) {
	console.error(`capslock.js: failed to start USB watcher: ${err.message}`);
}

// --- Initial state at load --------------------------------------------------
if (findTargetKeyboardID() !== null) {
	showMenuBar();
}
