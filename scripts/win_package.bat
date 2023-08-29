@echo off
@REM Compile main executable
cd ../setup
g++ x86win_install.cpp -static -o Angelx86WinInstall angel.res
g++ win_runner.cpp -static -o Angel angel.res
cd ../
cd server && start cmd /c "pkg ./package.json" 
cd ../electron-app && start cmd /c "npm run create"

