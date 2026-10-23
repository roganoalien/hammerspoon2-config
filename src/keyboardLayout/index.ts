import type { GlobalMenuState } from "./types";

// Global Variables
let globalMenuState: GlobalMenuState = "open";
const allowedApps: string[] = ["Code", "Ghostty", "Zed", "Bruno", "Visual Studio Code", "Xcode"];

// Images
const locked = HSImage.fromSymbol("lock.fill");
const open = HSImage.fromSymbol("lock.open.fill");

// Menubar item
const layBar = hs.menubar.create();
layBar.setIcon(open);
layBar.setMenu([
	{ fn: () => hs.reload(), title: "Reload config" },
	{ disabled: true, title: `Status ${globalMenuState}` },
	{ title: "-" },
	{ fn: () => setState(), title: "Lock down" },
]);

// Functions
// const handleKeycodes = () => {
// 	// Gets current keycode layout & method
// 	// Sets menubar item title to the layout or method
// 	const code = hs.keycodes.currentLayout();
// 	const method = hs.keycodes.currentMethod();

// 	if (code === "Latin American" && method === undefined) {
// 		layBar.title = "es";
// 	}

// 	if (code === "ABC") {
// 		if (method === undefined) {
// 			layBar.title = "en";
// 		} else {
// 			layBar.title = "jp";
// 		}
// 	}
// };

// handleKeycodes();

const refreshMenuBar = () => {
	// Refreshes the menu of the menubar item
	// handleKeycodes();
	layBar.setMenu([
		{ fn: () => hs.reload(), title: "Reload config" },
		{ checked: true, disabled: true, title: `Status: ${globalMenuState}` },
		{ title: "-" },
		{ fn: () => setState(), title: globalMenuState === "open" ? "Lock down" : "Open" },
	]);
};

const setState = () => {
	// Sets state for layout listener & sets menubar icon
	layBar.setIcon(globalMenuState === "open" ? locked : open);
	globalMenuState = globalMenuState === "open" ? "locked" : "open";
	hs.notify.show("Keyboard Layout Listener", globalMenuState, () => null);
	refreshMenuBar();
};

const isAppAllowed = (appName: string) => {
	// Validates the appName into whitelist
	const found = allowedApps.find((item) => item === appName);
	return !!found;
};

const onActivate = () => {
	// Listens for change of windows focus & app name
	if (globalMenuState === "locked") return;
	const win = hs.window.focusedWindow();
	if (win) {
		const app = win.application?.name;
		const valid = isAppAllowed(app as string);
		// CHANGE KEYBOARD LAYOUT
		if (valid) {
			hs.keycodes.setLayout("ABC");
		} else {
			hs.keycodes.setLayout("Latin American");
		}
	}
};

// Hotkeys bind
hs.hotkey.bind(["ctrl", "cmd", "alt"], "k", setState);

// Listeners
// hs.keycodes.on("change", () => {
// 	handleKeycodes();
// });

hs.application.on("didActivate", onActivate);

hs.notify.show("Keyboard Layout Listener", "Open", () => null);
