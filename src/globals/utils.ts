import { TARGET_KEYBOARD } from "./constants";

export const findTargetKeyboardID = () => {
	// Looks for target keyboard to change menubar menu name
	const kb = hs.keyboard.attachedKeyboards().find((k) => k.productName === TARGET_KEYBOARD);
	return kb ? kb.keyboardID : null;
};
