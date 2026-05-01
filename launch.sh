#!/bin/bash
set -e

echo ""
echo "  Unequal Trade — Mac App Setup"
echo "  =============================="
echo ""

cd "$(dirname "$0")"

echo "  Installing dependencies..."
npm install --silent

echo "  Loading your OANDA credentials..."
export OANDA_API_KEY=$(grep OANDA_API_KEY ~/.hermes/.env 2>/dev/null | cut -d'=' -f2)
export OANDA_ACCOUNT_ID=$(grep OANDA_ACCOUNT_ID ~/.hermes/.env 2>/dev/null | cut -d'=' -f2)

if [ -z "$OANDA_API_KEY" ]; then
  echo "  Warning: OANDA_API_KEY not found in ~/.hermes/.env"
  echo "  Live prices and balance will not load."
fi

echo "  Launching Unequal Trade..."
echo ""
npx electron .
