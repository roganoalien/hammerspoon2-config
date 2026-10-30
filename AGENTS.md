# AGENTS.md

## Project

This is a **Hammerspoon** configuration project. Hammerspoon **version 2+** was
rewritten as a native **Swift** application and now exposes its automation API to
**JavaScript** and **TypeScript** (the earlier 1.x line was Lua-based). This repo
holds the user's config, written in TypeScript and compiled to JavaScript that the
Hammerspoon runtime loads.

## API source of truth

The authoritative reference for the Hammerspoon 2 API is:

**https://cmsj.github.io/Hammerspoon2/main/js/**

Always consult it when using or reasoning about any `hs.*` module, global type
(`HSImage`, `HSColor`, `HSAudioDevice`, etc.), event name, or method signature.
Do not assume Hammerspoon 1.x (Lua) APIs apply — they do not. The local
`hammerspoon.d.ts` is auto-generated from this same documentation and can be used
for type-level confirmation.

## Build & verify

- Runtime / package manager: **Bun**.
- Install deps: `bun install`
- Type check: `bun run typecheck` (`tsc --noEmit`)
- Build: `bun run build` (`tsc && tsc-alias` → emits to `./compiled`)
- Lint / format: `bun run check` (Biome)

TypeScript sources in `src/` compile to `./compiled`, which Hammerspoon loads via
its own CommonJS `require()`. After changing any `.ts`, run the build so the
compiled output stays in sync.

## Layout

- `init.ts` — entry point; imports each feature module via `@<name>` path aliases.
- `src/<name>/index.ts` — a feature module, importable as `@<name>`.
- `compiled/` — build output (generated; do not edit by hand).
- `hammerspoon.d.ts`, `globals.d.ts` — ambient type definitions.

<!-- Fill in the rest by hand below. -->

## Overview
This is my HammerSpoon 2 configuration to my own personal taste and needs. Is using bun as a package manager and TypeScript to make the development easier and faster.

## General Principles
* Keep explanations minimal; focus on executable code and strict implementations.
* When asked, explain as simple and concise as possible but as clear as possible.
* Do not alter unrelated files or dependencies unless explicitly requested.
* In `.kiro/CHANGES_KIRO.md` always add a summary of the changes you just made; only do it if you just modify one or more files.
* After every change on any file make a git commit.
* Do not run a build when applicable.
* When more than one or two small changes, show a brief summary of what was done and how many files were modified.
* Kepp comments in code as minimal or do not add them unless asked otherwise.
* When file or component is getting too complex and long with lots of functions, useEffect or similar. Put everything that can be in other file and call that file the same as the component but add a `Functions.{ts,tsx}` at the end of the file name and use `ts` or `tsx` depending on what the file will do.
* When possible add test for components and if no testing tool is installed as a dev dependency, install one; use the recommended testing tool for NextJS and React.
* Always consider good practices for code reading but most importantly performance.

## Commit Instructions
* Add a concise Title; no more than 3 words and add emojis related to the commit.
* The message is a summary of what you just did.
* List all files you've just modified.
* If applies, when asked previously a why, how or what type of question, add at the top of the commit message a summary of why you just did a change.
* At the end of the message always add your meta data (kiro-cli tool name, version, tokens used in that change if available, model used, date, skills and mcp if used any)

## Code Style & Conventions

### TypeScript Rules
* Always export explicit types or interfaces for function parameters and return values.
* Avoid `any` at all costs; use `unknown` with narrowers if the type is dynamic.
* Favor immutability: use `redonly` properties when applicable.

```typescript
// BAD
export function parseUser(data: any) {
	return data.user;
}

// GOOD
export interface UserPayload {
	id: string;
	email: string;
}

export function parseUser(data: Record<string, unknown>): UserPayload {
	if (typeof data.id !== "string" || typeof data.email !== "string") {
		throw new Error("Invalid payload structure");
	}
	return { id: data.id, email: data.email };
}
```

### JavaScript Rules
* Always throw errors when applicable.
* Favor the use of `const`.
* Follow Biome rules.
* Use modern APIs when applicable.
* Always look for performance.