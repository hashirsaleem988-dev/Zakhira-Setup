const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    backgroundColor: '#F7F3EA',
    autoHideMenuBar: true,

    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  // Diagnostic: Open DevTools
  mainWindow.webContents.openDevTools()

  // Diagnostic: Detect page loading failures
  mainWindow.webContents.on('did-fail-load', (_, code, description, url) => {
    console.error('LOAD FAILED:', code, description, url)
  })

  // Diagnostic: Detect renderer console messages
  mainWindow.webContents.on('console-message', (_, details) => {
    console.log('RENDERER:', details.message)
  })

  // Development and production loading
  if (!app.isPackaged) {
    mainWindow.loadURL('http://127.0.0.1:5173')
  } else {
    mainWindow.loadFile(
      path.join(__dirname, '../dist/index.html')
    )
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})