const fs = require('fs');
const { ipcRenderer } = require('electron');
const Alphabet = require('./mdt-alphabet');

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
let containerLeftSideEl = document.getElementById("container-text");
let textBoxEl = document.getElementsByClassName("text-boxes");

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

/* ===============
    READ
   =============== */

// Global variables
var chunk = 0; // Will be incremented in each chunk
let wordCollector = '';
let messageIterator = 0;

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

    function createElement(index) {
        let firstDivTag = document.createElement("div");
        let detailsTag = document.createElement("details");
        let summaryTag = document.createElement("summary");
        let secondDivTag = document.createElement("div");
        let textareaTag = document.createElement("textarea");

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

    function readMessages() {
        let count = 0; // Used and reused for many loop reasons
        let engLanguageKey = buffer.readUint32LE(8); // Search for English language KEY
        let engLanguageOffset = buffer.readUint8(engLanguageKey + 4); // Read messages quantity for Eng
        let pointers = []; // Array to every message pointer, for this particular language

        // Loop for each message box
        for (let index = 0; index != engLanguageOffset; index++) {
            createElement(Number(index + 1));
            count = 0;
            wordCollector = ''; // Empties the collector

            // Loop to detect and store every message pointer
            for (let i = 0; i != engLanguageOffset && index == 0; i++) {
                let j = buffer.readUint32LE(engLanguageKey + 8 + count); // Reads each message pointer
                count = count + 4;
                pointers.push(j); // Stores every message pointer, for this particular language
            }
            count = 0;

            // Loop to read every message chunk
            for (let k = 0; k < pointers.length; k++) {

                // Loop to read every char from a string
                for (let m = 0; ; m++) {
                    let tempChars = buffer.readUint16LE(engLanguageKey + pointers[messageIterator] + count); // Reads every short
                    count = count + 2;
                    wordCollector = wordCollector + tempChars; // Appends each character in the wordCollector
                    wordCollector = wordCollector.replace(String(tempChars), Alphabet.Alphabet[tempChars]); // Convert short to char

                    // Does the same of the above, but ends loop if finds flag [message-end] and completes one message
                    if (buffer.readUint16LE(engLanguageKey + pointers[messageIterator] + count) == 1) {
                        tempChars = buffer.readUint16LE(engLanguageKey + pointers[messageIterator] + count);
                        wordCollector = wordCollector + tempChars;
                        wordCollector = wordCollector.replace(tempChars, Alphabet.Alphabet[tempChars]);
                        break;
                    }
                } messageIterator++; // Changes which pointer should be read
                break;
            }
            count = 0;
            textBoxEl[index].innerHTML = wordCollector;
        }
    }

    readMessages();

    showAllBtn.addEventListener("click", function () {
        messageContainerEl.setAttribute("open", "true");
    })

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
