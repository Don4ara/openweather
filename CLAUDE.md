# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev              # run directly with Bun (passes args: bun run dev Stockholm)
bun run build            # bundle to dist/
bun run compile          # compile to single executable: ./openweather
bun run typecheck        # tsc --noEmit
./bin/openweather [city] --debug   # run installed binary
```

No tests exist in this project.

## Architecture

CLI entry: `main.tsx` → `cli.tsx` (Commander) → renders `App.tsx` via Ink.

**Data flow:**
1. `App` holds all state: `query`, `weather`, `messages`, `loading`, `error`
2. On `query` change, calls `services/weather.ts → getWeather(city)`
3. `getWeather` geocodes city (Open-Meteo first, Nominatim fallback), then fetches forecast from `api.open-meteo.com`
4. Result stored in `WeatherResult`; appended to `messages[]` as `{role: 'forecast'}` for history

**Chat-history model:** `messages: ChatMessage[]` is a union of `user | tool | error | forecast` roles, rendered as a scrollable conversation log by `Message.tsx`. The header (`AppHeader`) always shows current city state; history shows previous queries below it.

**No API key required** — open-meteo and Nominatim are free/keyless.

**UI structure:**
- `AppHeader` — fixed top panel: weather icon + current conditions + tips sidebar
- `Message` — renders each history entry (user input or forecast result)
- `PromptInput` — bare `useInput` hook, no external input library
- `StatusBar` — static footer

**Resize handling:** `App` listens for `process.stdout.on('resize')` and force-redraws with `\x1B[2J\x1B[H`.

**Language:** UI strings are in Russian. `wmoToCondition()` maps WMO weather codes to Russian condition names.
