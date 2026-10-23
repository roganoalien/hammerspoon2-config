// Layout and color configuration for the on-screen menu.

import type { CordinatesType, PositionType } from "./types";

// 0 draws the window immediately. Raise it (e.g. 0.8) for the
// "expert never sees it" behaviour: a key press within the delay acts and the
// window is never drawn.
export const SHOW_DELAY = 0;

export const TILE = 96;
export const SPACING = 12;
export const PADDING = 18;
export const COLUMNS = 3;
export const LETTER_SIZE = 18;

// Tokyo Night palette.
export const BG: HSColor = HSColor.rgb(0.10196, 0.10588, 0.14902, 0.75);
export const LETTER_COLOR: HSColor = HSColor.hex("#C0CAF5");
export const ICON_COLOR = "#C0CAF5"; // applied to the SF Symbols via tinting

// POSITIONS
const BOTTOM: CordinatesType = { h: 0.5, w: 1, x: 0, y: 0.5 };
const CENTER: CordinatesType = { h: 0.75, w: 0.75, x: 0.125, y: 0.125 };
const LEFT_BOTTOM: CordinatesType = { h: 0.5, w: 0.5, x: 0, y: 0.5 };
const LEFT_THIRD: CordinatesType = { h: 1, w: 0.333, x: 0, y: 0 };
const LEFT_TOP: CordinatesType = { h: 0.5, w: 0.5, x: 0, y: 0 };
const RIGHT_BOTTOM: CordinatesType = { h: 0.5, w: 0.5, x: 0.5, y: 0.5 };
const RIGHT_THIRD: CordinatesType = { h: 1, w: 0.333, x: 0.667, y: 0 };
const RIGHT_TOP: CordinatesType = { h: 0.5, w: 0.5, x: 0.5, y: 0 };
const TOP: CordinatesType = { h: 0.5, w: 1, x: 0, y: 0 };

export const POSITIONS: PositionType = {
	bottom: BOTTOM,
	center: CENTER,
	leftBottom: LEFT_BOTTOM,
	leftThird: LEFT_THIRD,
	leftTop: LEFT_TOP,
	rightBottom: RIGHT_BOTTOM,
	rightThird: RIGHT_THIRD,
	rightTop: RIGHT_TOP,
	top: TOP,
};
