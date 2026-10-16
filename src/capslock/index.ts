// Variables
const TARGET_KEYBOARD: string = "NuPhy Halo96" as const;
const POLL_INTERVAL: number = 0.3 as const;
const DEBUG: boolean = true;
const SYNC_LED = true;

// Asks for permission
try {
	hs.permissions.requestInputMonitoring();
} catch (err) {
	console.error(`capslock: requestInputMonitoring failed: ${err}`);
}

// State
let menuBar: HSMenuBarItem | null = null;
let pollTimer: HSTimer | null = null;
let lastCapsState: boolean | null = null;

// Icons
const iconCapsOn = HSImage.fromSymbol("capslock.fill");
const iconCapsOff = HSImage.fromSymbol("capslock");
if (iconCapsOn) iconCapsOn.template = true;
if (iconCapsOff) iconCapsOff.template = true;

// Helpers
const findTargetKeyboardID = () => {
	const kb = hs.keyboard.attachedKeyboards().find((k) => k.productName === TARGET_KEYBOARD);
	return kb ? kb.keyboardID : null;
};

const isCapsOn = () => {
	try {
		return hs.keyboard.capsLockState();
	} catch (err) {
		console.error(`capslock: capsLockState failed: ${err}`);
		return false;
	}
};

const refreshIcon = (force = false) => {
	// Update icon/tooltip only when the state actually changes
	if (!menuBar) return;
	const on = isCapsOn();

	if (DEBUG) {
		const id = findTargetKeyboardID();
		let ledState = "n/a";
		if (id !== null) {
			try {
				ledState = String(hs.keyboard.keyboardCapsLockState(id));
			} catch (err) {
				ledState = `err(${err})`;
			}
		}
		console.log(`capslock: system=${on} nuphyLED=${ledState}`);
	}

	if (!force && on === lastCapsState) return;
	lastCapsState = on;

	hs.ui
		.alert(on ? "caps ON" : "caps OFF")
		.duration(1)
		.show();
	menuBar.setIcon(on ? iconCapsOn : iconCapsOff);
	menuBar.setTooltip(`${TARGET_KEYBOARD} - CAPS Lock ${on ? "ON" : "OFF"}`);

	if (SYNC_LED) {
		const id = findTargetKeyboardID();
		if (id !== null) {
			try {
				hs.keyboard.setKeyboardLED(id, "caps", on);
			} catch (e) {
				console.error(`capslock: setKeyboardLED failed: ${e}`);
			}
		}
	}
};

// Listeners
const startCapsWatcher = () => {
	if (pollTimer) return;
	pollTimer = hs.timer.doEvery(POLL_INTERVAL, () => refreshIcon());
};

const stopCapsWatcher = () => {
	if (!pollTimer) return;
	pollTimer.stop();
	pollTimer = null;
};

const showMenuBar = () => {
	if (menuBar) {
		refreshIcon(true);
		return;
	}
	menuBar = hs.menubar.create();
	menuBar.setMenu([{ disabled: true, title: `${TARGET_KEYBOARD}` }]);
	lastCapsState = null;
	refreshIcon(true);
	startCapsWatcher();
	console.log(`capslock: ${TARGET_KEYBOARD} connected - menu bar item shown`);
};

const hideMenuBar = () => {
	stopCapsWatcher();
	if (menuBar) {
		menuBar.destroy();
		menuBar = null;
		lastCapsState = null;
		console.log(`capslock: ${TARGET_KEYBOARD} disconnected - menu bar item removed`);
	}
};

// Listener 1: device added / removed
try {
	hs.usb.on("added", (device) => {
		if (device.productName === TARGET_KEYBOARD) {
			showMenuBar();
		}
	});
	hs.usb.on("removed", (device) => {
		if (device.productName === TARGET_KEYBOARD) {
			hideMenuBar();
		}
	});
} catch (err) {
	console.error(`capslock: failed to start USB watcher: ${err}`);
}

// Initial state at load
if (findTargetKeyboardID() !== null) {
	showMenuBar();
}
