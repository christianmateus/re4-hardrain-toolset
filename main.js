// Modules
const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require('fs');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Create a new BrowserWindow when `app` is ready
function createWindow() {

  mainWindow = new BrowserWindow({
    width: 1000, height: 500,
    autoHideMenuBar: true,
    frame: false,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      preload: 'preload.js'
    }

  })

  // mainWindow.webContents.openDevTools()
  // Load index.html into the new BrowserWindow
  mainWindow.loadFile('index.html');

  // Open DevTools - Remove for PRODUCTION!
  // mainWindow.webContents.openDevTools();

  // Listen for window being closed
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// Electron `app` is ready
app.on('ready', createWindow)

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
  if (mainWindow === null) createWindow()
})

/* ================== 
    FUNCTIONS
   ================== */

// Function for sending file path

ipcMain.on("openfile", () => {
  dialog.showOpenDialog(mainWindow, {
    filters: [{
      name: "ITA files", extensions: ["ITA"]
      // name: "All files", extensions: ["*"]
    }], properties: ["openFile"]
  })
    .then((um) => {
      let joao = um.filePaths.toString();
      // joao = joao.replace(/\\/g, "/") //Used to 
      mainWindow.webContents.send("dialog", joao);
      console.log(joao)
    })
})

// Saving actual file
ipcMain.on("saveFile", (e, arg) => {
  dialog.showSaveDialog(mainWindow,
    {
      filters: [
        { name: 'ITA Files', extensions: ['ITA'] }
      ]
    }).then((dados) => {
      let salvar = dados.filePath.toString();
      mainWindow.webContents.send("savefile", salvar);
      console.log(salvar)
    })
})

// Quiting application
ipcMain.on("quitApp", (e, arg) => {
  mainWindow.close();
})

// ====================
// Window menu buttons
ipcMain.on("minimize", (e, arg) => {
  mainWindow.minimize();
})

ipcMain.on("maximize", (e, arg) => {
  mainWindow.maximize();
})

ipcMain.on("closeWindow", (e, arg) => {
  mainWindow.close();
})

ipcMain.on("openMainMenu", (e, arg) => {
  mainWindow.loadFile("menu.html");
})