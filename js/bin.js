const fs = require('fs');
const { ipcRenderer } = require('electron');
const Alphabet = require('./mdt-alphabet');
const { sign } = require('crypto');

// Const for testing text output (DEBUG)

/* ===============
    CREATE
   =============== */

// Getting elements
var rootEl = document.querySelector("html");
var headerFileName = document.getElementById("header-filename");
var headerFileSize = document.getElementById("header-filesize");

// Const for getting Menu elements
const openFile = document.getElementById("openBINfile");
const closeBtn = document.getElementById("closeBINfile");
const saveBtn = document.getElementById("saveBINfile");
const saveAsBtn = document.getElementById("saveBINas");
const quitApp = document.getElementById("quitApp");
const minimizeBtn = document.getElementById("minimize");
const maximizeBtn = document.getElementById("maximize");
const closeWindowBtn = document.getElementById("closeWindow");

var toggleWhiteTheme = document.querySelector(".white-theme-btn");
var toggleDarkTheme = document.querySelector(".dark-theme-btn");

// Menu actions (open/save/quit)
openFile.addEventListener("click", () => {
    ipcRenderer.send("openBINfile")
    ipcRenderer.send("closeBINfile")
})

saveAsBtn.addEventListener("click", () => {
    ipcRenderer.send("saveAsBINfile")
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
var submeshSize = 0;
var padding = 0;
var binHeaderSize = 112;

// Getting file path
ipcRenderer.on("binFileChannel", (e, filepath) => {

    var fd = fs.openSync(filepath); // Opening the file in memory
    var buffer = fs.readFileSync(fd); // Converting file string to buffer (hex)
    var BINFileName = String(filepath);
    var conv = BINFileName.replace(/^[^.]*\\/gm, '');
    headerFileSize.value = buffer.length + " bytes";
    headerFileName.value = conv;

    let materialStartOffset = buffer.readUint32LE(12);
    let binFirstSubmeshOffset = buffer.readUint32LE(materialStartOffset + 12);
    submeshSize = buffer.readUint8(binFirstSubmeshOffset + binHeaderSize);

    function covertBinToObj() {
        padding = 0;
        let objMaker = "";
        let objComplete = `# Resident evil 4 - BIN Tool 2022` +
            `\n` + `\n` + `# By HardRain` + `\n` + `\n`;
        for (let i = 0; i < 24; i++) {
            let X = buffer.readInt16LE(binFirstSubmeshOffset + binHeaderSize + padding) / 1000;
            let Y = buffer.readInt16LE(binFirstSubmeshOffset + binHeaderSize + 2 + padding) / 1000;
            let Z = buffer.readInt16LE(binFirstSubmeshOffset + binHeaderSize + 4 + padding) / 1000;
            // console.log(' ');

            padding = padding + 24;
            objMaker = "v " + String(X.toFixed(4)) + " " + String(Y.toFixed(4)) + " " + String(Z.toFixed(4)) + `\n`
            objComplete = objComplete + objMaker;
        }
        return objComplete;
    }

    function convertObjToBin() {
        ipcRenderer.on("BINobj", (e, objpath) => {
            var importedObjContent = fs.readFileSync(objpath, { encoding: 'utf8' });
            let sum = 0;
            padding = 0;
            let regexFromX = /(v\s[-]?\d{1,}[.]\d{1,})/g;
            let regexFromHeight = /(?!v\s[-]?\d{1,}[.]\d{1,})(\d\s[-]?\d{1,}[.]\d{4,})/g;
            let regexFromZ = /(?!v\s[-]?\d{1,}[.]\d{1,})(?!\d\s\d{1,}[.]\d{1,})([-]?\d{1,}[.]\d{4,}[\r\n])/g;

            let arrayFromX = importedObjContent.match(regexFromX);
            let arrayFromHeight = importedObjContent.match(regexFromHeight);
            let arrayFromZ = importedObjContent.match(regexFromZ);

            // console.log(arrayFromX[0 + 1].substring(2));
            // console.log(arrayFromHeight[0].substring(2));
            // console.log(arrayFromHeight[1].substring(2));
            console.log(arrayFromHeight);
            console.log(arrayFromZ[1]);
            // console.log(padding);
            for (let i = 0; i < 24; i++) {

                // X values
                buffer.writeInt16LE(arrayFromX[0 + sum].substring(2) * 1000, binFirstSubmeshOffset + binHeaderSize + padding);
                buffer.writeInt16LE(arrayFromHeight[0 + sum].substring(2) * 1000, binFirstSubmeshOffset + binHeaderSize + 2 + padding);
                buffer.writeInt16LE(arrayFromZ[0 + sum] * 1000, binFirstSubmeshOffset + binHeaderSize + 4 + padding);
                console.log(`X: ${i} = ` + arrayFromX[i].substring(2) * 1000 + " | " + `Y: ${i} = ` + arrayFromHeight[i].substring(2) + " | " + `Z: ${i} = ` + arrayFromZ[i]);
                padding = padding + 24;
                sum = sum + 1;
                // console.log(arrayFromZ[2 + sum].substring(1));
                //.substring(0, arrayFromZ[2].length - 2)

            }
        })
    }

    /* =================================
       EXPORT/IMPORT FUNCTIONALITY
      ================================= */

    // Getting elements
    const btnExportEl = document.getElementById("export-bin");
    const btnImportEl = document.getElementById("import-bin");

    // Function for generating faces
    function generateFaces() {
        let faces_complete = `o  BIN Model` + `\n`;
        sum = 0;
        for (i = 1; i < 7; i++) {
            let faces = "f " + (i + sum) + " " + (i + 1 + sum) + " " + (i + 2 + sum) + `\n` +
                "f " + (i + 1 + sum) + " " + (i + 3 + sum) + " " + (i + 2 + sum) + `\n`
            faces_complete = faces_complete + faces;
            sum = sum + 3;
        } return faces_complete;
    }

    // Function for getting coordinate values
    function exportEvents_vertices(quantity) {
        let objMaker = "";
        let objComplete = `# Resident evil 4 - BIN Tool 2022` +
            `\n` + `\n` + `# By HardRain` + `\n` + `\n`;
        let vert_topLeftX = topLeftXEl.value / 1000;
        let vert_topLeftZ = topLeftZEl.value / 1000;
        let vert_topRightX = topRightXEl.value / 1000;
        let vert_topRightZ = topRightZEl.value / 1000;
        let vert_bottomRightX = bottomRightXEl.value / 1000;
        let vert_bottomRightZ = bottomRightZEl.value / 1000;
        let vert_bottomLeftX = bottomLeftXEl.value / 1000;
        let vert_bottomLeftZ = bottomLeftZEl.value / 1000;
        let vert_lowerLimit = lowerLimitEl.value / 1000;
        let vert_higherLimit = higherLimitEl.value / 1000;

        for (i = 0; i != buffer.readUint8(6); i++) {
            if (quantity == 1) { i = (eventNumber.value - 1) }
            vert_topLeftX = buffer.readFloatLE(36 + (160 * i)) / 1000;
            vert_topLeftZ = buffer.readFloatLE(40 + (160 * i)) / 1000;
            vert_topRightX = buffer.readFloatLE(44 + (160 * i)) / 1000;
            vert_topRightZ = buffer.readFloatLE(48 + (160 * i)) / 1000;
            vert_bottomRightX = buffer.readFloatLE(52 + (160 * i)) / 1000;
            vert_bottomRightZ = buffer.readFloatLE(56 + (160 * i)) / 1000;
            vert_bottomLeftX = buffer.readFloatLE(60 + (160 * i)) / 1000;
            vert_bottomLeftZ = buffer.readFloatLE(64 + (160 * i)) / 1000;
            vert_lowerLimit = buffer.readFloatLE(24 + (160 * i)) / 1000;
            vert_higherLimit = buffer.readFloatLE(28 + (160 * i)) / 1000;

            objMaker = "# Vertices" + ` Event ${Number(i + 1)}` +
                `\n` +
                "v " + String(vert_topLeftX.toFixed(5)) + " "
                + String(vert_lowerLimit.toFixed(5)) + " "
                + String(vert_topLeftZ.toFixed(5)) +
                `\n` +
                "v " + String(vert_topRightX.toFixed(5)) + " "
                + String(vert_lowerLimit.toFixed(5)) + " "
                + String(vert_topRightZ.toFixed(5)) +
                `\n` +
                "v " + String(vert_bottomRightX.toFixed(5)) + " "
                + String(vert_lowerLimit.toFixed(5)) + " "
                + String(vert_bottomRightZ.toFixed(5)) +
                `\n` +
                "v " + String(vert_bottomLeftX.toFixed(5)) + " "
                + String(vert_lowerLimit.toFixed(5)) + " "
                + String(vert_bottomLeftZ.toFixed(5)) +
                `\n` + // --------- BELOW HERE STARTS WITH HIGHER LIMIT -------------
                "v " + String(vert_topLeftX.toFixed(5)) + " "
                + String(vert_higherLimit.toFixed(5)) + " "
                + String(vert_topLeftZ.toFixed(5)) +
                `\n` +
                "v " + String(vert_topRightX.toFixed(5)) + " "
                + String(vert_higherLimit.toFixed(5)) + " "
                + String(vert_topRightZ.toFixed(5)) +
                `\n` +
                "v " + String(vert_bottomRightX.toFixed(5)) + " "
                + String(vert_higherLimit.toFixed(5)) + " "
                + String(vert_bottomRightZ.toFixed(5)) +
                `\n` +
                "v " + String(vert_bottomLeftX.toFixed(5)) + " "
                + String(vert_higherLimit.toFixed(5)) + " "
                + String(vert_bottomLeftZ.toFixed(5)) + `\n`
            objComplete = objComplete + objMaker;
            if (quantity == 1) break;
        }
        return objComplete
    }

    function importEvents_vertices(quantity) {
        ipcRenderer.on("AEVobj", (e, objpath) => {
            var importedObjContent = fs.readFileSync(objpath, { encoding: 'utf8' });
            let sum = 0;
            let regexFromX = /(v\s[-]?\d{1,}[.]\d{1,})/g;
            let regexFromHeight = /(?!v\s[-]?\d{1,}[.]\d{1,})(\d\s[-]?\d{1,}[.]\d{5,})/g;
            let regexFromZ = /(?!v\s[-]?\d{1,}[.]\d{1,})(?!\d\s\d{1,}[.]\d{1,})([-]?\d{1,}[.]\d{5,}[\r\n])/g;

            let arrayFromX = importedObjContent.match(regexFromX);
            let arrayFromHeight = importedObjContent.match(regexFromHeight);
            let arrayFromZ = importedObjContent.match(regexFromZ);

            for (let i = 0; i != buffer.readUint8(6); i++) {
                if (quantity == 1) { i = (eventNumber.value - 1) }
                // X values
                buffer.writeFloatLE(Number(arrayFromX[0 + sum].substring(2)) * 1000, 36 + (160 * i));
                buffer.writeFloatLE(Number(arrayFromX[1 + sum].substring(2)) * 1000, 44 + (160 * i));
                buffer.writeFloatLE(Number(arrayFromX[2 + sum].substring(2)) * 1000, 52 + (160 * i));
                buffer.writeFloatLE(Number(arrayFromX[3 + sum].substring(2)) * 1000, 60 + (160 * i));
                // Z values
                buffer.writeFloatLE(Number(arrayFromZ[0 + sum].substring(0, arrayFromZ[0].length - 2)) * 1000, 40 + (160 * i));
                buffer.writeFloatLE(Number(arrayFromZ[1 + sum].substring(0, arrayFromZ[1].length - 2)) * 1000, 48 + (160 * i));
                buffer.writeFloatLE(Number(arrayFromZ[2 + sum].substring(0, arrayFromZ[2].length - 2)) * 1000, 56 + (160 * i));
                buffer.writeFloatLE(Number(arrayFromZ[3 + sum].substring(0, arrayFromZ[3].length - 2)) * 1000, 64 + (160 * i));
                // Lower and Higher Limits
                buffer.writeFloatLE(Number(arrayFromHeight[0 + sum].substring(2)) * 1000, 24 + (160 * i));
                buffer.writeFloatLE(Number(arrayFromHeight[4 + sum].substring(2)) * 1000, 28 + (160 * i));
                // Outputing values to screen
                lowerLimitEl.value = buffer.readFloatLE(24 + (160 * (eventNumber.value - 1))).toFixed(2);
                higherLimitEl.value = buffer.readFloatLE(28 + (160 * (eventNumber.value - 1))).toFixed(2);
                topLeftXEl.value = buffer.readFloatLE(36 + (160 * (eventNumber.value - 1))).toFixed(2);
                topRightXEl.value = buffer.readFloatLE(44 + (160 * (eventNumber.value - 1))).toFixed(2);
                bottomLeftXEl.value = buffer.readFloatLE(52 + (160 * (eventNumber.value - 1))).toFixed(2);
                bottomRightXEl.value = buffer.readFloatLE(60 + (160 * (eventNumber.value - 1))).toFixed(2);
                topLeftZEl.value = buffer.readFloatLE(40 + (160 * (eventNumber.value - 1))).toFixed(2);
                topRightZEl.value = buffer.readFloatLE(48 + (160 * (eventNumber.value - 1))).toFixed(2);
                bottomLeftZEl.value = buffer.readFloatLE(56 + (160 * (eventNumber.value - 1))).toFixed(2);
                bottomRightZEl.value = buffer.readFloatLE(64 + (160 * (eventNumber.value - 1))).toFixed(2);
                if (quantity == 1) { break }
                sum = sum + 8;
            } if (quantity == 1) {
                showTextBox("Event imported successfully!", "imported");
            } else
                showTextBox("All events imported successfully!", "imported");

        })
    }

    // Event listener
    var folderName = headerFileName.value.substring(0, headerFileName.value.length - 4);
    btnExportEl.addEventListener("click", function exportOneEvent() {
        showTextBox("BIN model exported to obj!", "exported");
        fs.mkdirSync(`Bins/${folderName}`, { recursive: true });
        fs.writeFileSync(`Bins/${folderName}/${folderName}.obj`, covertBinToObj() + generateFaces());
    });

    btnImportEl.addEventListener("click", function importOneEvent() {
        ipcRenderer.send("BINimportBtn");
        convertObjToBin();
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
