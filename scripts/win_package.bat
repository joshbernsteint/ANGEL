@echo off
@REM Compile main executable
cd ../setup
g++ win_setup.cpp -o win_setup 
cd ../
cd server && start cmd /c "pkg ./package.json" 
cd ../electron-app && start cmd /c "npm run create"

