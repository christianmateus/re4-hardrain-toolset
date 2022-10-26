const fs = require('fs');
const { ipcRenderer } = require('electron');
const { toNamespacedPath } = require('path');

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
const importNewModelBtn = document.getElementById("add-new-model");

// Getting textures elements
const exportOneTextureBtn = document.getElementById("export-texture");
const importOneTextureBtn = document.getElementById("import-texture");
const exportAllTexturesBtn = document.getElementById("exportall-texture");
const importAllTexturesBtn = document.getElementById("importall-texture");
const importNewTextureBtn = document.getElementById("add-new-texture");

// Getting textures elements
const texturesTotal = document.getElementById("textures-total");
const textureNumber = document.getElementById("texture-number");
const textureWidth = document.getElementById("texture-width");
const textureHeight = document.getElementById("texture-height");
const textureMode = document.getElementById("texture-mode");
const textureInterlace = document.getElementById("texture-interlace");
const textureUnk1 = document.getElementById("texture-unk1");
const textureUnk2 = document.getElementById("texture-unk2");
const textureUnk3 = document.getElementById("texture-unk3");
const prevTextureBtn = document.getElementById("prevTextureBtn");
const nextTextureBtn = document.getElementById("nextTextureBtn");

// Const for getting Menu elements
const openFile = document.getElementById("openSMDfile");
const closeBtn = document.getElementById("closeSMDfile");
const saveBtn = document.getElementById("saveSMDfile");
const saveAsBtn = document.getElementById("saveSMDas");
const quitApp = document.getElementById("quitApp");
const minimizeBtn = document.getElementById("minimize");
const maximizeBtn = document.getElementById("maximize");
const closeWindowBtn = document.getElementById("closeWindow");

