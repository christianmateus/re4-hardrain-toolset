const fs = require('fs');
const { exec } = require('node:child_process');
const { ipcRenderer } = require('electron');
const path = require('path');
const textBox = require('../shared/textBox');

/* ===============
    CREATE
   =============== */

// Getting elements
var rootEl = document.querySelector("html");
var scanVagBtnEl = document.getElementById("scanVagBtn");
var scanBtnEl = document.getElementById("scanBtn");
var copyBtnEl = document.getElementById("copyBtn");
var pasteBtnEl = document.getElementById("pasteBtn");
var undoBtnEl = document.getElementById("undoBtn");
var redoBtnEl = document.getElementById("redoBtn");
var containerAudiosEl = document.getElementById("container-geral");
var containerWavAudiosEl = document.getElementById("container-wav-converted");
var headerFileName = document.getElementById("header-filename");
var headerFileSize = document.getElementById("header-filesize");
var countEl = document.getElementById("count");

// Getting audio elements
const exportAllBtn = document.getElementById("exportAllBtn");
const convertAllWavBtn = document.getElementById("exportAllWavBtn");
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
   function createAudioElement(audioNumber, isWAV) {
      let div = document.createElement("div");
      let span = document.createElement("span");
      let importBtn = document.createElement("button");
      let exportBtn = document.createElement("button");
      let wavImg = document.createElement("img");
      let convertBtn = document.createElement("button");
      let convertToVagBtn = document.createElement("button");
      let playBtn = document.createElement("button");

      if (isWAV == false) {
         div.classList.add("container-audio-items");
         div.id = `${audioNumber + 1}`

         if (fs.existsSync(`SND/${folderName}`)) {
            const inputPath = `${path.join(__dirname, '..', 'SND', folderName)}`;
            let audioFiles = fs.readdirSync(inputPath, { withFileTypes: true });

            // Filters the audio files to ignore all subfolders, this leaves the array with only .wav files
            let filesNames = audioFiles
               .filter(dirent => dirent.isFile())
               .map(dirent => dirent.name);

            span.innerText = `VAG: ${filesNames[audioNumber]}`;
         } else {
            span.innerText = `VAG: Not exported`;
         }

         span.id = `span-${audioNumber + 1}`
         wavImg.src = `${path.join(__dirname, "..", "images", "wav-64.png")}`;
         wavImg.style.float = "left";
         wavImg.width = 16;
         wavImg.style.marginRight = "4px";

         importBtn.classList.add("win7-btn");
         importBtn.id = `import-${audioNumber + 1}`;
         importBtn.innerText = "Import to .snd";

         exportBtn.classList.add("win7-btn");
         exportBtn.id = `export-${audioNumber + 1}`;
         exportBtn.innerText = "Export .vag";
         convertBtn.classList.add("win7-btn");
         convertBtn.style.display = "inline-block";
         convertBtn.id = `convert-${audioNumber + 1}`;
         convertBtn.innerHTML = "Convert to .wav";

      } else {
         div.classList.add("container-audio-items");
         div.id = `${audioNumber + 1}`

         const inputPath = `${path.join(__dirname, '..', 'SND', folderName, 'wav')}`;
         let audioFiles = fs.readdirSync(inputPath, { withFileTypes: true });

         // Filters the audio files to ignore all subfolders, this leaves the array with only .wav files
         let filesNames = audioFiles
            .filter(dirent => dirent.isFile())
            .map(dirent => dirent.name);

         span.innerText = `${filesNames[audioNumber]}`;

         playBtn.classList.add("win7-btn");
         playBtn.innerHTML = '<i class="fa-solid fa-circle-play"></i>  Play audio';
         playBtn.id = `play-${audioNumber + 1}`;

         convertToVagBtn.classList.add("win7-btn");
         convertToVagBtn.innerHTML = '<i class="fa-solid fa-file-export"></i>  Convert to .vag';
         convertToVagBtn.id = `convertToVag-${audioNumber + 1}`;
      }

      if (isWAV) {
         div.appendChild(span);
         div.appendChild(playBtn);
         div.appendChild(convertToVagBtn);
         containerWavAudiosEl.appendChild(div);
      } else {
         div.appendChild(span);
         div.appendChild(importBtn);
         div.appendChild(exportBtn);
         convertBtn.appendChild(wavImg);
         div.appendChild(convertBtn);
         containerAudiosEl.appendChild(div);
      }

   }

   function checkWavFolder() {
      if (fs.existsSync(`SND/${folderName}/wav`)) {

         //Empties the container
         containerWavAudiosEl.innerHTML = `<h5>WAV Converted Audios</h5>`

         // Create WAV elements based on file count inside the wav folder
         let wavAudioFiles = fs.readdirSync(`SND/${folderName}/wav`);
         for (let index = 0; index != wavAudioFiles.length; index++) {
            createAudioElement(index, true);
         }
      }
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
         fs.mkdirSync(`SND/${folderName}/backup`, { recursive: true });

         if (j < 9) {
            fs.writeFileSync(`SND/${folderName}/${folderName}_0${j + 1}.vag`, audioFile);
            fs.writeFileSync(`SND/${folderName}/backup/${folderName}_0${j + 1}.vag`, audioFile);
         } else {
            fs.writeFileSync(`SND/${folderName}/${folderName}_${j + 1}.vag`, audioFile);
            fs.writeFileSync(`SND/${folderName}/backup/${folderName}_${j + 1}.vag`, audioFile);
         }
         audioOffsetIterator += 16;
      }
      checkVagFolder();
      textBox.module("All audios exported as .vag", "green");
   }

   function convertToWav(inputFile, outputFile) {
      if (!fs.existsSync(`SND/${folderName}/wav`)) {
         fs.mkdirSync(`SND/${folderName}/wav`);
      }

      // Change file extension
      let outputFileWAV = outputFile.replace(/\.[^.]+$/, '.wav');

      const mfaudio = `${path.join(__dirname, '..', 'resources', 'mfaudio.exe')}`;
      const inputPath = `${path.join(__dirname, '..', 'SND', folderName, inputFile)}`;
      const outputPath = `${path.join(__dirname, '..', 'SND', folderName, 'wav', outputFileWAV)}`;

      console.log(inputPath + inputFile);
      exec(`${mfaudio} /OTWAVU "${inputPath}" "${outputPath}"`)
   }

   function convertToVag(inputFile, outputFile) {
      // Only converts if directory exists
      if (fs.existsSync(`${path.join(__dirname, '..', 'SND', folderName, 'wav')}`)) {

         // Change file extension
         let outputFileVAG = outputFile.replace(/\.[^.]+$/, '.vag');

         const mfaudio = `${path.join(__dirname, '..', 'resources', 'mfaudio.exe')}`;
         const inputPath = `${path.join(__dirname, '..', 'SND', folderName, 'wav', inputFile)}`;
         const outputPath = `${path.join(__dirname, '..', 'SND', folderName, outputFileVAG)}`;

         console.log(inputPath + inputFile);
         exec(`${mfaudio} /OTVAGC "${inputPath}" "${outputPath}"`)
      } else {
         console.log("Directory does not exists");
      }
   }

   convertAllWavBtn.addEventListener("click", function () {
      const inputPath = `${path.join(__dirname, '..', 'SND', folderName)}`;
      let audioFiles = fs.readdirSync(inputPath, { withFileTypes: true });

      // Filters the audio files to ignore all subfolders, this leaves the array with only .wav files
      let filesNames = audioFiles
         .filter(dirent => dirent.isFile())
         .map(dirent => dirent.name);

      // Iterates through each .vag audio and converts to .wav
      for (let i = 0; i != filesNames.length; i++) {
         convertToWav(filesNames[i], filesNames[i]);
      }

      // Spawns WAV elements on right side of the screen
      if (filesNames.length > 10) {
         setTimeout(() => {
            checkWavFolder();
         }, 10000);
      } else {
         setTimeout(() => {
            checkWavFolder();
         }, 5000);
      }
   });

   function checkVagFolder() {
      // Verifies if directory exists
      if (!fs.existsSync(`SND/${folderName}`)) {
         fs.mkdirSync(`SND/${folderName}`);
      }

      containerAudiosEl.innerHTML = `<h5>Audio List</h5>`
      // Create .vag audio elements for each audio inside .snd
      for (let i = 0; i != countEl.value; i++) {
         createAudioElement(i, false);
      }
   }

   // Check if there are any WAV files on page load, and then create elements
   checkVagFolder();

   // Check if there are any WAV files on page load, and then create elements
   checkWavFolder();

   // Export or convert a single audio
   containerAudiosEl.addEventListener("click", function ({ target }) {

      // Exports a single .vag audio
      for (let i = 1; i != countEl.value + 1; i++) {
         if (target.id == `export-${i}`) {
            let audioLength = buffer_VAG.readUint32LE(20 + (16 * (i - 1))); // Gets audio length from VAG area (in .snd)
            let audioFrequency = buffer_VAG.readUint32LE(28 + (16 * (i - 1))); // Gets audio frequency from VAG area (in .snd)
            lengthBigEndian.writeUint32BE(audioLength); // Converts length to Big Endian
            frequencyBigEndian.writeUint32BE(audioFrequency); // Converts frequency to Big Endian

            // Creates VAG Header
            let vagHeader = Buffer.alloc(0x40, `564147700000000600000000${lengthBigEndian.toString("hex")}${frequencyBigEndian.toString("hex")}000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000`, "hex");

            // Gets a single complete audio
            let audioFile = buffer_audios.subarray(buffer_VAG.readUint32LE(16 + (16 * (i - 1))),
               buffer_VAG.readUint32LE(16 + (16 * (i - 1))) + buffer_VAG.readUint32LE(20 + (16 * (i - 1))));

            // Insert the header at the start of the audio
            audioFile = Buffer.concat([vagHeader, audioFile]);

            fs.mkdirSync(`SND/${folderName}`, { recursive: true });

            if (i < 10) {
               fs.writeFileSync(`SND/${folderName}/${folderName}_0${i}.vag`, audioFile);
               document.getElementById(`span-${i}`).innerText = `VAG: ${folderName}_0${i}.vag`;
            } else {
               fs.writeFileSync(`SND/${folderName}/${folderName}_${i}.vag`, audioFile);
               document.getElementById(`span-${i}`).innerText = `VAG: ${folderName}_${i}.vag`;
            }
         }
      }

      // Convert a single .vag to .wav
      for (let i = 1; i != countEl.value + 1; i++) {
         if (target.id == `convert-${i}`) {
            const inputPath = `${path.join(__dirname, '..', 'SND', folderName)}`;
            let audioFiles = fs.readdirSync(inputPath, { withFileTypes: true });
            let audioNumber;

            // Filters the audio files to ignore all subfolders, this leaves the array with only .wav files
            let filesNames = audioFiles
               .filter(dirent => dirent.isFile())
               .map(dirent => dirent.name);

            // Creates a variable string to compare on next step
            if (i < 10) {
               audioNumber = `${folderName}_0${i}.vag`
            } else {
               audioNumber = `${folderName}_${i}.vag`
            }

            // Checks if .vag file exists, then tell in which position it is on the filesNames array
            if (fs.existsSync(`${path.join(__dirname, '..', 'SND', folderName, audioNumber)}`)) {
               for (let x = 0; x != filesNames.length; x++) {
                  if (filesNames[x] == audioNumber) {

                     // Converts to .wav
                     convertToWav(filesNames[x], filesNames[x]);
                     break;
                  }
               }
            } else {
               ipcRenderer.send("errorMessage");
            }

            // Spawns WAV elements on right side of the screen
            setTimeout(() => {
               checkWavFolder();
            }, 1400);
         }
      }

   })

   // Play converted .wav sounds
   containerWavAudiosEl.addEventListener("click", function (e) {
      const inputPath = `${path.join(__dirname, '..', 'SND', folderName, 'wav')}`;
      let audioFiles = fs.readdirSync(inputPath, { withFileTypes: true });

      // Filters the audio files to ignore all subfolders, this leaves the array with only .wav files
      let filesNames = audioFiles
         .filter(dirent => dirent.isFile())
         .map(dirent => dirent.name);

      // Plays a .wav sound
      for (let i = 1; i != filesNames.length + 1; i++) {
         if (e.target.id == `play-${i}`) {
            const spanParent = e.target.parentNode; // Gets play button parent
            const spanText = spanParent.children[0].innerText; // Access parent first child, and gets text inside span

            const sound = new URL(`${path.join(__dirname, '..', 'SND', folderName, 'wav', spanText)}`)
            new Audio(sound.href).play();
         }
      }

      // Convert a single .wav to .vag
      for (let i = 1; i != countEl.value + 1; i++) {
         if (e.target.id == `convertToVag-${i}`) {
            const inputPath = `${path.join(__dirname, '..', 'SND', folderName, 'wav')}`;
            let audioFiles = fs.readdirSync(inputPath, { withFileTypes: true });
            let audioNumber;

            // Filters the audio files to ignore all subfolders, this leaves the array with only .wav files
            let filesNames = audioFiles
               .filter(dirent => dirent.isFile())
               .map(dirent => dirent.name);
            console.log(filesNames);
            // Creates a variable string to compare on next step
            if (i < 10) {
               audioNumber = `${folderName}_0${i}.wav`
            } else {
               audioNumber = `${folderName}_${i}.wav`
            }

            // Checks if .vag file exists, then tell in which position it is on the filesNames array
            if (fs.existsSync(`${path.join(__dirname, '..', 'SND', folderName, 'wav', audioNumber)}`)) {
               console.log("Audio existe: " + audioNumber);
               for (let x = 0; x != filesNames.length; x++) {
                  if (filesNames[x] == audioNumber) {
                     console.log("Está no indice: " + x);

                     // Converts to .vag
                     convertToVag(filesNames[x], filesNames[x]);
                     break;
                  }
               }
            } else {
               ipcRenderer.send("errorMessage");
            }

            // Spawns WAV elements on right side of the screen
            setTimeout(() => {
               checkWavFolder();
               checkVagFolder();
            }, 1400);
         }
      }
   })

   // Export all audios as .vag
   exportAllBtn.addEventListener("click", function () {
      exportAllAudios();
   })

   // Scan for new WAV files
   scanBtnEl.addEventListener("click", function () {
      checkWavFolder();
   })

   // Scan for new VAG files
   scanVagBtnEl.addEventListener("click", function () {
      checkVagFolder();
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
