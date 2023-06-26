const {app, BrowserWindow } = require('electron');
const path = require('path');
const cp = require('child_process');
// require('D:/Coding/YouTube_Downloader/server/server.js');//TODO: CHANGE ME

var download_server;

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1400,
        height: 1000,
    })
    // win.webContents.openDevTools();
    download_server = cp.fork(path.join(__dirname,'yt_server/server.js'));
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
        download_server.kill('SIGKILL');
        app.quit();
    }
})