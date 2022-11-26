const fs = require('fs');
const { ipcRenderer } = require('electron');
const path = require('path');
const textBox = require('../shared/textBox').module;

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
var containerInputsEl = document.getElementById("main");
var headerFileName = document.getElementById("header-filename");
var headerFileSize = document.getElementById("header-filesize");
var countEl = document.getElementById("count");

// Getting entries elements
const tbody = document.getElementsByTagName("tbody")[0];
const entrySizeCell = document.getElementsByClassName("entrySize");
const entryRawNameCell = document.getElementsByClassName("entryRawName");
const entryTypeCell = document.getElementsByClassName("entryType");

// Getting entries buttons
const importBtn = document.getElementsByClassName("importBtn");
const exportBtn = document.getElementsByClassName("exportBtn");
const downloadBtn = document.getElementsByClassName("downloadBtn");
const removeBtn = document.getElementsByClassName("removeBtn");

// Const for getting Menu elements
const openFile = document.getElementById("openETMfile");
const closeBtn = document.getElementById("closeETMfile");
const saveBtn = document.getElementById("saveETMfile");
const saveAsBtn = document.getElementById("saveETMas");
const quitApp = document.getElementById("quitApp");
const minimizeBtn = document.getElementById("minimize");
const maximizeBtn = document.getElementById("maximize");
const closeWindowBtn = document.getElementById("closeWindow");

const importImage = document.getElementById("import");
const imageContainer = document.getElementById("texture-image");

// Menu actions (open/save/quit)
openFile.addEventListener("click", () => {
   ipcRenderer.send("openETMfile")
   ipcRenderer.send("closeETMfile")
})

