const fs = require('fs');
const { ipcRenderer } = require('electron');

// Const for testing text output (DEBUG)

/* ===============
    CREATE
   =============== */

// Getting elements
var rootEl = document.querySelector("html");
var copyBtnEl = document.getElementById("copyBtn");
var pasteBtnEl = document.getElementById("pasteBtn");
var undoBtnEl = document.getElementById("undoBtn");
var redoBtnEl = document.getElementById("redoBtn");
var countEl = document.getElementById("count");
var headerFileName = document.getElementById("header-filename");
var headerFileSize = document.getElementById("header-filesize");

// Getting entries elements
const positionX = document.getElementById("pos-x");
const positionY = document.getElementById("pos-y");
const positionZ = document.getElementById("pos-z");
const rotationX = document.getElementById("rot-x");
const rotationY = document.getElementById("rot-y");
const rotationZ = document.getElementById("rot-z");
const scaleX = document.getElementById("scale-x");
const scaleY = document.getElementById("scale-y");
const scaleZ = document.getElementById("scale-z");
const modelNumber = document.getElementById("model-number");
const SMXNumber = document.getElementById("smx-number");
const typeNumber = document.getElementById("type-number");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const entryNumber = document.getElementById("entry-number");
const entryTotal = document.getElementById("entry-total");

// Getting models elements
const exportOneModelBtn = document.getElementById("export-model");
const importOneModelBtn = document.getElementById("import-model");
const exportAllModelsBtn = document.getElementById("exportall-model");
const importAllModelsBtn = document.getElementById("importall-model");

// Const for getting Menu elements
const openFile = document.getElementById("openSMDfile");
const closeBtn = document.getElementById("closeSMDfile");
const saveBtn = document.getElementById("saveSMDfile");
const saveAsBtn = document.getElementById("saveSMDas");
const quitApp = document.getElementById("quitApp");
const minimizeBtn = document.getElementById("minimize");
const maximizeBtn = document.getElementById("maximize");
const closeWindowBtn = document.getElementById("closeWindow");

// Menu actions (open/save/quit)
openFile.addEventListener("click", () => {
    ipcRenderer.send("openSMDfile")
    ipcRenderer.send("closeSMDfile")
})

saveAsBtn.addEventListener("click", () => {
    ipcRenderer.send("saveAsSMDfile")
})

quitApp.addEventListener("click", () => {
    ipcRenderer.send("quitApp")
})

// Window menu actions
menuWindow.addEventListener("click", () => {
    ipcRenderer.send("openMainMenu")
})

minimizeBtn.addEventListener("click", () => {
    ipcRenderer.send("minimize")
})

maximizeBtn.addEventListener("click", () => {
    ipcRenderer.send("maximize")
})

closeWindowBtn.addEventListener("click", () => {
    ipcRenderer.send("closeWindow")
})

// Basic funcionalities


/* ===============
    READ
   =============== */

// Global variables
var chunk = 0; // Will be incremented in each chunk
var entrySize = 64;
var allEntriesSize = 0;
var pointerModelsArea = 0;
var pointerTexturesArea = 0;
var pointersModel = [];
var iterator = 0;

// Menu bar buttons 
copyBtnEl.addEventListener("click", () => document.execCommand("copy")); // Copy function
pasteBtnEl.addEventListener("click", () => document.execCommand("paste")); // Paste function
undoBtnEl.addEventListener("click", () => document.execCommand("undo")); // Undo function
redoBtnEl.addEventListener("click", () => document.execCommand("redo")); // Redo function

