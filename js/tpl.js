const fs = require('fs');
const { ipcRenderer } = require('electron');
const path = require('path');
const textBox = require('../shared/textBox').module;

/* ===============
    CREATE
   =============== */

// Getting elements
const countEl = document.getElementById("count");
const tbody = document.getElementsByTagName("tbody")[0];
const headerFileName = document.getElementById("header-filename");
const headerFileSize = document.getElementById("header-filesize");
const advancedParameters = document.getElementsByClassName('advanced-parameters');

// Const for getting Menu elements
const openFile = document.getElementById("openTPLfile");
const closeBtn = document.getElementById("closeTPLfile");
const saveBtn = document.getElementById("saveTPLfile");
const saveAsBtn = document.getElementById("saveTPLas");
const quitApp = document.getElementById("quitApp");
const refreshbtnEl = document.getElementById("refresh-btn");
const renamebtnEl = document.getElementById("rename-btn");
const deletebtnEl = document.getElementById("delete-btn");
const showmipmapsCheck = document.getElementById("show-mipmaps-btn");
const showadvancedCheck = document.getElementById("show-advanced-btn");
const helpBtn = document.getElementById("help");
const minimizeBtn = document.getElementById("minimize");
const maximizeBtn = document.getElementById("maximize");
const closeWindowBtn = document.getElementById("closeWindow");

// Const for table cells
let widthEl = document.getElementsByClassName('texture-width');
let heightEl = document.getElementsByClassName('texture-height');
let colorsEl = document.getElementsByClassName('select-colors');
let interlaceEl = document.getElementsByClassName('select-interlace');
let renderEl = document.getElementsByClassName('texture-render');
let mipmapsEl = document.getElementsByClassName('texture-mipmaps');
let resolutionEl = document.getElementsByClassName('texture-resolution');
let unk1El = document.getElementsByClassName('texture-unk1');
let unk2El = document.getElementsByClassName('texture-unk2');
let unk3El = document.getElementsByClassName('texture-unk3');
let unk4El = document.getElementsByClassName('texture-unk4');

// Menu actions (open/save/quit)
openFile.addEventListener("click", () => {
   ipcRenderer.send("openTPLfile")
   ipcRenderer.send("closeTPLfile")
})

