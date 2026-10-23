// The on-screen menu definition: a 3×3 grid of buttons.
//
//   1 top-left      2 top          3 top-right
//   4 middle-left   5 center       6 right
//   7 bottom-left   8 bottom       9 bottom-right

import { POSITIONS } from "./config";
import type { MenuButton } from "./types";
import { snapTo } from "./utils";

export const MENU: MenuButton[] = [
	{
		fn: () => {
			snapTo(POSITIONS.leftTop);
		},
		key: "1",
		label: "Top Left",
		symbol: "rectangle.inset.topleading.filled",
	},
	{
		fn: () => {
			snapTo(POSITIONS.top);
		},
		key: "2",
		label: "Top",
		symbol: "rectangle.tophalf.filled",
	},
	{
		fn: () => {
			snapTo(POSITIONS.rightTop);
		},
		key: "3",
		label: "Top Right",
		symbol: "rectangle.inset.toptrailing.filled",
	},
	{
		fn: () => {
			snapTo(POSITIONS.leftThird);
		},
		key: "4",
		label: "Middle Left",
		symbol: "rectangle.lefthalf.filled",
	},
	{
		fn: () => {
			snapTo(POSITIONS.center);
		},
		key: "5",
		label: "Center",
		symbol: "rectangle.center.inset.filled",
	},
	{
		fn: () => {
			snapTo(POSITIONS.rightThird);
		},
		key: "6",
		label: "Right",
		symbol: "rectangle.righthalf.filled",
	},
	{
		fn: () => {
			snapTo(POSITIONS.leftBottom);
		},
		key: "7",
		label: "Bottom Left",
		symbol: "rectangle.inset.bottomleading.filled",
	},
	{
		fn: () => {
			snapTo(POSITIONS.bottom);
		},
		key: "8",
		label: "Bottom",
		symbol: "rectangle.bottomhalf.filled",
	},
	{
		fn: () => {
			snapTo(POSITIONS.rightBottom);
		},
		key: "9",
		label: "Bottom Right",
		symbol: "rectangle.inset.bottomtrailing.filled",
	},
];
