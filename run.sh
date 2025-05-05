#!/bin/zsh

# Ensure we’re in the project root
cd "$(dirname "$0")"

# Run renderer in background
(cd src/main/renderer && npm run dev) &

# Run Electron in foreground
npm run dev
