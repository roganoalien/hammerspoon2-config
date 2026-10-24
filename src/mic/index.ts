// mic.js
// Menu bar microphone indicator.
//   - Icon reflects the default input device's mute state:
//       muted  -> "mic.slash"
//       live   -> "mic.fill"
//   - Click the item to toggle mute.
//   - Reacts live to mute changes via the per-device "min" event, and
//     re-binds automatically when the default input device changes ("dIn").
//
// Docs:
//   https://cmsj.github.io/Hammerspoon2/main/ts/classes/HSAudioDevice.html
//   https://cmsj.github.io/Hammerspoon2/main/ts/modules/hs.audiodevice.html

// --- State ------------------------------------------------------------------
let mic: HSAudioDevice | null = null; // current default input device (HSAudioDevice | null)

const iconLive = HSImage.fromSymbol("mic.fill");
const iconMuted = HSImage.fromSymbol("mic.slash.fill");
if (iconLive) iconLive.template = true;
if (iconMuted) iconMuted.template = true;

const bar: HSMenuBarItem = hs.menubar.create();

// --- Helpers ----------------------------------------------------------------

// Is the current mic muted? (false if no mic / no mutable input)
const isMuted = () => (mic ? mic.inputMuted : false);

const refresh = () => {
	const muted = isMuted();
	const name = mic ? mic.name : "No input device";

	bar.setIcon(muted ? iconMuted : iconLive);
	bar.setTooltip(`${name} — ${mic ? (muted ? "Muted" : "Live") : "unavailable"}`);
	bar.setMenu([
		{ disabled: true, title: name },
		{ title: "-" },
		{
			disabled: !mic,
			fn: () => toggleMute(),
			title: muted ? "Unmute" : "Mute",
		},
	]);
};

const toggleMute = () => {
	if (!mic) return;
	mic.inputMuted = !mic.inputMuted;
	refresh(); // reflect immediately; the "min" event will also fire
};

// Called by the per-device "min" (input mute changed) event.
const onMuteChange = () => refresh();

// (Re)bind listeners to whatever the current default input device is.
const bindMic = () => {
	// Detach from the previous device if we had one.
	if (mic) {
		try {
			mic.off("min", onMuteChange);
		} catch (e) {
			/* device may be gone; ignore */
			console.error(e);
		}
	}

	mic = hs.audiodevice.defaultInputDevice();

	if (mic) {
		try {
			mic.on("min", onMuteChange);
		} catch (err) {
			console.error(`mic.js: failed to watch mute: ${err}`);
		}
	}

	refresh();
};

// Click toggles mute (only fires while no menu is set — but we DO set a menu,
// so the menu's Mute/Unmute item is the primary control; this is a fallback
// kept for completeness and harmless if never invoked).

// --- Wire up ----------------------------------------------------------------
bindMic();

// Re-bind when the system default input device changes (e.g. USB mic plugged
// in and becomes default).
try {
	hs.audiodevice.on("dIn", bindMic);
} catch (err) {
	console.error(`mic.js: failed to watch default input device: ${err}`);
}

// --- Intercept the mic / F5 key (keyCode 176) -------------------------------
// This key normally triggers macOS Dictation. We tap it, suppress it with
// `consume`, and toggle the mic mute instead. A modify tap (listenOnly=false)
// is required so the return value can suppress the event. Requires
// Accessibility permission. The tap is NOT garbage collected — keep the
// reference and removeWatcher() if you ever tear it down.
const MIC_KEYCODE = 176;
let micKeyTap: HSEventTap | null = null;

try {
	const keyDown = hs.eventtap.eventTypes.keyDown;
	const systemDefined = hs.eventtap.eventTypes.systemDefined;
	const types = [keyDown, systemDefined].filter((t): t is number => t !== undefined);

	micKeyTap = hs.eventtap.addWatcher(
		types,
		(event) => {
			if (event.keyCode === MIC_KEYCODE) {
				// Toggle once, on the key-down edge only, to avoid double-firing
				// on the matching key-up event.
				const sk = event.systemKey;
				const isDown = sk ? sk.isDown : true;
				if (isDown) toggleMute();
				return hs.eventtap.consume; // block dictation
			}
			return hs.eventtap.emit; // let everything else through
		},
		false, // modify tap — required to consume
	);

	if (micKeyTap) {
		micKeyTap.start();
	} else {
		console.error("mic.js: could not create mic-key tap (Accessibility permission?)");
	}
} catch (err) {
	console.error(`mic.js: failed to start mic-key tap: ${err}`);
}
