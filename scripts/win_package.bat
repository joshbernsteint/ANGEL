@echo off
@REM Compile main executable
cd ../setup
g++ x86win_install.cpp -o Angelx86WinInstall
g++ win_runner.cpp -o Angel 
cd ../
cd server && start cmd /c "pkg ./package.json" 
cd ../electron-app && start cmd /c "npm run create"

