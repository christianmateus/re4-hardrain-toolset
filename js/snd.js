const fs = require('fs');
const { exec } = require('node:child_process');
const { ipcRenderer } = require('electron');
const path = require('path');

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
const exportAllWavBtn = document.getElementById("exportAllWavBtn");
const playBtn = document.getElementById("playBtn");

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
   let frequencyBigEndian = Buffer.alloc(4);
   let lengthBigEndian = Buffer.alloc(4);
   let audioFrequency = buffer_VAG.readUint32LE(28);

   // Removing extension from folder name
   var folderName = headerFileName.value.substring(0, headerFileName.value.length - 4);

   // Core functions
   function createAudioElement(audioNumber) {
      let div = document.createElement("div");
      let span = document.createElement("span");
      let importBtn = document.createElement("button");
      let exportBtn = document.createElement("button");
      let playBtn = document.createElement("button");

      div.classList.add("container-audio-items");
      div.id = `${audioNumber + 1}`

      span.innerText = `Audio ${audioNumber + 1}`;

      importBtn.classList.add("win7-btn");
      importBtn.innerText = "Import";

      exportBtn.classList.add("win7-btn");
      exportBtn.id = `${audioNumber + 1}`;
      exportBtn.innerText = "Export";

      playBtn.innerText = "Play";
      playBtn.id = `${audioNumber + 1}`;

      div.appendChild(span);
      div.appendChild(importBtn);
      div.appendChild(exportBtn);

      containerAudiosEl.appendChild(div);

   }

   function exportAllAudios() {
      let audioOffsetIterator = 0; // Iterates through each sound offset

      for (let j = 0; j != countEl.value; j++) {
         let audioLength = buffer_VAG.readUint32LE(20 + audioOffsetIterator); // Gets audio length from VAG area (in .snd)
         let audioFrequency = buffer_VAG.readUint32LE(28 + audioOffsetIterator); // Gets audio frequency from VAG area (in .snd)
         lengthBigEndian.writeUint32BE(audioLength); // Converts length to Big Endian
         frequencyBigEndian.writeUint32BE(audioFrequency); // Converts frequency to Big Endian

         // Creates VAG Header
         let vagHeader = Buffer.alloc(0x40, `564147700000000600000000${lengthBigEndian.toString("hex")}${frequencyBigEndian.toString("hex")}000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000`, "hex");

         // Gets a single complete audio
         let audioFile = buffer_audios.subarray(buffer_VAG.readUint32LE(16 + audioOffsetIterator),
            buffer_VAG.readUint32LE(16 + audioOffsetIterator) + buffer_VAG.readUint32LE(20 + audioOffsetIterator));

         // Insert the header at the start of the audio
         audioFile = Buffer.concat([vagHeader, audioFile]);

         fs.mkdirSync(`SND/${folderName}`, { recursive: true });
         fs.writeFileSync(`SND/${folderName}/${folderName}_${j + 1}.vag`, audioFile);
         audioOffsetIterator += 16;
      }
   }

   function convertToWav(inputFile, outputFile) {
      // fs.mkdirSync(`SND/${folderName}/wav`);

      // Change file extension
      let outputFileWAV = outputFile.replace(/\.[^.]+$/, '.wav');

      const mfaudio = `${path.join(__dirname, '..', 'resources', 'mfaudio.exe')}`;
      const inputPath = `${path.join(__dirname, '..', 'SND', folderName, inputFile)}`;
      const outputPath = `${path.join(__dirname, '..', 'SND', folderName, 'wav', outputFileWAV)}`;

      console.log(inputPath + inputFile);
      exec(`${mfaudio} /OTWAVU "${inputPath}" "${outputPath}"`)
   }

   exportAllWavBtn.addEventListener("click", function () {
      const inputPath = `${path.join(__dirname, '..', 'SND', folderName)}`;
      let audioFiles = fs.readdirSync(inputPath);
      for (let i = 0; i != audioFiles.length - 1; i++) {
         console.log(audioFiles[i + 1]);
         convertToWav(audioFiles[i + 1], audioFiles[i + 1]);
      }
   });

   // Creates audios elements
   for (let i = 0; i != countEl.value; i++) {
      createAudioElement(i);
   }

   exportAllBtn.addEventListener("click", function () {
      exportAllAudios();
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
