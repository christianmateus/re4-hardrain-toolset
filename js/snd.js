const fs = require('fs');
const { ipcRenderer } = require('electron');

/* ===============
    CREATE
   =============== */

// Getting elements
var rootEl = document.querySelector("html");
var copyBtnEl = document.getElementById("copyBtn");
var pasteBtnEl = document.getElementById("pasteBtn");
var undoBtnEl = document.getElementById("undoBtn");
var redoBtnEl = document.getElementById("redoBtn");
var containerAudiosEl = document.getElementById("container-geral");
var headerFileName = document.getElementById("header-filename");
var headerFileSize = document.getElementById("header-filesize");
var countEl = document.getElementById("count");

// Getting audio elements
const exportAllBtn = document.getElementById("exportAllBtn");

// Const for getting Menu elements
const openFile = document.getElementById("openSNDfile");
const closeBtn = document.getElementById("closeSNDfile");
const saveBtn = document.getElementById("saveSNDfile");
const saveAsBtn = document.getElementById("saveSNDas");
const quitApp = document.getElementById("quitApp");
const minimizeBtn = document.getElementById("minimize");
const maximizeBtn = document.getElementById("maximize");
const closeWindowBtn = document.getElementById("closeWindow");

// Menu actions (open/save/quit)
openFile.addEventListener("click", () => {
   ipcRenderer.send("openSNDfile")
   ipcRenderer.send("closeSNDfile")
})

saveAsBtn.addEventListener("click", () => {
   ipcRenderer.send("saveAsSNDfile")
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

// Menu bar buttons 
copyBtnEl.addEventListener("click", () => document.execCommand("copy")); // Copy function
pasteBtnEl.addEventListener("click", () => document.execCommand("paste")); // Paste function
undoBtnEl.addEventListener("click", () => document.execCommand("undo")); // Undo function
redoBtnEl.addEventListener("click", () => document.execCommand("redo")); // Redo function

// Getting file path
ipcRenderer.on("sndFileChannel", (e, filepath) => {

   var fd = fs.openSync(filepath); // Opening the file in memory
   var buffer = fs.readFileSync(fd); // Converting file string to buffer (hex)

   // Defining headers
   var SNDFileName = String(filepath);
   var SNDFileName_converted = SNDFileName.replace(/^[^.]*\\/gm, '');
   headerFileSize.value = buffer.length + " bytes"; // Outputing file size to the header
   headerFileName.value = SNDFileName_converted; // Outputing file name to the header

   // Reading SND file header 
   const firstAudioOffset = buffer.readUint32LE(0x6C);

   // Spliting the file in 2 parts
   var buffer_VAG = buffer.subarray(buffer.indexOf("56616769", 0, "hex"), firstAudioOffset - 16);
   var buffer_audios = buffer.subarray(firstAudioOffset);
   countEl.value = buffer_VAG.at(0x08);

   // Getting VAG values
   let audioStartOffset = buffer_VAG.readUint32LE(16);
   let audioLength = buffer_VAG.readUint32LE(20);
   let audioFrequency = buffer_VAG.readUint32LE(28);

   // Core functions
   function createAudioElement(audioNumber) {
      let div = document.createElement("div");
      let span = document.createElement("span");
      let importBtn = document.createElement("button");
      let exportBtn = document.createElement("button");

      div.classList.add("container-audio-items");
      div.id = `${audioNumber + 1}`
      span.innerText = `Audio ${audioNumber + 1}`;
      importBtn.classList.add("win7-btn");
      importBtn.innerText = "Import";
      exportBtn.classList.add("win7-btn");
      exportBtn.id = `${audioNumber + 1}`;
      exportBtn.innerText = "Export";
      div.appendChild(span);
      div.appendChild(importBtn);
      div.appendChild(exportBtn);

      containerAudiosEl.appendChild(div);

   }

   function audioOffsets() {
      let audioOffsetIterator = 0;
      let vagHeader = Buffer.alloc(0x40, "564147700000000600000000 00 00 08 B0 00 00 1F 40 000000000000000000000000000000000000000000000000000000000000000000000000 0000000000000000", "hex");

      for (let j = 0; j != countEl.value; j++) {
         let audioFile = buffer_audios.subarray(buffer_VAG.readUint32LE(16 + audioOffsetIterator),
            buffer_VAG.readUint32LE(16 + audioOffsetIterator) + buffer_VAG.readUint32LE(20 + audioOffsetIterator));

         fs.mkdirSync(`SND/${headerFileName.value}`, { recursive: true });
         fs.writeFileSync(`SND/${headerFileName.value}/audio_${j + 1}.vag`, audioFile);
         audioOffsetIterator += 16;
      }
   }

   // Creates audios elements
   for (let i = 0; i != countEl.value; i++) {
      createAudioElement(i);
   }

   exportAllBtn.addEventListener("click", function () {
      audioOffsets();
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
      headerFileSize.value = COMPLETE_BUFFER.length + " bytes";
      fs.writeFileSync(filepath, COMPLETE_BUFFER);
      var saveMessage = document.querySelector(".hide");
      saveMessage.style.display = "block"
      setTimeout(() => {
         saveMessage.style.display = "none"
      }, 2000);
   })

   closeBtn.addEventListener("click", () => {
      ipcRenderer.send("closeSNDfile");
      fs.closeSync(fd);
   })

   ipcRenderer.on("saveAsSNDfileContent", (e, arg) => {
      let COMPLETE_BUFFER = Buffer.concat([buffer_entries, buffer_models, buffer_padding, buffer_textures]);
      fs.writeFileSync(arg, COMPLETE_BUFFER);
   })
})
