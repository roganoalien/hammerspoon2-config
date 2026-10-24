export const TARGET_KEYBOARD: string = "NuPhy Halo96" as const;
// Bundle IDs rather than display names: HSApplication.name can return null in
// the current Hammerspoon build, while bundleID is reliable and locale-neutral.
// Confirm/add IDs from the console (onActivate logs each app's bundleID).
export const allowedApps: string[] = [
	"com.microsoft.VSCode", // Code / Visual Studio Code
	"com.mitchellh.ghostty", // Ghostty
	"dev.zed.Zed", // Zed
	"com.usebruno.app", // Bruno
	"com.apple.dt.Xcode", // Xcode
];
