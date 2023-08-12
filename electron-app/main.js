const {app, BrowserWindow } = require('electron');
const path = require('path');
// const electronInstaller = require('electron-winstaller');

var download_server;


const createWindow = () => {
    const win = new BrowserWindow({
        width: 1600,
        height: 1200,
        icon: __dirname + '/angel.png',
    })
    // win.webContents.openDevTools();
    win.loadFile(`index.html`);

}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0){
            createWindow()
        }
      });
})
app.on('window-all-closed',() => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})