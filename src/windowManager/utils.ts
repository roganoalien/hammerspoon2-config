import { POSITIONS } from "./config";
import type { CordinatesType } from "./types";

export const snapTo = (unit: CordinatesType) => {
	const win = hs.window.focusedWindow();
	if (!win) return;

	const screen = win.screen ?? hs.screen.main();
	const target = new HSRect(unit.x, unit.y, unit.w, unit.h).fromUnitRect(screen?.frame as HSRect);
	return win.moveAndResize(target);
};

export const handleWindowPos = (direction: string) => {
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
			snapTo(POSITIONS.center);
			break;
		default:
			break;
	}
};
