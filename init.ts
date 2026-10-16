// Hammerspoon 2 configuration file init NEEDS COMPILATION
//
//
// Full API documentation: https://cmsj.github.io/Hammerspoon2
// You can also browse it locally at any time with: hs.docs.show()
//
// See also:
// - https://cmsj.github.io/Hammerspoon2/main/js/getting-started.html
// - https://cmsj.github.io/Hammerspoon2/main/js/migration-guide.html
// NOTE: this file compiles to ./compiled/init.js. These are side-effect
import "@capslock";
import "@keyboardLayout";
import "@mic";
import "@windowManager";

hs.notify.show("Hammerspoon 2", "Config loaded successfully.", () => {
	console.log("Hammerspoon 2 config loaded successfully.");
});

// Example: bind cmd+alt+h to show a notification.
// Uncomment the lines below and reload your config to try it out.
//
// const helloHotkey = hs.hotkey.bind(["command", "control", "option", "shift"], "l", () => {
//   hs.notify.show("Hammerspoon 2", "Hello from your config!")
// })
//
// Note: capture the return value in a variable that lives as long as your config
//       does, otherwise it will simply stop firing after the next garbage collection.
