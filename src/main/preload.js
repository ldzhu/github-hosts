const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('hosts', {
    generate: () => ipcRenderer.invoke('hosts.generate')
});

