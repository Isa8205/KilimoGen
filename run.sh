#!/bin/bash

# Run renderer in background
(cd src/main/renderer && npm run dev) &

# Run Electron in foreground
npm run dev