// Getting file path
ipcRenderer.on("smdFileChannel", (e, filepath) => {

    var fd = fs.openSync(filepath); // Opening the file in memory
    var buffer = fs.readFileSync(fd); // Converting file string to buffer (hex)

    // Defining headers
    var SMDFileName = String(filepath);
    var SMDFileName_converted = SMDFileName.replace(/^[^.]*\\/gm, '');
    headerFileSize.value = buffer.length + " bytes"; // Outputing file size to the header
    headerFileName.value = SMDFileName_converted; // Outputing file name to the header

    // Reading SMD file header 
    entryTotal.value = buffer.readUint16LE(2);
    pointerModelsArea = buffer.readUint32LE(4);
    pointerTexturesArea = buffer.readUint32LE(8);

    // Spliting the file in 3 parts
    var buffer_entries = buffer.subarray(0, pointerModelsArea);
    var buffer_models = buffer.subarray(pointerModelsArea, pointerTexturesArea);
    var buffer_textures = buffer.subarray(pointerTexturesArea);


    // Core functions
    function createElement(index) {
        let firstDivTag = document.createElement("div");
        let detailsTag = document.createElement("details");
        let summaryTag = document.createElement("summary");
        let secondDivTag = document.createElement("div");
        let textareaTag = document.createElement("textarea");

        firstDivTag.classList.add("principal-div")
        detailsTag.classList.add("message-container");
        summaryTag.innerText = "Message " + index;
        secondDivTag.classList.add("details-expanded");
        textareaTag.classList.add("text-boxes");
        textareaTag.id = index;

        containerLeftSideEl.append(firstDivTag);
        firstDivTag.appendChild(detailsTag);
        secondDivTag.appendChild(textareaTag)
        detailsTag.append(summaryTag, secondDivTag);

    }
    function showTextBox(message, status) {
        var removedMessage = document.querySelector(".removedEntry");
        removedMessage.style.display = "block"
        removedMessage.style.backgroundColor = status;
        if (status == "exported") {
            document.getElementById("removedEntry").firstElementChild.style.backgroundColor = "#333"
            document.getElementById("removedEntry").firstElementChild.style.border = "2px solid #ddd"
            document.getElementById("removedEntry").firstElementChild.style.width = "35%"
            document.getElementById("removedEntry").firstElementChild.innerHTML = '<i class="fa-solid fa-file-export"></i>&nbsp&nbsp' + message;
        }
        if (status == "imported") {
            document.getElementById("removedEntry").firstElementChild.style.backgroundColor = "#353"
            document.getElementById("removedEntry").firstElementChild.style.border = "2px solid #7f7"
            document.getElementById("removedEntry").firstElementChild.style.color = "2px solid #7f7"
            document.getElementById("removedEntry").firstElementChild.style.color = "2px solid #7f7"
            document.getElementById("removedEntry").firstElementChild.style.width = "35%"
            document.getElementById("removedEntry").firstElementChild.innerHTML = '<i class="fa-solid fa-file-import"></i>&nbsp&nbsp' + message;
        }
        setTimeout(() => {
            removedMessage.style.display = "none"
        }, 2000);
    }

    function readEntry(entryChunk) {
        chunk = chunk + entryChunk;
        positionX.value = buffer_entries.readFloatLE(16 + chunk).toFixed(2);
        positionY.value = buffer_entries.readFloatLE(20 + chunk).toFixed(2);
        positionZ.value = buffer_entries.readFloatLE(24 + chunk).toFixed(2);
        rotationX.value = buffer_entries.readFloatLE(32 + chunk).toFixed(2);
        rotationY.value = buffer_entries.readFloatLE(36 + chunk).toFixed(2);
        rotationZ.value = buffer_entries.readFloatLE(40 + chunk).toFixed(2);
        scaleX.value = buffer_entries.readFloatLE(48 + chunk).toFixed(1);
        scaleY.value = buffer_entries.readFloatLE(52 + chunk).toFixed(1);
        scaleZ.value = buffer_entries.readFloatLE(56 + chunk).toFixed(1);
        modelNumber.value = buffer_entries.readUint8(64 + chunk);
        SMXNumber.value = buffer_entries.readUint8(67 + chunk);
        typeNumber.value = buffer_entries.readUint8(72 + chunk);
    }
    function readModelOffsets() {
        let bytesRows = buffer_models.readUint32LE(0) / 4; // Gets n rows of bytes
        for (let i = 0; i < bytesRows; i++) {
            pointersModel.push(buffer_models.readUint32LE(0 + iterator))
            iterator += 4;
        }
        return pointersModel;
    }

    var modelComplete = "";
    var bytes = 0;
    function readBinModel(modelChunk) {
        if (modelChunk != pointersModel.length && pointersModel[modelChunk] != 0) {
            return buffer_models.subarray(pointersModel[modelChunk - 1], pointersModel[modelChunk]);
        } else {
            return buffer_models.subarray(pointersModel[modelChunk - 1]);
        }
    }

    readEntry(0);
    readModelOffsets();

    nextBtn.addEventListener("click", function () {
        if (entryNumber.value != buffer_entries.readUint16LE(2)) {
            entryNumber.value = Number(entryNumber.value) + 1;
            readEntry(64);
        } else {
            return;
        }
    })
    prevBtn.addEventListener("click", function () {
        if (entryNumber.value > 1) {
            entryNumber.value = Number(entryNumber.value) - 1;
            readEntry(-64);
        } else {
            return;
        }
    })
    exportOneModelBtn.addEventListener("click", function () {
        fs.mkdirSync(`SMD/${SMDFileName_converted}`, { recursive: true });
        fs.writeFileSync(`SMD/${SMDFileName_converted}/${entryNumber.value}.bin`, readBinModel(entryNumber.value));
    })
    exportAllModelsBtn.addEventListener("click", function () {
        fs.mkdirSync(`SMD/${SMDFileName_converted}`, { recursive: true });
        for (let i = 0; i < entryTotal.value; i++) {
            fs.writeFileSync(`SMD/${SMDFileName_converted}/${i}.bin`, readBinModel(i + 1));
        }
    })

    /* ===============
        UPDATE
       =============== */



    /* ==========================================
        NEW FUNCIONALITY: 
       ========================================== */

    // Save all modified buffer back to file
    saveBtn.addEventListener("click", () => {
        fs.writeFileSync(filepath, buffer);
        var saveMessage = document.querySelector(".hide");
        saveMessage.style.display = "block"
        setTimeout(() => {
            saveMessage.style.display = "none"
        }, 2000);
    })

    closeBtn.addEventListener("click", () => {
        ipcRenderer.send("closeSMDfile");
    })

    ipcRenderer.on("saveAsSMDfileContent", (e, arg) => {
        fs.writeFileSync(arg, buffer);
    })
})
