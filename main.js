// Modules
const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require('fs');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Create a new BrowserWindow when `app` is ready
function createWindow() {

  mainWindow = new BrowserWindow({
    width: 1000, height: 500, minWidth: 600, minHeight: 300,
    autoHideMenuBar: true,
    frame: false,
    icon: "./icons/icon.png",
    webPreferences: {
      devTools: false,
      contextIsolation: false,
      nodeIntegration: true,
      preload: 'preload.js'
    }

  })

  // Load index.html into the new BrowserWindow
  mainWindow.loadFile('menu.html');

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

// Function for sending ITA file path

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

// Function for sending ETS file path

ipcMain.on("openETSfile", () => {
  dialog.showOpenDialog(mainWindow, {
    filters: [{
      name: "ETS files", extensions: ["ETS"]
      // name: "All files", extensions: ["*"]
    }], properties: ["openFile"]
  })
    .then((um) => {
      let ETSfile = um.filePaths.toString();
      // ETSfile = ETSfile.replace(/\\/g, "/") //Used to 
      mainWindow.webContents.send("etsFileChannel", ETSfile);
      console.log(ETSfile)
    })
})

// Saving As ITA file
ipcMain.on("saveFile", (e, arg) => {
  dialog.showSaveDialog(mainWindow,
    {
      filters: [
        { name: 'ITA Files', extensions: ['ITA'] }
      ]
    }).then((dados) => {
      let salvar = dados.filePath.toString();
      mainWindow.webContents.send("saveAsITA", salvar);
      console.log(salvar)
    })
})

// Closing ITA file (workaround)
ipcMain.on("closeITAfile", (e, arg) => {
  mainWindow.loadFile("index.html")
})

// Saving actual ETS file
ipcMain.on("saveAsETSfile", (e, arg) => {
  dialog.showSaveDialog(mainWindow,
    {
      filters: [
        { name: 'ETS Files', extensions: ['ETS'] }
      ]
    }).then((dados) => {
      let salvar = dados.filePath.toString();
      mainWindow.webContents.send("saveAsETSfileContent", salvar);
      console.log(salvar)
    })
})

// Closing ETS file (workaround)
ipcMain.on("closeETSfile", (e, arg) => {
  mainWindow.loadFile("ets.html")
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

ipcMain.on("openITAtool", () => {
  mainWindow.loadFile("index.html")
})

ipcMain.on("openETStool", () => {
  mainWindow.loadFile("ets.html")
})