# Unequal Trade — Mac Dashboard

## Quick start

```bash
cd unequal-trade-app
bash launch.sh
```

That's it. The app will:
- Install Electron automatically on first run
- Load your OANDA credentials from ~/.hermes/.env
- Open the dashboard with live balance and prices

## What's in the dashboard

- **Overview** — live balance, P&L, NAV, margin from OANDA
- **Trades** — trade history and open positions
- **Hypothesis** — latest agent hypothesis and Opus validation
- **Live prices** — real-time EUR/USD, GBP/USD, USD/CAD, USD/JPY, XAU/USD
- **Predictions** — agent confidence estimates for next 24h
- **Memory** — learned patterns from ~/.hermes/memories/MEMORY.md
- **Token costs** — daily/monthly Haiku + Opus cost breakdown
- **What's next** — next cycle time, setup checklist

## Build a proper .app (optional)

To build a distributable Mac .app bundle:

```bash
npm run build
```

The .app will appear in the `dist/` folder. Drag it to /Applications.

## Requirements

- Node.js (already installed)
- OANDA_API_KEY and OANDA_ACCOUNT_ID in ~/.hermes/.env
- Hermes running with Claude Haiku + Opus config
