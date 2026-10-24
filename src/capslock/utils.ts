import type { AnchorPosType } from "./types";

export const whiteSymbol = (name: string, size: number): HSImage | null => {
	const source = HSImage.fromSymbol(name);
	if (!source) return null;
	source.size = new HSSize(size, size);

	const canvas = hs.canvas.create({ h: size, w: size, x: 0, y: 0 });
	canvas.appendElements([
		{
			frame: { h: size, w: size, x: 0, y: 0 },
			image: source,
			imageAlignment: "center",
			imageScaling: "scaleProportionally",
			type: "image",
		},
		{
			action: "fill",
			compositeRule: "sourceIn",
			fillColor: { alpha: 1, blue: 1, green: 1, red: 1 }, // white
			frame: { h: size, w: size, x: 0, y: 0 },
			type: "rectangle",
		},
	]);
	const tinted = canvas.imageFromCanvas();
	canvas.destroy();
	return tinted ?? source;
};

export const frameForAnchor = (anchor: AnchorPosType, screenFrame: HSRect) => {
	const WIN = 100;

	const f = screenFrame;
	const maxX = f.x + f.w - WIN; // right-aligned x
	const maxY = f.y + f.h - WIN; // bottom-aligned y
	const midX = f.x + (f.w - WIN) / 2; // horizontally centered x
	const midY = f.y + (f.h - WIN) / 2; // vertically centered y

	switch (anchor) {
		case "top-left":
			return { h: WIN, w: WIN, x: f.x, y: maxY };
		case "top-center":
			return { h: WIN, w: WIN, x: midX, y: maxY };
		case "top-right":
			return { h: WIN, w: WIN, x: maxX, y: maxY };
		case "bottom-left":
			return { h: WIN, w: WIN, x: f.x, y: f.y };
		case "bottom-center":
			return { h: WIN, w: WIN, x: midX, y: f.y };
		case "bottom-right":
			return { h: WIN, w: WIN, x: maxX, y: f.y };
		case "center":
			return { h: WIN, w: WIN, x: midX, y: midY };
	}
};
