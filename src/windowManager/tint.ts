// SF Symbol tinting via hs.canvas.

import { TILE } from "./config";

// hs.canvas colors are {red,green,blue,alpha} in 0..1, so convert a hex string.
export const canvasColor = (hex: string) => {
	const t = hex.replace("#", "");
	const full =
		t.length === 3
			? t
					.split("")
					.map((c) => c + c)
					.join("")
			: t;
	const at = (i: number) => parseInt(full.slice(i, i + 2), 16) / 255;
	return {
		alpha: full.length >= 8 ? at(6) : 1,
		blue: at(4),
		green: at(2),
		red: at(0),
	};
};

// Recolor an SF Symbol to `hex`. An SF Symbol is black-on-transparent, so it
// would be nearly invisible on a dark background. We composite a colored fill
// through the symbol's alpha with "sourceIn" on its own canvas — the symbol
// provides the shape, the rectangle paints through it. (Technique from
// dmgerman/hammerspoon-2-config's tintedImage.)
export const tintSymbol = (symbolName: string, hex: string): HSImage | null => {
	const source = HSImage.fromSymbol(symbolName);
	if (!source) return null;

	// Rasterize larger than the tile so the result stays crisp when scaled.
	const box = TILE * 2;
	source.size = new HSSize(box, box);

	const canvas = hs.canvas.create({ h: box, w: box, x: 0, y: 0 });
	canvas.appendElements([
		{
			frame: { h: box, w: box, x: 0, y: 0 },
			image: source,
			imageAlignment: "center",
			imageScaling: "scaleProportionally",
			type: "image",
		},
		{
			action: "fill",
			compositeRule: "sourceIn",
			fillColor: canvasColor(hex),
			frame: { h: box, w: box, x: 0, y: 0 },
			type: "rectangle",
		},
	]);

	const tinted = canvas.imageFromCanvas();
	canvas.destroy();
	return tinted ?? source;
};
