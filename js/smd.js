const fs = require('fs');
const { ipcRenderer } = require('electron');
const { toNamespacedPath } = require('path');

// Const for testing text output (DEBUG)

/* ===============
    CREATE
   =============== */

// Getting elements
var rootEl = document.querySelector("html");
var addEntryEl = document.getElementById("addEntry");
var removeEntryEl = document.getElementById("removeEntry");
var copyBtnEl = document.getElementById("copyBtn");
var pasteBtnEl = document.getElementById("pasteBtn");
var undoBtnEl = document.getElementById("undoBtn");
var redoBtnEl = document.getElementById("redoBtn");
var includeMipmapCheckboxEl = document.getElementById("include-mipmap");
var containerInputsEl = document.getElementById("main");
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
const modelTotalEl = document.getElementById("models-total");

// Getting fieldset bin models elements
const fieldsetBinModelsEl = document.getElementById("fieldset-bin-textures");

// Getting models elements
const exportOneModelBtn = document.getElementById("export-model");
const exportAllModelsBtn = document.getElementById("exportall-model");
const importNewModelBtn = document.getElementById("add-new-model");

// Getting textures elements
const exportOneTextureBtn = document.getElementById("export-texture");
const exportAllTexturesBtn = document.getElementById("exportall-texture");
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
var pointerModelsArea = 0;
var pointerTexturesArea = 0;
var pointersModel = [];
var modelsTotal = 0;
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
    function createFieldsetInputElement(index, inputValue) {
        let label = document.createElement("label");
        let br = document.createElement("br");
        let input = document.createElement("input");

        label.setAttribute("for", `texture-${index}`);
        label.innerHTML = `Texture ${index} `;
        input.id = `texture-${index}`;
        input.classList.add("texture-number");
        input.setAttribute("type", "number");
        input.value = inputValue;

        fieldsetBinModelsEl.appendChild(label);
        fieldsetBinModelsEl.appendChild(input);
        fieldsetBinModelsEl.appendChild(br);
    }
    function removeFieldsetElements() {
        if (fieldsetBinModelsEl.childElementCount > 1) {
            fieldsetBinModelsEl.innerHTML = "";
            let legend = document.createElement("legend");
            legend.innerText = "Textures used";
            fieldsetBinModelsEl.appendChild(legend);
        }
    }
    function addNewEntry() {
        // Creates new empty entry 
        let new_entry = Buffer.alloc(64);
        new_entry.writeFloatLE(1, 12);
        new_entry.writeFloatLE(1, 28);
        new_entry.writeFloatLE(1, 44);
        new_entry.writeUint8(255, 50);
        new_entry.writeUint8(254, 51);
        new_entry.writeUint8(8, 56);
        // Update entries count
        buffer_entries.writeUint16LE(buffer_entries.readUint16LE(2) + 1, 2);
        buffer_entries.writeUint32LE(buffer_entries.readUint32LE(4) + 64, 4);
        buffer_entries.writeUint32LE(buffer_entries.readUint32LE(8) + 64, 8);
        entryTotal.value = buffer_entries.readUint16LE(2);
        buffer_entries = Buffer.concat([buffer_entries, new_entry]);

        showTextBox("New entry added successfully!", "green");
    }
    function removeEntry() {
        let topPart = buffer_entries.subarray(0, (64 * (entryNumber.value - 1)) + 16);
        let downPart = buffer_entries.subarray((64 * (entryNumber.value - 1)) + 16 + 64);

        // Updating entry count and pointers
        buffer_entries.writeUint16LE(buffer_entries.readUint16LE(2) - 1, 2);
        buffer_entries.writeUint32LE(buffer_entries.readUint32LE(4) - 64, 4);
        buffer_entries.writeUint32LE(buffer_entries.readUint32LE(8) - 64, 8);
        entryTotal.value = buffer_entries.readUint16LE(2);

        buffer_entries = Buffer.concat([topPart, downPart]);

        showTextBox("Entry removed successfully!", "red");
    }
    function showTextBox(message, boxColor) {
        var removedMessage = document.querySelector(".infoBox");
        removedMessage.style.display = "block"
        removedMessage.style.backgroundColor = boxColor;
        if (boxColor == "gray") {
            document.getElementById("infoBox").firstElementChild.style.backgroundColor = "#333"
            document.getElementById("infoBox").firstElementChild.style.border = "2px solid #ddd"
            document.getElementById("infoBox").firstElementChild.style.width = "35%"
            document.getElementById("infoBox").firstElementChild.innerHTML = '<i class="fa-solid fa-file-export"></i>&nbsp&nbsp' + message;
        }
        if (boxColor == "green") {
            document.getElementById("infoBox").firstElementChild.style.backgroundColor = "#353"
            document.getElementById("infoBox").firstElementChild.style.border = "2px solid #7f7"
            document.getElementById("infoBox").firstElementChild.style.color = "2px solid #7f7"
            document.getElementById("infoBox").firstElementChild.style.width = "35%"
            document.getElementById("infoBox").firstElementChild.innerHTML = '<i class="fa-solid fa-file-import"></i>&nbsp&nbsp' + message;
        }
        if (boxColor == "red") {
            document.getElementById("infoBox").firstElementChild.style.backgroundColor = "#533"
            document.getElementById("infoBox").firstElementChild.style.border = "2px solid #f77"
            document.getElementById("infoBox").firstElementChild.style.color = "2px solid #eee"
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
        for (let j = 0; j != pointersModel.length; j++) {
            if (pointersModel[j] > 0) {
                modelsTotal++;
                modelTotalEl.innerHTML = `Total models: ${modelsTotal}`;
            }
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
        textureHeight.value = buffer_textures.readUint16LE(18 + chunk_texture);
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
            indices = buffer_textures.subarray(header.readUint32LE(32), header.readUint32LE(36));

            // Check if user does not want mipmap header bytes
            if (!includeMipmapCheckboxEl.checked) {
                header.writeUint8(0, 10);
                header.writeUint32LE(0, 16);
                header.writeUint32LE(0, 20);
                header.writeUint32LE(0, 24);
                header.writeUint32LE(0, 28);
            }

            // Check bit-depth and gets pallete bytes
            if (textureMode.value == 8) {
                pallete = buffer_textures.subarray(buffer_textures.readUint32LE(52), buffer_textures.readUint32LE(52) + 128);
            } else if (textureMode.value == 9) {
                pallete = buffer_textures.subarray(buffer_textures.readUint32LE(52), buffer_textures.readUint32LE(52) + 394);
            }

            bufferComplete = Buffer.concat([mainHeader, header, indices, pallete]);
            bufferComplete.writeUint32LE(64, 48); // Writes 40 00 00 00 to the texture pointer

            // Update pallete pointers
            if (bufferComplete.readUint8(20) == 8) {
                bufferComplete.writeUint32LE((bufferComplete.length) - 128, 52)
            } else if (bufferComplete.readUint8(20) == 9) {
                bufferComplete.writeUint32LE((bufferComplete.length) - 394, 52)
            }

            showTextBox("All textures exported successfully!", "green");
            return bufferComplete;
        } else {
            console.log("Deu zero");
            return;
        }
    }
    function exportSingleTexture(Singlechunk) {
        // Creates a Header for TPL count
        let mainHeader = Buffer.alloc(16, "00100000010000001000000000000000", "hex");
        let header;
        let indices;
        let pallete;
        let bufferComplete;
        // Chunk is used for extracting one texture,  is used for batch extraction

        if (Singlechunk != texturesTotal.value) {
            header = buffer_textures.subarray((16 + (48 * (Singlechunk - 1))), (16 + (48 * (Singlechunk - 1))) + 48);
            indices = buffer_textures.subarray(header.readUint32LE(32), header.readUint32LE(36));

            // Check if user does not want mipmap header bytes
            if (!includeMipmapCheckboxEl.checked) {
                header.writeUint8(0, 10);
                header.writeUint32LE(0, 16);
                header.writeUint32LE(0, 20);
                header.writeUint32LE(0, 24);
                header.writeUint32LE(0, 28);
            }

            // Check bit-depth and gets pallete bytes
            if (textureMode.value == 8) {
                pallete = buffer_textures.subarray(buffer_textures.readUint32LE(52), buffer_textures.readUint32LE(52) + 128);
            } else if (textureMode.value == 9) {
                pallete = buffer_textures.subarray(buffer_textures.readUint32LE(52), buffer_textures.readUint32LE(52) + 394);
            }

            bufferComplete = Buffer.concat([mainHeader, header, indices, pallete]);
            bufferComplete.writeUint32LE(64, 48); // Writes 40 00 00 00 to the texture pointer

            // Update pallete pointers
            if (bufferComplete.readUint8(20) == 8) {
                bufferComplete.writeUint32LE((bufferComplete.length) - 128, 52)
            } else if (bufferComplete.readUint8(20) == 9) {
                bufferComplete.writeUint32LE((bufferComplete.length) - 394, 52)
            }

            showTextBox("Texture exported successfully!", "green");
            Singlechunk = 0;
            return bufferComplete;
        } else {
            console.log("Deu zero");
            return;
        }
    }
    function checkBinTexturesCount() {
        let modelPointer = buffer_models.readUint32LE(4 * modelNumber.value);
        let texturePointer = buffer_models.readUint32LE(modelPointer + 12);
        let textureCount = buffer_models.readUint8(modelPointer + 10);
        let binTextureIterator = 0;
        removeFieldsetElements();

        for (let i = 0; i != textureCount; i++) {
            let textureNumber = buffer_models.readUint8(modelPointer + texturePointer + 1 + binTextureIterator)
            createFieldsetInputElement(i + 1, textureNumber);

            binTextureIterator += 16;
        }
    }

    readEntry(0);
    readModelOffsets();
    readTexture(0);
    checkBinTexturesCount();

    // Models
    var folderName = headerFileName.value.substring(0, headerFileName.value.length - 4);
    nextBtn.addEventListener("click", function () {
        if (entryNumber.value != buffer_entries.readUint16LE(2)) {
            entryNumber.value = Number(entryNumber.value) + 1;
            readEntry(64);
            checkBinTexturesCount();
        } else {
            return;
        }
    })
    prevBtn.addEventListener("click", function () {
        if (entryNumber.value > 1) {
            entryNumber.value = Number(entryNumber.value) - 1;
            readEntry(-64);
            checkBinTexturesCount();

        } else {
            return;
        }
    })
    exportOneModelBtn.addEventListener("click", function () {
        fs.mkdirSync(`SMD/${folderName}/Models`, { recursive: true });
        fs.writeFileSync(`SMD/${folderName}/Models/${modelNumber.value}.bin`, readBinModel(Number(modelNumber.value) + 1));
        showTextBox("Model exported successfully!", "green");
    })
    exportAllModelsBtn.addEventListener("click", function () {
        fs.mkdirSync(`SMD/${folderName}/Models`, { recursive: true });
        for (let i = 0; i < entryTotal.value; i++) {
            fs.writeFileSync(`SMD/${folderName}/Models/${i}.bin`, readBinModel(i + 1));
        }
        showTextBox("All models exported successfully!", "green");
    })
    importNewModelBtn.addEventListener("click", function () {
        importNewModel()
    })
    // ===============================================================
    // Textures
    nextTextureBtn.addEventListener("click", function () {
        if (textureNumber.value != texturesTotal.value) {
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
        fs.mkdirSync(`SMD/${folderName}/Textures`, { recursive: true });
        fs.writeFileSync(`SMD/${folderName}/Textures/${textureNumber.value - 1}.tpl`, exportSingleTexture(textureNumber.value));
    })
    exportAllTexturesBtn.addEventListener("click", function () {
        fs.mkdirSync(`SMD/${folderName}/Textures`, { recursive: true });
        let textureHeaderChunk = 0;
        let tempChunk = 0;

        for (let i = 0; i < texturesTotal.value; i++) {
            fs.writeFileSync(`SMD/${folderName}/Textures/${i}.tpl`, exportTexture(i + 1, textureHeaderChunk));
            textureHeaderChunk += 48;
        }
        textureHeaderChunk = 0;
    })
    importNewTextureBtn.addEventListener("click", function () {
        importNewTexture()
    })

    /* ===============
        UPDATE
       =============== */

    // ADD NEW MODEL
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
        modelsTotal++;
        modelTotalEl.innerHTML = `Total models: ${modelsTotal}`;
        showTextBox("New object added sucessfully!", "green");
        fs.closeSync(binFD);
    });

    // ADD NEW TEXTURE
    function importNewTexture() {
        ipcRenderer.send("addNewTPLBtn");
    };
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
        texturesTotal.value = Number(texturesTotal.value) + 1;
        showTextBox("New texture added sucessfully!", "green");
        fs.closeSync(textureFD);
    });

    // ADD NEW ENTRY
    addEntryEl.addEventListener("click", () => {
        addNewEntry();
    });
    removeEntryEl.addEventListener("click", () => {
        removeEntry();
        readEntry(0);
        checkBinTexturesCount();
    });

    containerInputsEl.addEventListener("change", function ({ target }) {
        // Entry inputs
        if (target.id == "pos-x") {
            buffer_entries.writeFloatLE(positionX.value, (64 * (entryNumber.value - 1)) + 16);
        }
        if (target.id == "pos-y") {
            buffer_entries.writeFloatLE(positionY.value, 4 + (64 * (entryNumber.value - 1)) + 16);
        }
        if (target.id == "pos-z") {
            buffer_entries.writeFloatLE(positionZ.value, 8 + (64 * (entryNumber.value - 1)) + 16);
        }
        if (target.id == "rot-x") {
            buffer_entries.writeFloatLE(rotationX.value, 16 + (64 * (entryNumber.value - 1)) + 16);
        }
        if (target.id == "rot-y") {
            buffer_entries.writeFloatLE(rotationY.value, 20 + (64 * (entryNumber.value - 1)) + 16);
        }
        if (target.id == "rot-z") {
            buffer_entries.writeFloatLE(rotationZ.value, 24 + (64 * (entryNumber.value - 1)) + 16);
        }
        if (target.id == "scale-x") {
            buffer_entries.writeFloatLE(scaleX.value, 32 + (64 * (entryNumber.value - 1)) + 16);
        }
        if (target.id == "scale-y") {
            buffer_entries.writeFloatLE(scaleY.value, 36 + (64 * (entryNumber.value - 1)) + 16);
        }
        if (target.id == "scale-z") {
            buffer_entries.writeFloatLE(scaleZ.value, 40 + (64 * (entryNumber.value - 1)) + 16);
        }
        if (target.id == "entry-number") {
            if (entryNumber.value > 0 && entryNumber.value <= entryTotal.value) {
                chunk = 0;
                readEntry(64 * (entryNumber.value - 1));
                checkBinTexturesCount();
            } else {
                entryNumber.value = 1;
                chunk = 0;
                readEntry(64 * (entryNumber.value - 1));
            }
        }

        // Entry special bytes
        if (target.id == "model-number") {
            buffer_entries.writeUint8(modelNumber.value, 48 + (64 * (entryNumber.value - 1)) + 16);
            checkBinTexturesCount();
        }
        if (target.id == "smx-number") {
            if (SMXNumber.value >= 0 && SMXNumber.value < 256) {
                buffer_entries.writeUint8(SMXNumber.value, 51 + (64 * (entryNumber.value - 1)) + 16);
            } else {
                SMXNumber.value = 255;
            }
        }
        if (target.id == "type-number") {
            if (typeNumber.value >= 0 && typeNumber.value < 256) {
                buffer_entries.writeUint8(typeNumber.value, 56 + (64 * (entryNumber.value - 1)) + 16);
            } else {
                typeNumber.value = 255;
            }
        }

        // Texture container
        if (target.id == "texture-width") {
            buffer_textures.writeUint16LE(textureWidth.value, (48 * (textureNumber.value - 1)) + 16);
        }
        if (target.id == "texture-height") {
            buffer_textures.writeUint16LE(textureHeight.value, 2 + (48 * (textureNumber.value - 1)) + 16);
        }
        if (target.id == "texture-mode") {
            if (textureMode.value >= 0 && textureMode.value < 256) {
                buffer_textures.writeUint8(textureMode.value, 4 + (48 * (textureNumber.value - 1)) + 16);
            } else {
                textureMode.value = 255;
            }
        }
        if (target.id == "texture-interlace") {
            if (textureInterlace.value >= 0 && textureInterlace.value < 256) {
                buffer_textures.writeUint8(textureInterlace.value, 6 + (48 * (textureNumber.value - 1)) + 16);
            } else {
                textureInterlace.value = 255;
            }
        }
        if (target.id == "texture-unk1") {
            if (textureUnk1.value >= 0 && textureUnk1.value < 256) {
                buffer_textures.writeUint8(textureUnk1.value, 42 + (48 * (textureNumber.value - 1)) + 16);
            } else {
                textureUnk1.value = 255;
            }
        }
        if (target.id == "texture-unk2") {
            if (textureUnk2.value >= 0 && textureUnk2.value < 256) {
                buffer_textures.writeUint8(textureUnk2.value, 43 + (48 * (textureNumber.value - 1)) + 16);
            } else {
                textureUnk2.value = 255;
            }
        }
        if (target.id == "texture-unk3") {
            if (textureUnk3.value >= 0 && textureUnk3.value < 256) {
                buffer_textures.writeUint8(textureUnk3.value, 44 + (48 * (textureNumber.value - 1)) + 16);
            } else {
                textureUnk3.value = 255;
            }
        }
        if (target.id == "texture-number") {
            if (textureNumber.value > 0 && textureNumber.value <= texturesTotal.value) {
                chunk_texture = 0;
                readTexture(48 * (textureNumber.value - 1));
            } else {
                chunk_texture = 0;
                readTexture(48 * (textureNumber.value - 1));
                textureNumber.value = 1;
            }
        }
        // Bin model textures
        let modelPointer = buffer_models.readUint32LE(4 * modelNumber.value);
        for (let l = 1; l != buffer_models.readUint8(modelPointer + 10) + 1; l++) {

            // Check which texture input was modified
            if (target.id == `texture-${l}`) {
                let texturePointer = buffer_models.readUint32LE(modelPointer + 12);
                buffer_models.writeUint8(target.value, modelPointer + texturePointer + 1 + ((l - 1) * 16))
                break;
            }
        }

    })

    /* ==========================================
        NEW FUNCIONALITY: 
       ========================================== */

    // let image = fs.readFileSync("output.tpl");
    let image = fs.readFileSync("t30.tpl");
    let canvas = document.getElementById("canva");
    canvas.width = image.readUint16LE(16);
    canvas.height = image.readUint16LE(18);
    let ctx = canvas.getContext('2d');

    let imageData = ctx.createImageData(image.readUint16LE(16), image.readUint16LE(18))
    let pointerPallete = image.readUint32LE(52);
    let incremental = 0;
    let padding = 0;
    let indicesStart = 64;
    console.log(imageData.data.length);

    // Iterate through every pixel
    // for (let i = 0; i < imageData.data.length; i += 4) {
    //     // Modify pixel data 
    //     imageData.data[i + 0] = image.readUint8(pointerPallete + (4 * image.readUint8(indicesStart))) // R value
    //     imageData.data[i + 1] = image.readUint8(pointerPallete + (4 * image.readUint8(indicesStart) + 1)) // G value
    //     imageData.data[i + 2] = image.readUint8(pointerPallete + (4 * image.readUint8(indicesStart) + 2)) // B value
    //     imageData.data[i + 3] = 255 // image.readUint8(pointerPallete + (4 * image.readUint8(64 + incremental)) + 3) + 127
    //     indicesStart++;
    // }

    // Loop for 4-bit images
    for (let i = 0; i < imageData.data.length; i += 4) {
        let higherbyte = image.readUint8(indicesStart) & 0x0F;
        let lowerbyte = image.readUint8(indicesStart) >> 4;

        if (higherbyte > 8) {
            padding = 32;
        } else {
            padding = 0
        }
        // console.log(higherbyte);
        console.log("Higher byte: " + higherbyte);
        imageData.data[i + 0] = image.readUint8(pointerPallete + padding + (4 * higherbyte)) // R value
        imageData.data[i + 1] = image.readUint8(pointerPallete + padding + (4 * higherbyte + 1)) // G value
        imageData.data[i + 2] = image.readUint8(pointerPallete + padding + (4 * higherbyte + 2)) // B value
        imageData.data[i + 3] = 255 // image.readUint8(pointerPallete + padding + (4 * image.readUint8(64 + incremental)) + 3) + 127
        // console.log(image.readUint8(pointerPallete + padding + (4 * image.readUint8(higherbyte))));

        if (lowerbyte > 8) {
            padding = 32;
        } else {
            padding = 0
        }

        imageData.data[i + 0] = image.readUint8(pointerPallete + padding + (4 * lowerbyte)) // R value
        imageData.data[i + 1] = image.readUint8(pointerPallete + padding + (4 * lowerbyte + 1)) // G value
        imageData.data[i + 2] = image.readUint8(pointerPallete + padding + (4 * lowerbyte + 2)) // B value
        imageData.data[i + 3] = 255 // image.readUint8(pointerPallete + (4 * image.readUint8(64 + incremental)) + 3) + 127
        // higherbyte++;
        // lowerbyte++;
        indicesStart++;
    }
    ctx.putImageData(imageData, 0, 0);

    // Save all modified buffer back to file
    saveBtn.addEventListener("click", () => {
        let COMPLETE_BUFFER = Buffer.concat([buffer_entries, buffer_models, buffer_padding, buffer_textures])
        headerFileSize.value = COMPLETE_BUFFER.length + " bytes";
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
        let COMPLETE_BUFFER = Buffer.concat([buffer_entries, buffer_models, buffer_padding, buffer_textures]);
        fs.writeFileSync(arg, COMPLETE_BUFFER);
    })
})
