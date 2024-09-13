const { contextBridge,ipcRenderer } = require('electron');

const API = {

    sendMsg: (msg) => ipcRenderer.send('message', msg),
    reciveMsg: (callback) => ipcRenderer.on('reply', (event, arg) => callback(arg)),
    getCharacters: (callback) => ipcRenderer.on('characters', (event, arg) => callback(arg)),
    askForCharacters: () => ipcRenderer.send('characters'),
}

contextBridge.exposeInMainWorld('api', API);