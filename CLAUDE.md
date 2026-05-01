# Unequal Trade Dashboard

## Design system
- Font: PP Radio Grotesk (embedded in dashboard.html as base64)
  - Weight 200 = Ultralight — large numbers and headings
  - Weight 400 = Regular — body text
- Colors:
  - Black: #2b2b2f — primary text
  - Terra cotta: #dd5f32 — accent, active states, CTAs, down trends
  - Green: #afb59d — up trends, secondary accents
  - White Smoke: #eeeee9 — page background
- Style: minimal, editorial, generous whitespace, 1px borders only, no shadows, no rounded corners

## Files
- src/dashboard.html — all UI, fonts embedded as base64
- src/main.js — Electron backend, reads OANDA credentials from ~/.hermes/.env
- src/preload.js — IPC bridge between main and renderer
- src/icon.png — Unequal Trade logo

## OANDA
- Demo account, fxPractice API
- Credentials read automatically from ~/.hermes/.env
- Account ID: 101-002-39212518-001

## Launch
bash launch.sh
