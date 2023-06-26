const {app, BrowserWindow } = require('electron');
const path = require('path')
require('./server/server.js');//TODO: CHANGE THIS

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1400,
        height: 1000,
    })
    win.webContents.openDevTools();
    win.loadFile(`index.html`)
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
      });
})
app.on('window-all-closed',() => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})