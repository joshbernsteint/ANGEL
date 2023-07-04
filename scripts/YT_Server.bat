@echo off
start cmd /c "cd D:/Coding/YouTube_Downloader/server && npm run dev"
cd D:/Coding/YouTube_Downloader/client
start cmd /c "npm run start"
@REM DON'T USE THIS