// init.js — Hammerspoon entry point (plain JavaScript, loaded directly by Hammerspoon)
//
// Do NOT put real config here. The actual configuration is written in
// TypeScript (init.ts) and compiled to ./compiled/init.js by `tsc`.
// This bootstrap simply loads that compiled output.
//
// Build once:   npm run build
// Watch:        npm run watch   (recompiles on save; then reload Hammerspoon)

require("./compiled/init.js");
