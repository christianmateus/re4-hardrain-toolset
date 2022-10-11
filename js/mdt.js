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
var showAllBtn = document.getElementById("show-all-btn");
var hideAllBtn = document.getElementById("hide-all-btn");
var messageContainerEl = document.querySelector(".message-container");

// Const for getting Menu elements
const openFile = document.getElementById("openMDTfile");
const closeBtn = document.getElementById("closeMDTfile");
const saveBtn = document.getElementById("saveMDTfile");
const saveAsBtn = document.getElementById("saveMDTas");
const quitApp = document.getElementById("quitApp");
const minimizeBtn = document.getElementById("minimize");
const maximizeBtn = document.getElementById("maximize");
const closeWindowBtn = document.getElementById("closeWindow");

// Content elements
let textBoxEl = document.querySelector(".text-boxes");

var toggleWhiteTheme = document.querySelector(".white-theme-btn");
var toggleDarkTheme = document.querySelector(".dark-theme-btn");

// Menu actions (open/save/quit)
openFile.addEventListener("click", () => {
    ipcRenderer.send("openMDTfile")
    ipcRenderer.send("closeMDTfile")
})

saveAsBtn.addEventListener("click", () => {
    ipcRenderer.send("saveAsMDTfile")
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

// 
showAllBtn.addEventListener("click", function () {
    messageContainerEl.setAttribute("open", "true");
})

/* ===============
    READ
   =============== */

// Global variables
var chunk = 0; // Will be incremented in each chunk

// Menu bar buttons 
copyBtnEl.addEventListener("click", () => document.execCommand("copy")); // Copy function
pasteBtnEl.addEventListener("click", () => document.execCommand("paste")); // Paste function
undoBtnEl.addEventListener("click", () => document.execCommand("undo")); // Undo function
redoBtnEl.addEventListener("click", () => document.execCommand("redo")); // Redo function



// Getting file path
ipcRenderer.on("mdtFileChannel", (e, filepath) => {

    var fd = fs.openSync(filepath); // Opening the file in memory
    var buffer = fs.readFileSync(fd); // Converting file string to buffer (hex)
    var MDTFileName = String(filepath);
    var conv = MDTFileName.replace(/^[^.]*\\/gm, '');

    let total_languages = buffer.readUInt8(0); // Reading number of languages
    countEl.setAttribute("value", total_languages);
    headerFileSize.value = buffer.length + " bytes";
    headerFileName.value = conv;

    const Alphabet = {
        131: '0',
        194: 'b',
        195: 'c',
        196: 'd',
        197: 'e',
        e: 197
    }

    function showOffsets() {
        let count = 0;
        let allOffsets = '';
        let engLanguageKey = buffer.readUint32LE(8);
        let engLanguageOffset = buffer.readUint8(engLanguageKey + 4);
        let pointers = [];

        for (let i = 0; i != engLanguageOffset; i++) {
            let j = buffer.readUint32LE(engLanguageKey + 8 + count); //
            count = count + 4;
            pointers.push(j);
        }
        count = 0;
        for (let k = 0; k < (pointers[1] - pointers[0]) / 2; k++) {
            let tempChars = buffer.readUint16LE(engLanguageKey + pointers[0] + count);
            count = count + 2;
            allOffsets = allOffsets + tempChars;
        }
        for (let l = 0; l < Object.keys(Alphabet).length + 193; l++) {
            if (allOffsets.includes(l)) {
                console.log(l);
                console.log(Alphabet[l + 193]);
            }
            allOffsets = allOffsets.replace(l + 130, Alphabet[l + 130])
        }
        console.log(pointers);
        return textBoxEl.innerText = allOffsets;
    }

    showOffsets();

    // Main Functions
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
        ipcRenderer.send("closeMDTfile");
    })

    ipcRenderer.on("saveAsMDTfileContent", (e, arg) => {
        fs.writeFileSync(arg, buffer);
    })
})
