@echo off

REM Start Vite renderer in a new window
start cmd /k "cd src\main\renderer && npm run dev"

REM Open a vscode process and run the electron main process
code "C:\Users\HP 830 G5\Documents\GitHub\Kilimogen\src\main\renderer" & npm run dev
