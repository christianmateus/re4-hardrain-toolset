// Modules
const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require('fs');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Create a new BrowserWindow when `app` is ready
function createWindow() {

  mainWindow = new BrowserWindow({
    width: 1000, height: 600, minWidth: 600, minHeight: 300, maxWidth: 1000,
    autoHideMenuBar: true,
    frame: false,
    icon: "./icons/icon.png",
    webPreferences: {
      // devTools: false,
      contextIsolation: false,
      nodeIntegration: true,
      preload: 'preload.js'
    }

  })

  // Load menu.html into the new BrowserWindow
  mainWindow.loadFile('menu.html');

  // Open DevTools - Remove for PRODUCTION!
  mainWindow.webContents.openDevTools();

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
  mainWindow.loadFile("ita.html")
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


// Function for sending AEV file path
ipcMain.on("openAEVfile", () => {
  dialog.showOpenDialog(mainWindow, {
    filters: [{
      name: "AEV files", extensions: ["AEV"]
      // name: "All files", extensions: ["*"]
    }], properties: ["openFile"]
  })
    .then((um) => {
      let AEVfile = um.filePaths.toString();
      mainWindow.webContents.send("aevFileChannel", AEVfile);
      console.log(AEVfile)
    })
})

// Saving actual AEV file
ipcMain.on("saveAsAEVfile", (e, arg) => {
  dialog.showSaveDialog(mainWindow,
    {
      filters: [
        { name: 'AEV Files', extensions: ['AEV'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    }).then((dados) => {
      let salvar = dados.filePath.toString();
      mainWindow.webContents.send("saveAsAEVfileContent", salvar);
      console.log(salvar)
    })
})

// Importing object files
ipcMain.on("AEVimportBtn", (e, arg) => {
  dialog.showOpenDialog(mainWindow, {
    filters: [
      { name: 'OBJ Files', extensions: ['obj'] }
    ]
  }).then((dados) => {
    let importObjPath = dados.filePaths.toString();
    mainWindow.webContents.send("AEVobj", importObjPath);
    console.log(importObjPath)
  })
})

// Closing AEV file (workaround)
ipcMain.on("closeAEVfile", (e, arg) => {
  mainWindow.loadFile("aev.html")
})

// Function for sending MDT file path
ipcMain.on("openMDTfile", () => {
  dialog.showOpenDialog(mainWindow, {
    filters: [{
      name: "MDT files", extensions: ["MDT"]
    }], properties: ["openFile"]
  })
    .then((um) => {
      let MDTfile = um.filePaths.toString();
      mainWindow.webContents.send("mdtFileChannel", MDTfile);
      console.log(MDTfile)
    })
})

// Saving actual MDT file
ipcMain.on("saveAsMDTfile", (e, arg) => {
  dialog.showSaveDialog(mainWindow,
    {
      filters: [
        { name: 'MDT Files', extensions: ['MDT'] }
      ]
    }).then((dados) => {
      let salvar = dados.filePath.toString();
      mainWindow.webContents.send("saveAsMDTfileContent", salvar);
      console.log(salvar)
    })
})

// Closing MDT file (workaround)
ipcMain.on("closeMDTfile", (e, arg) => {
  mainWindow.loadFile("mdt.html")
})

// Function for sending BIN file path
ipcMain.on("openBINfile", () => {
  dialog.showOpenDialog(mainWindow, {
    filters: [{
      name: "BIN files", extensions: ["bin"]
    }], properties: ["openFile"]
  })
    .then((um) => {
      let BINfile = um.filePaths.toString();
      mainWindow.webContents.send("binFileChannel", BINfile);
      console.log(BINfile)
    })
})

// Importing OBJ to BIN files
ipcMain.on("BINimportBtn", (e, arg) => {
  dialog.showOpenDialog(mainWindow, {
    filters: [
      { name: 'OBJ Files', extensions: ['obj'] }
    ]
  }).then((dados) => {
    let importObjPath = dados.filePaths.toString();
    mainWindow.webContents.send("BINobj", importObjPath);
    console.log(importObjPath)
  })
})

// Closing BIN file (workaround)
ipcMain.on("closeBINfile", (e, arg) => {
  mainWindow.loadFile("bin.html")
})

// Function for sending SMD file path
ipcMain.on("openSMDfile", () => {
  dialog.showOpenDialog(mainWindow, {
    filters: [{
      name: "SMD files", extensions: ["SMD"]
    }], properties: ["openFile"]
  })
    .then((um) => {
      let SMDfile = um.filePaths.toString();
      mainWindow.webContents.send("smdFileChannel", SMDfile);
      console.log(SMDfile)
    })
})

// Saving actual SMD file
ipcMain.on("saveAsSMDfile", (e, arg) => {
  dialog.showSaveDialog(mainWindow,
    {
      filters: [
        { name: 'SMD Files', extensions: ['SMD'] }
      ]
    }).then((dados) => {
      let salvar = dados.filePath.toString();
      mainWindow.webContents.send("saveAsSMDfileContent", salvar);
      console.log(salvar)
    })
})

// Closing SMD file (workaround)
ipcMain.on("closeSMDfile", (e, arg) => {
  mainWindow.loadFile("smd.html")
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
  mainWindow.loadFile("ita.html")
})

ipcMain.on("openETStool", () => {
  mainWindow.loadFile("ets.html")
})

ipcMain.on("openAEVtool", () => {
  mainWindow.loadFile("aev.html")
})

ipcMain.on("openMDTtool", () => {
  mainWindow.loadFile("mdt.html")
})

ipcMain.on("openBINtool", () => {
  mainWindow.loadFile("bin.html")
})

ipcMain.on("openSMDtool", () => {
  mainWindow.loadFile("smd.html")
})