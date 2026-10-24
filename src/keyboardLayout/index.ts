import { allowedApps, TARGET_KEYBOARD } from "@/globals/constants";
import type { GlobalMenuState } from "./types";

// State
let globalMenuState: GlobalMenuState = "open";
let layBar: HSMenuBarItem | null = null;
let layHotkey: HSHotkey | null = null;

// Images
const locked = HSImage.fromSymbol("lock.fill");
const open = HSImage.fromSymbol("lock.open.fill");
if (locked) locked.template = true;
if (open) open.template = true;

// Functions
const isAppAllowed = (appName: string) => {
	const found = allowedApps.find((item) => item === appName);
	return !!found;
};

const onActivate = (app: HSApplication | null) => {
	if (globalMenuState === "locked") return;

	// Match on bundleID: app.name can be null in the current Hammerspoon build,
	// but bundleID is reliably populated for running apps.
	const bundleID = app?.bundleID;
	if (!bundleID) {
		console.error("keyboardLayout: no bundleID on activated app; skipping");
		return;
	}

	const valid = isAppAllowed(bundleID);
	hs.keycodes.setLayout(valid ? "ABC" : "Latin American");
};

const setState = () => {
	if (!layBar) return;
	layBar.setIcon(globalMenuState === "open" ? locked : open);
	globalMenuState = globalMenuState === "open" ? "locked" : "open";
	hs.notify.show("Keyboard Layout Listener", globalMenuState, () => null);
	refreshMenuBar();
};

const refreshMenuBar = () => {
	if (!layBar) return;
	layBar.setMenu([
		{ fn: () => hs.reload(), title: "Reload config" },
		{ checked: true, disabled: true, title: `Status: ${globalMenuState}` },
		{ title: "-" },
		{ fn: () => setState(), title: globalMenuState === "open" ? "Lock down" : "Open" },
	]);
};

const loadKbLayout = () => {
	// Already loaded? Don't create a second menu bar item / hotkey / listener.
	if (layBar) return;

	// Menubar item
	layBar = hs.menubar.create();
	layBar.setIcon(open);
	layBar.setMenu([
		{ fn: () => hs.reload(), title: "Reload config" },
		{ disabled: true, title: `Status ${globalMenuState}` },
		{ title: "-" },
		{ fn: () => setState(), title: "Lock down" },
	]);

	// Hotkey bind — keep the handle so we can destroy it on unload.
	layHotkey = hs.hotkey.bind(["ctrl", "cmd", "alt"], "k", setState);

	// Listener — register the SAME `onActivate` reference we later pass to
	// off(), and let it use the `app` argument the event provides.
	hs.application.on("didActivate", onActivate);

	// Notification showing it loaded
	hs.notify.show("Keyboard Layout Listener", "Loaded", () => null);
};

const unloadKbLayout = () => {
	if (!layBar) return;

	// Remove the app-activate listener so it stops switching layouts.
	try {
		hs.application.off("didActivate", onActivate);
	} catch (err) {
		console.error(`keyboardLayout: failed to remove didActivate listener: ${err}`);
	}

	// Destroy the specific hotkey we created (not disableAll, which is global).
	if (layHotkey) {
		layHotkey.destroy();
		layHotkey = null;
	}

	layBar.destroy();
	layBar = null;
};

try {
	hs.usb.on("added", (device) => {
		if (device.productName === TARGET_KEYBOARD) loadKbLayout();
	});
	hs.usb.on("removed", (device) => {
		if (device.productName === TARGET_KEYBOARD) unloadKbLayout();
	});

	// The "added" event only fires for FUTURE connections. If the keyboard is
	// already plugged in when this config loads (the usual case on reload),
	// load immediately instead of waiting for an event that won't come.
	const alreadyConnected = hs.usb
		.attachedDevices()
		.some((device) => device.productName === TARGET_KEYBOARD);
	if (alreadyConnected) loadKbLayout();
} catch (err) {
	if (err instanceof Error) {
		console.error(err.message);
	}
}
