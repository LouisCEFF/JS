const { BrowserWindow, app, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

ipcMain.handle("dir:get", () => {
    const dir = path.join(__dirname, "Assets");

    return fs.readdirSync(dir);
});

ipcMain.handle('lvls:get', (_event, dirpath) => {
    const dir = path.join(__dirname, 'Assets', dirpath);

    return fs.readdirSync(dir).filter(f => f.endsWith('.txt') || f.endsWith('.xsb'));
});

ipcMain.handle('lvl:get', (_event, dirpath, level) => {
    const lvlFile = path.join(__dirname, 'Assets', dirpath, level);

    const lvl = fs.readFileSync(lvlFile, 'utf8');
    const s = lvl.slice(0, lvl.indexOf('A'));
    const lvlString = s.substring(0, (s.length - 2)).split("\r\n");
    return lvlString;
});

function createWindow() {
    const window = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    window.loadFile('JS-SOKOBAN.html').then(() => {
        window.webContents.openDevTools({ mode: 'detach' });
    });
}

app.whenReady().then(createWindow);