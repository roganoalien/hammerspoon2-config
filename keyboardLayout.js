// biome-ignore-all lint: hammerspoon with no types
// IMAGES
const locked = HSImage.fromSymbol("lock.fill");
const open = HSImage.fromSymbol("lock.open.fill");

// GLOBAL VARIABLE
let globalMenuState = "open";
const allowedApps = [
	"Code",
	"Ghostty",
	"Zed",
	"Bruno",
	"Visual Studio Code",
	"Xcode"
];

// MENU BAR ITEM
const layBar = hs.menubar.create();
layBar.setIcon(open);
layBar.setMenu([
	{ title: "Reload config", fn: () => hs.reload() },
	{ title: `Status: ${globalMenuState}`, disabled: true, checked: true },
	{ title: "-" },
	{ title: "Lock down", fn: () => setState() }
]);

const handleKeycodes = () => {
	const code = hs.keycodes.currentLayout();
	const method = hs.keycodes.currentMethod();

	if(code === "Latin American" && method === undefined) {
		layBar.title = "es";
	}
	
	if(code === "ABC") {
		if(method === undefined){
			layBar.title = "en";
		} else {
			layBar.title = "jp";
		}
	}
};

handleKeycodes();

// FUNCTIONS
const refreshMenuBar = () => {
	// Refreshes the menu of the menubar item
	handleKeycodes();
	layBar.setMenu([
		{ title: "Reload config", fn: () => hs.reload() },
		{ title: `Status: ${globalMenuState}`, disabled: true, checked: true },
		{ title: "-" },
		{ title: globalMenuState === "open" ? "Lock down" : "Open", fn: () => setState() }
	]);
};

const setState = () => {
	// Sets state for layout listener and sets menubar icon
	layBar.setIcon(globalMenuState === "open" ? locked : open);
	globalMenuState = globalMenuState === "open" ? "locked" : "open";
	hs.notify.show("Keyboard Layout Listener", globalMenuState);
	refreshMenuBar();
};

const isAppAllowed = (appName) => {
	const found = allowedApps.find((item) => item === appName);
	return !!found;
};

const onActivate = () => {
	if(globalMenuState === "locked") return;
	const win = hs.window.focusedWindow();
	if (win) {
		const app = win.application.title;
		const valid = isAppAllowed(app);
		// CHANGE KEYBOARD LAYOUT
		if(valid) {
			hs.keycodes.setLayout("ABC");
		} else {
			hs.keycodes.setLayout("Latin American");
		}
	}
};

// HOTKEYS BIND
const blockKeyboardLayout = hs.hotkey.bind(["ctrl", "cmd", "alt"], "k", setState);

// Listeners
hs.keycodes.on("change", () => {
	handleKeycodes();
});

hs.application.on("didActivate", onActivate);

hs.notify.show("Keyboard Layout Listener", "Open");