saveAsBtn.addEventListener("click", () => {
   ipcRenderer.send("saveAsTPLfile")
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

helpBtn.addEventListener("click", function () {
   ipcRenderer.send("showHelp");
})

/* ===============
    READ
   =============== */

// Tests
showadvancedCheck.addEventListener("change", function () {
   if(this.checked){
      for (let index = 0; index < advancedParameters.length; index++) {
         advancedParameters[index].classList.remove("hide")
      }
   } else {
      for (let index = 0; index < advancedParameters.length; index++) {
         advancedParameters[index].classList.add("hide")
      }
   }
});

// Global variables
let textureIterator = 0;

// Getting file path
ipcRenderer.on("tplFileChannel", (e, filepath) => {

   var fd = fs.openSync(filepath); // Opening the file in memory
   var buffer = fs.readFileSync(fd); // Converting file string to buffer (hex)

   // Defining headers
   headerFileSize.value = buffer.length + " bytes"; // Outputing file size to the header
   headerFileName.value = path.basename(filepath); // Outputing file name to the header

   // Functions
   function createTableCells(index) {
      const tr = document.createElement("tr");
      const td_checkbox = document.createElement("td");
      const input_checkbox = document.createElement("input");
      const td_img = document.createElement("td");
      const img = document.createElement("img");
      const td_name = document.createElement("td");
      const td_width = document.createElement("td");
      const td_height = document.createElement("td");
      // Bit Depth
      const td_colors = document.createElement("td");
      const select_colors = document.createElement("select");
      const opt_4bit = document.createElement("option");
      const opt_8bit = document.createElement("option");
      // Interlace
      const td_interlace = document.createElement("td");
      const select_interlace = document.createElement("select");
      const opt_bgr = document.createElement("option");
      const opt_bgri = document.createElement("option");
      const opt_ps2 = document.createElement("option");
      const opt_stretched = document.createElement("option");
      // Advanced
      const td_render = document.createElement("td");
      const td_mipmaps = document.createElement("td");
      const td_resolution = document.createElement("td");
      const td_unk1 = document.createElement("td");
      const td_unk2 = document.createElement("td");
      const td_unk3 = document.createElement("td");
      const td_unk4 = document.createElement("td");

      tr.id = `tr-${index}`;
      input_checkbox.id = `checkbox-${index}`;
      input_checkbox.setAttribute("type", "checkbox");
      img.id = `miniature-${index}`;
      td_name.id = `name-${index}`;
      td_width.id = `width-${index}`;
      td_height.id = `height-${index}`;
      td_colors.id = `colors-${index}`;
      select_interlace.id = `interlace-${index}`;
      td_render.id = `render-${index}`;
      td_mipmaps.id = `mipmaps-${index}`;
      td_resolution.id = `resolution-${index}`;
      td_unk1.id = `unk1-${index}`;
      td_unk2.id = `unk2-${index}`;
      td_unk3.id = `unk3-${index}`;
      td_unk4.id = `unk4-${index}`;

      td_width.classList.add("texture-width");
      td_height.classList.add("texture-height");
      select_colors.classList.add("select-colors");
      // Interlace
      // td_interlace.classList.add("texture-interlace");
      select_interlace.classList.add("select-interlace");
      // Advanced
      td_render.classList.add("texture-render","advanced-parameters", "hide");
      td_mipmaps.classList.add("texture-mipmaps","advanced-parameters", "hide");
      td_resolution.classList.add("texture-resolution","advanced-parameters", "hide");
      td_unk1.classList.add("texture-unk1","advanced-parameters", "hide");
      td_unk2.classList.add("texture-unk2","advanced-parameters", "hide");
      td_unk3.classList.add("texture-unk3","advanced-parameters", "hide");
      td_unk4.classList.add("texture-unk4","advanced-parameters", "hide");

      td_name.innerText = `${index}.tpl`

      // Bit Depth
      opt_4bit.value = 8;
      opt_4bit.innerText = "4 Bit"
      opt_8bit.value = 9;
      opt_8bit.innerText = "8 Bit"
      select_colors.append(opt_4bit,opt_8bit);
      td_colors.appendChild(select_colors);

      // Interlace
      opt_bgr.value = 0;
      opt_bgr.innerText = "BGR";
      opt_bgri.value = 1;
      opt_bgri.innerText = "BGR+i";
      opt_ps2.value = 2;
      opt_ps2.innerText = "PS2";
      opt_stretched.value = 3;
      opt_stretched.innerText = "Stretched";
      select_interlace.append(opt_bgr, opt_bgri, opt_ps2, opt_stretched);
      td_interlace.appendChild(select_interlace)

      td_checkbox.appendChild(input_checkbox);
      td_img.appendChild(img);

      tr.append(td_checkbox, td_img, td_name, td_width, td_height, td_colors, td_interlace, td_render, td_mipmaps, td_resolution, td_unk1,td_unk2,td_unk3,td_unk4)
      tbody.appendChild(tr);
   }
   
   for (let row = 0; row != buffer.readUInt16LE(0x04); row++) {
      createTableCells(row);
   }

   function readTexture(textureChunk, index) {
      widthEl[index].innerText = buffer.readUint16LE(16 + textureChunk);
      heightEl[index].innerText = buffer.readUint16LE(18 + textureChunk);
      if (buffer.readUint8(20 + textureChunk) == 8) {
         colorsEl[index].selectedIndex = 0;
      } else {
         colorsEl[index].selectedIndex = 1;
      }
      interlaceEl[index].selectedIndex = buffer.readUint8(22 + textureChunk);
      renderEl[index].innerText = buffer.readUint16LE(24 + textureChunk);
      mipmapsEl[index].innerText = buffer.readUint8(26 + textureChunk);
      resolutionEl[index].innerText = buffer.readUint8(28 + textureChunk);
      // let mipmap_1 = buffer.readUint32LE(32 + textureChunk);
      // let mipmap_2 = buffer.readUint32LE(36 + textureChunk);
      let indicesOffset = buffer.readUint32LE(48 + textureChunk);
      let palleteOffset = buffer.readUint32LE(52 + textureChunk);
      unk1El[index].innerText = buffer.readUint8(57 + textureChunk);
      unk2El[index].innerText = buffer.readUint8(58 + textureChunk);
      unk3El[index].innerText = buffer.readUint8(59 + textureChunk);
      unk4El[index].innerText = buffer.readUint8(60 + textureChunk);


  }

  for (let row = 0; row != buffer.readUInt16LE(0x04); row++) {
      readTexture(textureIterator, row);
      textureIterator += 0x30;
  }

   /* ==========================================
       NEW FUNCIONALITY: 
      ========================================== */

   // Save all modified buffer back to file
   saveBtn.addEventListener("click", () => {
      let COMPLETE_BUFFER = Buffer.concat([buffer_initial, buffer_VAG, buffer_audios])
      headerFileSize.value = COMPLETE_BUFFER.length + " bytes";
      fs.writeFileSync(filepath, COMPLETE_BUFFER);
      var saveMessage = document.querySelector(".hide");
      saveMessage.style.display = "block"
      setTimeout(() => {
         saveMessage.style.display = "none"
      }, 2000);
   })

   closeBtn.addEventListener("click", () => {
      fs.closeSync(fd);
      ipcRenderer.send("closeTPLfile");
   })

   ipcRenderer.on("saveAsTPLfileContent", (e, arg) => {
      let COMPLETE_BUFFER = Buffer.concat([buffer_initial, buffer_VAG, buffer_audios]);
      fs.writeFileSync(arg, COMPLETE_BUFFER);
   })
})
