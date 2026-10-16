const CENTER = { h: 0.75, w: 0.75, x: 0.125, y: 0.125 };

const snapTo = (unit: { x: number; y: number; w: number; h: number }, win: HSWindow) => {
	if (!win) return;
	const screen = win.screen ?? hs.screen.main();
	const target = new HSRect(unit.x, unit.y, unit.w, unit.h).fromUnitRect(screen?.frame as HSRect);
	return win.moveAndResize(target);
};

const handleWindowPos = (direction: string) => {
	const wind = hs.window.focusedWindow();

	if (!wind) return;

	switch (direction) {
		case "left":
			hs.window.moveToLeftHalf(wind);
			break;
		case "right":
			hs.window.moveToRightHalf(wind);
			break;
		case "up":
			hs.window.maximize(wind);
			break;
		case "down":
			snapTo(CENTER, wind);
			break;
		default:
			break;
	}
};

hs.hotkey.bind(["ctrl", "cmd"], "down", () => handleWindowPos("down"));
hs.hotkey.bind(["ctrl", "cmd"], "left", () => handleWindowPos("left"));
hs.hotkey.bind(["ctrl", "cmd"], "right", () => handleWindowPos("right"));
hs.hotkey.bind(["ctrl", "cmd"], "up", () => handleWindowPos("up"));
