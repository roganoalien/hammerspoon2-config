import { TARGET_KEYBOARD } from "@/globals/constants";
import { findTargetKeyboardID } from "@/globals/utils";
import type { AnchorPosType } from "./types";
import { frameForAnchor, whiteSymbol } from "./utils";

// Constants
const hasInputMonitoring: boolean = hs.permissions.checkInputMonitoring();
const iconCapsOn = HSImage.fromSymbol("capslock.fill");
const iconCapsOff = HSImage.fromSymbol("capslock");
if (iconCapsOn) iconCapsOn.template = true;
if (iconCapsOff) iconCapsOff.template = true;
// Variable state
// let lastCapsState: boolean | null = null;
let menuBar: HSMenuBarItem | null = null;
let overlay: HSUIWindow | undefined;
let overlayPos: AnchorPosType = "bottom-center";

const overlayObject = () => {
	const ICON = 25;
	const ICON_COLOR = "#FFFFFF";
	const screen = hs.window.focusedWindow()?.screen ?? hs.screen.main();
	if (!screen) return;

	const frame = frameForAnchor(overlayPos, screen.frame);
	const icon = whiteSymbol("capslock.fill", ICON);

	const overlayTemp = hs.ui.window(frame);
	// Window levels in order:
	// normal -- default level of ordinary application windows
	// dock -- around the dock level
	// floating -- above normal windows (utility/HUD overlay that stays above regular app windows)
	// status -- status-item level, higher than floating
	// popUpMenu -- the level used for pop-up menus; very high in the stack
	// screenSaver -- the screen saver level, effectively the highest here (above almost everything)
	overlayTemp.titled(false).level("status" as Parameters<HSUIWindow["level"]>[0]);

	// Center image
	if (icon) {
		overlayTemp
			.zstack()
			.spacing(0)
			.padding(0)
			.rectangle()
			.fill("#16161E")
			.cornerRadius(10)
			.opacity(0.75)
			.frame({ h: "100%", w: "100%" })
			.vstack()
			.image(icon)
			.aspectRatio("fit")
			.text("capslock on")
			.foregroundColor(ICON_COLOR);
		// overlayTemp.image(icon).resizable().aspectRatio("fit").frame({ h: ICON, w: ICON });
	} else {
		// Fallback if no sf symbol
		overlayTemp
			.vstack()
			.spacing(0)
			.padding(0)
			.rectangle()
			.fill("#16161E")
			.cornerRadius(10)
			.opacity(0.75)
			.frame({ h: "100%", w: "100%" })
			.text("⇪")
			.foregroundColor(ICON_COLOR)
			.text("capslock on")
			.foregroundColor(ICON_COLOR);
	}
	return overlayTemp;
};

// Functions
const capsUIDisplay = (show: boolean) => {
	if (overlay) {
		overlay.destroy();
		overlay = undefined;
	}
	if (show) {
		overlay = overlayObject();
		if (overlay) {
			overlay.show();
		}
	}
};

const capWatcher = () => {
	// CAPS_LOCK System Key listener
	const systemDefined = hs.eventtap.eventTypes.systemDefined;
	if (systemDefined === undefined) return;
	return hs.eventtap.addWatcher(
		[systemDefined],
		(event) => {
			const sk = event.systemKey; // regular event types returns null;
			if (sk && sk.key === "CAPS_LOCK" && sk.isDown) {
				refreshIcon();
			}
			return undefined;
		},
		true,
	);
};

const isCapsOn = (): boolean => {
	return hs.keyboard.capsLockState();
};

const refreshIcon = () => {
	if (!menuBar) return;
	const on = isCapsOn();

	// if (on === lastCapsState) return;
	// lastCapsState = on;

	capsUIDisplay(on);
	menuBar.setIcon(on ? iconCapsOn : iconCapsOff);
	menuBar.setMenu([
		{ disabled: true, title: findTargetKeyboardID() ? TARGET_KEYBOARD : "MackBook Keyboard" },
		{ title: "-" },
		{
			checked: overlayPos === "center",
			disabled: overlayPos === "center",
			fn: () => {
				overlayPos = "center";
			},
			title: "Center",
		},
		{
			checked: overlayPos === "bottom-left",
			disabled: overlayPos === "bottom-left",
			fn: () => {
				overlayPos = "bottom-left";
			},
			title: "Bottom Left",
		},
		{
			checked: overlayPos === "bottom-center",
			disabled: overlayPos === "bottom-center",
			fn: () => {
				overlayPos = "bottom-center";
			},
			title: "Bottom Center",
		},
		{
			checked: overlayPos === "bottom-right",
			disabled: overlayPos === "bottom-right",
			fn: () => {
				overlayPos = "bottom-right";
			},
			title: "Bottom Right",
		},
		{
			checked: overlayPos === "top-left",
			disabled: overlayPos === "top-left",
			fn: () => {
				overlayPos = "top-left";
			},
			title: "Top Left",
		},
		{
			checked: overlayPos === "top-center",
			disabled: overlayPos === "top-center",
			fn: () => {
				overlayPos = "top-center";
			},
			title: "Top Center",
		},
		{
			checked: overlayPos === "top-right",
			disabled: overlayPos === "top-right",
			fn: () => {
				overlayPos = "top-right";
			},
			title: "Top Right",
		},
	]);
};

// TRIGGER MAIN CODE
const capsInit = (enabled: boolean) => {
	if (enabled) {
		// Starts listener for CAPS_LOCK key pressed
		capWatcher()?.start();

		if (menuBar) {
			refreshIcon();
			return;
		}
		menuBar = hs.menubar.create();
		// lastCapsState = null;
		refreshIcon();
		hs.notify.show("Capslock", "Working correctly", () => {
			console.log("Hammerspoon 2 config loaded successfully.");
		});
	} else {
		hs.ui.alert("Disabling capslock").font(HSFont.title2()).duration(2).padding(30).show();
	}
};

// Validate permissions
if (hasInputMonitoring) {
	capsInit(true);
} else {
	hs.ui
		.dialog("Input Monitoring failed!")
		.informativeText(
			"Capslock needs input monitoring in order to work. Please restart config and grant access.",
		)
		.buttons(["Continue", "Reload Config", "Request Permission"])
		.onButton((index) => {
			switch (index) {
				case 0:
					capsInit(false);
					break;
				case 2:
					hs.permissions.requestInputMonitoring();
					break;
				default:
					hs.reload();
					break;
			}
			if (index === 1) {
			} else {
			}
		})
		.style("critical")
		.show();
}
