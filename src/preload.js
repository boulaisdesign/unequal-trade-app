const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  fetchAccount: () => ipcRenderer.invoke('fetch-account'),
  fetchPrices: () => ipcRenderer.invoke('fetch-prices'),
  fetchTrades: () => ipcRenderer.invoke('fetch-trades'),
  fetchTransactions: () => ipcRenderer.invoke('fetch-transactions'),
  readMemory: () => ipcRenderer.invoke('read-memory'),
  notify: (title, body) => ipcRenderer.invoke('notify', { title, body }),
  runCycle: () => ipcRenderer.invoke('run-cycle')
})