const importImage = document.getElementById("import");
const imageContainer = document.getElementById("texture-image");

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
var chunk_texture = 0;
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
    var buffer_padding = buffer.subarray(pointerTexturesArea, pointerTexturesArea + 16);
    var buffer_textures = buffer.subarray(pointerTexturesArea + 16);

    // Reading SMD textures header
    texturesTotal.value = buffer_textures.readUint8(4);

    // importImage.addEventListener("click", () => {

    //     console.log("Falta fazer renderização de textura");
    // })

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
        var removedMessage = document.querySelector(".infoBox");
        removedMessage.style.display = "block"
        removedMessage.style.backgroundColor = status;
        if (status == "exported") {
            document.getElementById("infoBox").firstElementChild.style.backgroundColor = "#333"
            document.getElementById("infoBox").firstElementChild.style.border = "2px solid #ddd"
            document.getElementById("infoBox").firstElementChild.style.width = "35%"
            document.getElementById("infoBox").firstElementChild.innerHTML = '<i class="fa-solid fa-file-export"></i>&nbsp&nbsp' + message;
        }
        if (status == "added") {
            document.getElementById("infoBox").firstElementChild.style.backgroundColor = "#353"
            document.getElementById("infoBox").firstElementChild.style.border = "2px solid #7f7"
            document.getElementById("infoBox").firstElementChild.style.color = "2px solid #7f7"
            document.getElementById("infoBox").firstElementChild.style.color = "2px solid #7f7"
            document.getElementById("infoBox").firstElementChild.style.width = "35%"
            document.getElementById("infoBox").firstElementChild.innerHTML = '<i class="fa-solid fa-file-import"></i>&nbsp&nbsp' + message;
        }
        setTimeout(() => {
            removedMessage.style.display = "none"
        }, 3000);
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
    function readBinModel(modelChunk) {
        if (modelChunk != pointersModel.length && pointersModel[modelChunk] != 0) {
            return buffer_models.subarray(pointersModel[modelChunk - 1], pointersModel[modelChunk]);
        } else {
            return buffer_models.subarray(pointersModel[modelChunk - 1]);
        }
    }
    function readTexture(textureChunk) {
        chunk_texture = chunk_texture + textureChunk;
        textureWidth.value = buffer_textures.readUint16LE(16 + chunk_texture);
        textureHeight.value = buffer_textures.readUint16LE(28 + chunk_texture);
        textureMode.value = buffer_textures.readUint8(20 + chunk_texture);
        textureInterlace.value = buffer_textures.readUint8(22 + chunk_texture);
        let unkResolution = buffer_textures.readUint16LE(24 + chunk_texture);
        let mipmapCount = buffer_textures.readUint8(26 + chunk_texture);
        let multipliedResolution = buffer_textures.readUint8(28 + chunk_texture);
        let mipmap_1 = buffer_textures.readUint32LE(32 + chunk_texture);
        let mipmap_2 = buffer_textures.readUint32LE(36 + chunk_texture);
        let indicesOffset = buffer_textures.readUint32LE(48 + chunk_texture);
        let palleteOffset = buffer_textures.readUint32LE(52 + chunk_texture);
        textureUnk1.value = buffer_textures.readUint8(58 + chunk_texture);
        textureUnk2.value = buffer_textures.readUint8(59 + chunk_texture);
        textureUnk3.value = buffer_textures.readUint8(60 + chunk_texture);

    }
    function exportTexture(chunk, allTextures) {
        // Creates a Header for TPL count
        let mainHeader = Buffer.alloc(16, "00100000010000001000000000000000", "hex");
        let header;
        let indices;
        let pallete;
        let bufferComplete;
        // Chunk is used for extracting one texture, allTextures is used for batch extraction
        if (chunk != texturesTotal.value) {
            header = buffer_textures.subarray((16 + allTextures + (48 * (chunk - 1))), (16 + allTextures + (48 * (chunk - 1))) + 48);
            console.log(header);
            indices = buffer_textures.subarray(header.readUint32LE(32), header.readUint32LE(36));
            if (textureMode.value == 8) {
                pallete = buffer_textures.subarray(buffer_textures.readUint32LE(52), buffer_textures.readUint32LE(52) + 128);
            } else if (textureMode.value == 9) {
                pallete = buffer_textures.subarray(buffer_textures.readUint32LE(52), buffer_textures.readUint32LE(52) + 394);
            }

            bufferComplete = Buffer.concat([mainHeader, header, indices, pallete]);
            return bufferComplete;
        } else {
            console.log("Deu zero");
            return;
        }
    }

    readEntry(0);
    readModelOffsets();
    readTexture(0);

    function importNewModel() {
        ipcRenderer.send("BINtoSMDBtn");
    }
    ipcRenderer.on("BINmodel", function (e, filepath) {
        let addNewBinBuffer = Buffer.alloc(0);
        let binFD = fs.openSync(filepath)
        addNewBinBuffer = fs.readFileSync(binFD);

        // Check if there's any zeroed pointers, then updates it with new bin starting offset
        let bytesRows = buffer_models.readUint32LE(0) / 4; // Gets first value, divides it by 4 to get total lines
        iterator = 0;
        for (let i = 0; i <= bytesRows; i++) {

            // If it doesn't encounter any empty pointer, this creates 4 new empty pointers and restarts the loop
            if (i == bytesRows) {
                let createFourEmptyPointers = Buffer.alloc(16, 0);
                let topPart = buffer_models.subarray(0, bytesRows * 4);
                let downPart = buffer_models.subarray(bytesRows * 4);
                buffer_models = Buffer.concat([topPart, createFourEmptyPointers, downPart]);

                // Updating every pointer by +16
                iterator = 0;
                for (let j = 0; j < bytesRows; j++) {
                    buffer_models.writeUint32LE(buffer_models.readUint32LE(0 + iterator) + 16, 0 + iterator);
                    iterator += 4;
                }
                i = 0; // Restarts the loop 
                iterator = 0;
                bytesRows += 16; // Increases loop length
                buffer_entries.writeUint32LE(buffer_entries.readUint32LE(8) + 16, 8);
            }
            // Searches for the first empty pointer and adds the new value to it
            if (i < bytesRows && buffer_models.readUint32LE(0 + iterator) == 0) {
                buffer_models.writeUint32LE(buffer_models.length, iterator);
                buffer_entries.writeUint32LE(buffer_entries.readUint32LE(8) + addNewBinBuffer.length, 8);
                break;
            }
            iterator += 4;
        }
        buffer_models = Buffer.concat([buffer_models, addNewBinBuffer]);
        showTextBox("New object added sucessfully!", "added")
        fs.closeSync(binFD);
    });

    function importNewTexture() {
        ipcRenderer.send("addNewTPLBtn");
    }
    ipcRenderer.on("addTPLtexture", function (e, filepath) {
        let addNewTextureBuffer = Buffer.alloc(0);
        let iterator = 0;
        let mipMapCount = 0;
        let textureFD = fs.openSync(filepath);
        addNewTextureBuffer = fs.readFileSync(textureFD);

        let fileHeader = addNewTextureBuffer.subarray(0, 16);
        let textureHeader = addNewTextureBuffer.subarray(16, 64);
        let indices = addNewTextureBuffer.subarray(64, addNewTextureBuffer.readUint32LE(52));
        let pallete = addNewTextureBuffer.subarray(addNewTextureBuffer.readUint32LE(52));

        let complete_mainHeader = buffer_textures.subarray(0, 16);
        let complete_textureHeader = buffer_textures.subarray(16, (48 * complete_mainHeader.readUint8(4)) + 16);
        let complete_mipMapHeader = buffer_textures.subarray((48 * complete_mainHeader.readUint8(4)) + 16, buffer_textures.readUint32LE(48))
        let complete_indicesAndPallete = buffer_textures.subarray(buffer_textures.readUint32LE(48));

        // Updates new texture header pointers before inserting
        textureHeader.writeUint32LE(buffer_textures.length + 48, 32);

        // Removing MipMaps
        textureHeader.writeUint8(0, 10);

        // Check bit depth
        if (textureHeader.readUint8(4) == 8) {
            console.log("4-bit texture");
            textureHeader.writeUint32LE((buffer_textures.length + indices.length + 48), 36);
        } else {
            console.log("8-bit texture");
            textureHeader.writeUint32LE((buffer_textures.length + indices.length + 48), 36);
        }

        // Add new texture header to the end of headers area and updates every pointer by +48
        complete_indicesAndPallete = Buffer.concat([complete_indicesAndPallete, indices, pallete]);

        // Updates every pointer by +48
        for (let i = 0; i != complete_mainHeader.readUint8(4); i++) {
            complete_textureHeader.writeUint32LE(complete_textureHeader.readUint32LE(32 + iterator) + 48, 32 + iterator)
            complete_textureHeader.writeUint32LE(complete_textureHeader.readUint32LE(36 + iterator) + 48, 36 + iterator)
            if (complete_textureHeader.readUint32LE(16 + iterator) > 0) {
                complete_textureHeader.writeUint32LE(complete_textureHeader.readUint32LE(16 + iterator) + 48, 16 + iterator)
                complete_textureHeader.writeUint32LE(complete_textureHeader.readUint32LE(20 + iterator) + 48, 20 + iterator)
            }
            iterator += 48;
        }

        // Gets mipmap quantity
        mipMapCount = complete_mipMapHeader.length / 48;
        iterator = 0;
        for (let j = 0; j != (complete_mipMapHeader.length / 48); j++) {
            complete_mipMapHeader.writeUint32LE(complete_mipMapHeader.readUint32LE(32 + iterator) + 48, 32 + iterator);
            iterator += 48;
        }

        // Updates main header count by +1
        complete_mainHeader.writeUint8(complete_mainHeader.readUint8(4) + 1, 4);
        complete_textureHeader = Buffer.concat([complete_textureHeader, textureHeader, complete_mipMapHeader]);

        buffer_textures = Buffer.concat([complete_mainHeader, complete_textureHeader, complete_indicesAndPallete]);
        fs.closeSync(textureFD);
    })

    // Models
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

    var folderName = headerFileName.value.substring(0, headerFileName.value.length - 4);
    exportOneModelBtn.addEventListener("click", function () {
        fs.mkdirSync(`SMD/${folderName}/Models`, { recursive: true });
        fs.writeFileSync(`SMD/${folderName}/Models/${entryNumber.value}.bin`, readBinModel(entryNumber.value));
    })
    exportAllModelsBtn.addEventListener("click", function () {
        fs.mkdirSync(`SMD/${folderName}/Models`, { recursive: true });
        for (let i = 0; i < entryTotal.value; i++) {
            fs.writeFileSync(`SMD/${folderName}/Models/${i}.bin`, readBinModel(i + 1));
        }
    })
    importNewModelBtn.addEventListener("click", function () {
        importNewModel()
    })

    // Textures
    nextTextureBtn.addEventListener("click", function () {
        if (textureNumber.value != texturesTotal) {
            textureNumber.value = Number(textureNumber.value) + 1;
            readTexture(48);
        } else {
            return;
        }
    })
    prevTextureBtn.addEventListener("click", function () {
        if (textureNumber.value > 1) {
            textureNumber.value = Number(textureNumber.value) - 1;
            readTexture(-48);
        } else {
            return;
        }
    })
    exportOneTextureBtn.addEventListener("click", function () {
        // console.log(exportTexture(textureNumber.value));
        fs.mkdirSync(`SMD/${folderName}/Textures`, { recursive: true });
        fs.writeFileSync(`SMD/${folderName}/Textures/${textureNumber.value}.tpl`, exportTexture(textureNumber.value, 0));
    })
    exportAllTexturesBtn.addEventListener("click", function () {
        fs.mkdirSync(`SMD/${folderName}/Textures`, { recursive: true });
        let textureHeaderChunk = 0;
        for (let i = 0; i < texturesTotal.value; i++) {
            fs.writeFileSync(`SMD/${folderName}/Textures/${i}.tpl`, exportTexture(1, textureHeaderChunk));
            textureHeaderChunk += 48;
        }
    })
    importNewTextureBtn.addEventListener("click", function () {
        importNewTexture()
    })
    /* ===============
        UPDATE
       =============== */



    /* ==========================================
        NEW FUNCIONALITY: 
       ========================================== */

    // Save all modified buffer back to file
    saveBtn.addEventListener("click", () => {
        let COMPLETE_BUFFER = Buffer.concat([buffer_entries, buffer_models, buffer_padding, buffer_textures])
        fs.writeFileSync(filepath, COMPLETE_BUFFER);
        var saveMessage = document.querySelector(".hide");
        saveMessage.style.display = "block"
        setTimeout(() => {
            saveMessage.style.display = "none"
        }, 2000);
    })

    closeBtn.addEventListener("click", () => {
        ipcRenderer.send("closeSMDfile");
        fs.closeSync(fd);
    })

    ipcRenderer.on("saveAsSMDfileContent", (e, arg) => {
        fs.writeFileSync(arg, buffer);
    })
})
