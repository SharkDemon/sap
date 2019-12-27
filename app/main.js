const { app, BrowserWindow } = require('electron')
const path = require('path')

let mainWindow

function createWindow() {
    // create the browser window
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
            //nodeIntegration: true
        }
    });

    mainWindow.loadFile('app/index.html')

    //mainWindow.webContents.openDevTools

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
    if (null === mainWindow) createWindow()
})
