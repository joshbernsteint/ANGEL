@echo off
@REM Compile main executable
g++ win_setup.cpp -o win_setup 
cd server && start cmd /c "pkg ./package.json" 
cd ../electron-app && start cmd /c "npm run create"

