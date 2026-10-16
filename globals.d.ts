// globals.d.ts
//
// Small ambient shims for globals that Hammerspoon's runtime provides but
// which are not part of the generated hammerspoon.d.ts.
//
// Hammerspoon loads config files through its own CommonJS-style require(),
// so init.ts (and any .ts that pulls in sibling files) can call require()
// directly. This declares it so TypeScript stops reporting it as undeclared.
//
// Keep this file free of top-level import/export so it stays an ambient
// (global) script, matching how hammerspoon.d.ts declares `hs` et al.

// require() genuinely returns an untyped value; `any` is correct here.
// biome-ignore lint/suspicious/noExplicitAny: CommonJS require has no static type
declare function require(path: string): any;
