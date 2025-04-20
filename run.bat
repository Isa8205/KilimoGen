@echo off

REM Start Vite renderer in a new window
start cmd /k "cd src\main\renderer && npm run dev"

REM Start Electron main process in the current window
npm run dev
