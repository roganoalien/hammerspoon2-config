// Shared types for the windowManager on-screen menu.

export interface MenuButton {
	key: string;
	label: string;
	symbol: string; // SF Symbol name
	fn: () => void;
}

export type CordinatesType = {
	x: number;
	y: number;
	w: number;
	h: number;
};

export type PositionType = {
	bottom: CordinatesType;
	center: CordinatesType;
	leftBottom: CordinatesType;
	leftThird: CordinatesType;
	leftTop: CordinatesType;
	rightBottom: CordinatesType;
	rightThird: CordinatesType;
	rightTop: CordinatesType;
	top: CordinatesType;
};
