// Draws the on-screen menu window. Returns the created HSUIWindow (or null on
// failure) so the caller can track and destroy it.

import {
	BG,
	COLUMNS,
	ICON_COLOR,
	LETTER_COLOR,
	LETTER_SIZE,
	PADDING,
	SPACING,
	TILE,
} from "./config";
import { tintSymbol } from "./tint";
import type { MenuButton } from "./types";

// Mirrors the repo's screen presenter: build the window, then lay a vstack of
// hstack rows, each cell a vstack of {image/rectangle, letter text}.
export const draw = (menu: MenuButton[]): HSUIWindow | null => {
	try {
		const rows = Math.ceil(menu.length / COLUMNS);
		const width = COLUMNS * TILE + (COLUMNS - 1) * SPACING + PADDING * 2;
		const cellHeight = TILE + LETTER_SIZE + 6;
		const height = rows * cellHeight + (rows - 1) * SPACING + PADDING * 2;

		const screen = hs.window.focusedWindow()?.screen ?? hs.screen.main();
		const frame = screen?.frame ?? new HSRect(0, 0, width, height);
		const x = frame.x + (frame.w - width) / 2;
		const y = frame.y + (frame.h - height) / 2;

		const win = hs.ui.window({ h: height, w: width, x, y });
		win.titled(false);
		win.level("floating" as Parameters<HSUIWindow["level"]>[0]);
		win.cornerRadius(50);
		win.backgroundColor(BG);

		win.vstack().spacing(SPACING).padding(PADDING);
		for (let row = 0; row < rows; row++) {
			win.hstack().spacing(SPACING);
			for (let col = 0; col < COLUMNS; col++) {
				const index = row * COLUMNS + col;
				if (index >= menu.length) break;
				const button = menu[index]!;

				win.vstack().spacing(2);

				const icon = tintSymbol(button.symbol, ICON_COLOR);
				if (icon) {
					win.image(icon).resizable().aspectRatio("fit").frame({ h: TILE, w: TILE });
				} else {
					win.rectangle().fill("#3A3A3C").cornerRadius(8).frame({ h: TILE, w: TILE });
				}

				win.text(button.key).foregroundColor(LETTER_COLOR);

				win.end(); // cell vstack
			}
			win.end(); // row hstack
		}
		win.end(); // outer vstack

		win.show();
		return win;
	} catch (e) {
		console.error(`[windowManager menu] draw failed: ${(e as Error).message}`);
		return null;
	}
};