saveAsBtn.addEventListener("click", () => {
   ipcRenderer.send("saveAsETMfile")
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
var rowArray = [];

// Menu bar buttons 
copyBtnEl.addEventListener("click", () => document.execCommand("copy")); // Copy function
pasteBtnEl.addEventListener("click", () => document.execCommand("paste")); // Paste function
undoBtnEl.addEventListener("click", () => document.execCommand("undo")); // Undo function
redoBtnEl.addEventListener("click", () => document.execCommand("redo")); // Redo function

// Getting file path
ipcRenderer.on("etmFileChannel", (e, filepath) => {

   var fd = fs.openSync(filepath); // Opening the file in memory
   var buffer = fs.readFileSync(fd); // Converting file string to buffer (hex)

   // Defining headers
   var ETMFileName = String(filepath);
   var ETMFileName_converted = ETMFileName.replace(/^[^.]*\\/gm, '');
   headerFileSize.value = buffer.length + " bytes"; // Outputing file size to the header
   headerFileName.value = ETMFileName_converted; // Outputing file name to the header

   // Reading ETM file header 
   countEl.value = buffer.readUint8(0);

   // Spliting the file
   let buffer_header = buffer.subarray(0x00, 0x20);
   let buffer_entries = buffer.subarray(0x20);
   let entrySize = buffer_entries.readUInt32LE(0x00);
   let entryType = buffer_entries.readUint8(0x04);
   let entryName = buffer_entries.readUint8(0x20);

   // Core functions
   function createTableRow(index) {
      let tr = document.createElement("tr");
      let td_number = document.createElement("td");
      let td_raw = document.createElement("td");
      let td_size = document.createElement("td");
      let td_type = document.createElement("td");
      let td_available = document.createElement("td");
      let td_import = document.createElement("td");
      let td_export = document.createElement("td");
      let td_download = document.createElement("td");
      let td_remove = document.createElement("td");
      let td_notes = document.createElement("td");
      let import_btn = document.createElement("button");
      let export_btn = document.createElement("button");
      let download_btn = document.createElement("button");
      let remove_btn = document.createElement("button");
      let notes = document.createElement("input");

      tr.id = index + 1;
      td_number.innerText = index + 1;

      td_raw.id = `td_raw-${index + 1}`
      td_raw.classList.add("entryRawName");

      td_size.id = `td_size-${index + 1}`
      td_size.classList.add("entrySize");

      td_type.id = `td_type-${index + 1}`
      td_type.classList.add("entryType");

      import_btn.id = `importBtn-${index}`
      export_btn.id = `exportBtn-${index}`
      download_btn.id = `downloadBtn-${index}`
      remove_btn.id = `removeBtn-${index}`

      td_import.classList.add("cell-buttons");
      td_export.classList.add("cell-buttons");
      td_download.classList.add("cell-buttons");
      td_remove.classList.add("cell-buttons");

      import_btn.classList.add("win7-btn", "table-buttons");
      export_btn.classList.add("win7-btn", "table-buttons");
      download_btn.classList.add("win7-btn", "table-buttons");
      remove_btn.classList.add("win7-btn", "table-buttons");

      import_btn.innerHTML = `<i class="fa-solid fa-file-import"></i> Import`;
      export_btn.innerHTML = `<i class="fa-solid fa-file-export"></i> Export`;
      download_btn.innerHTML = `<i class="fa-solid fa-download"></i> Download`;
      remove_btn.innerHTML = `<i class="fa-solid fa-trash"></i> Remove`;
      notes.classList.add("comment-box");
      notes.setAttribute("placeholder", "Type here...");
      notes.setAttribute("type", "text");

      td_import.appendChild(import_btn);
      td_export.appendChild(export_btn);
      td_download.appendChild(download_btn);
      td_remove.appendChild(remove_btn);
      td_notes.appendChild(notes);

      tr.append(td_number, td_raw, td_size, td_type, td_available, td_import, td_export, td_download, td_remove, td_notes);
      tbody.appendChild(tr);
   }

   // Create initial table rows
   for (let x = 0; x != countEl.value; x++) {
      createTableRow(x);
   }

   // Populates the table cell with data
   function showData() {
      let fileSizeAcumulator = 0;
      for (let i = 0; i != countEl.value; i++) {
         let entryName = buffer.subarray(0x40 + fileSizeAcumulator, 0x40 + fileSizeAcumulator + 16);
         let firstZeroedByte = entryName.indexOf(0x00);
         let entryTrimmed = entryName.subarray(0, firstZeroedByte).toString();
         let entrySize = buffer.readUInt32LE(0x20 + fileSizeAcumulator);
         if (entrySize > 999) {
            entrySize = entrySize / 1000;
            entrySizeCell[i].innerText = entrySize.toFixed(0) + " KB";
         } else {
            entrySizeCell[i].innerText = entrySize + " B";
         }

         entryRawNameCell[i].innerText = entryTrimmed;
         entryTypeCell[i].innerText = buffer.readUInt32LE(0x24 + fileSizeAcumulator);

         fileSizeAcumulator += buffer.readUInt32LE(0x20 + fileSizeAcumulator);
      }
   }
   showData();

   // Stores the room name
   var folderName = headerFileName.value.substring(0, headerFileName.value.length - 4);

   // Gets click events 
   tbody.addEventListener("click", function exportObject({ target }) {
      let iterator = 0;

      // Export an object
      for (let x = 0; x != countEl.value; x++) {
         if (target.id == `exportBtn-${x}`) {
            if (!fs.existsSync(`ETM/${folderName}`)) {
               fs.mkdirSync(`ETM/${folderName}`, { recursive: true });
            }

            let entryHeader = buffer_entries.subarray(0x00 + iterator, 0x40 + iterator);
            let obj = buffer_entries.subarray(0x40 + iterator, 0x40 + iterator + entryHeader.readUint32LE(0));

            fs.writeFile(`ETM/${folderName}/${entryRawNameCell[x].textContent}`, obj, function (err) {
               if (err) {
                  console.log(err);
               }
               textBox("Object exported successfully!", "green");
            })
         } else { iterator += buffer_entries.readUint32LE(0 + iterator); }
      }

      iterator = 0;
      // Import an object
      for (let x = 0; x != countEl.value; x++) {
         if (target.id == `importBtn-${x}`) {
            if (!fs.existsSync(`ETM/${folderName}`)) {
               fs.mkdirSync(`ETM/${folderName}`, { recursive: true });
            }

            // Shows open Dialog, and then imports to the ETM file
            ipcRenderer.send("importETM");
            ipcRenderer.on("ETMobject", function (e, filepath) {
               let buffer_newFile = fs.readFileSync(filepath);
               let file_header = Buffer.alloc(0x40);
               let buffer_top = Buffer.alloc(0);
               let buffer_bottom = Buffer.alloc(0);
               let newFileName = path.basename(filepath);
               let fileExtension = path.extname(newFileName);

               file_header.writeUint32LE(buffer_newFile.length + 0x40, 0x00);
               switch (fileExtension) {
                  case ".eff": if (!newFileName.includes("obm")) { file_header.writeUint8(0x09, 0x04); break; }
                  case ".eff": if (newFileName.includes("obm")) { file_header.writeUint8(0x0A, 0x04); break; }
                  case ".bin": file_header.writeUint8(0x0B, 0x04); break;
                  case ".tpl": file_header.writeUint8(0x0B, 0x04); break;
                  case ".fcv": file_header.writeUint8(0x0C, 0x04); break;
                  case ".seq": file_header.writeUint8(0x0D, 0x04); break;
                  default: break;
               }

               if (x == 0) {
                  buffer_top = buffer_entries.subarray(0x00, 0x00);
                  buffer_bottom = buffer_entries.subarray(buffer_entries.readUint32LE(0x00 + iterator));
               } else {
                  buffer_top = buffer_entries.subarray(0x00 + iterator, 0x00 + iterator + buffer_entries.readUint32LE(0x00 + iterator));
               }
               buffer_entries = Buffer.concat([buffer_top, file_header, buffer_newFile, buffer_bottom]);
            });

         } else { iterator += buffer_entries.readUint32LE(0 + iterator); }
      }
   })

   // exportAllModelsBtn.addEventListener("click", function () {
   //     fs.mkdirSync(`SMD/${folderName}/Models`, { recursive: true });
   //     for (let i = 0; i < entryTotal.value; i++) {
   //         fs.writeFileSync(`SMD/${folderName}/Models/${i}.bin`, readBinModel(i + 1));
   //     }
   //     showTextBox("All models exported successfully!", "green");
   // })
   // importNewModelBtn.addEventListener("click", function () {
   //     importNewModel()
   // })
   // ===============================================================

   /* ===============
       UPDATE
      =============== */

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

   // Save all modified buffer back to file
   saveBtn.addEventListener("click", () => {
      let COMPLETE_BUFFER = Buffer.concat([buffer_header, buffer_entries])
      headerFileSize.value = COMPLETE_BUFFER.length + " bytes";
      fs.writeFileSync(filepath, COMPLETE_BUFFER);
      var saveMessage = document.querySelector(".hide");
      saveMessage.style.display = "block"
      setTimeout(() => {
         saveMessage.style.display = "none"
      }, 2000);
   })

   closeBtn.addEventListener("click", () => {
      ipcRenderer.send("closeETMfile");
      fs.closeSync(fd);
   })

   ipcRenderer.on("saveAsETMfileContent", (e, arg) => {
      let COMPLETE_BUFFER = Buffer.concat([buffer_header, buffer_entries]);
      fs.writeFileSync(arg, COMPLETE_BUFFER);
   })
})
