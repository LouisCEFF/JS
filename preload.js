const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    loadlvl: (dirpath, level) => ipcRenderer.invoke('lvl:get', dirpath, level),
    getlvls: (dirpath) => ipcRenderer.invoke('lvls:get', dirpath),
    getdir: () => ipcRenderer.invoke('dir:get'),
})