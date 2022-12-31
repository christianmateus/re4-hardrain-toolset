const fs = require("fs");
const { ipcRenderer } = require("electron");
const path = require("path");
const textBox = require("../shared/textBox").module;

/* ===============
    CREATE
   =============== */

// Getting elements
const countEl = document.getElementById("count");
const tbody = document.getElementsByTagName("tbody")[0];
const headerFileName = document.getElementById("header-filename");
const headerFileSize = document.getElementById("header-filesize");
const advancedParameters = document.getElementsByClassName("advanced-parameters");
const contextMenu = document.querySelector(".context-menu");
const menuOption = document.getElementsByClassName("menu-option");

// Const for getting Menu File elements
const openFile = document.getElementById("openTPLfile");
const closeBtn = document.getElementById("closeTPLfile");
const saveBtn = document.getElementById("saveTPLfile");
const saveAsBtn = document.getElementById("saveTPLas");
const quitApp = document.getElementById("quitApp");

// Const for getting Menu Texture elements
const refreshBtn = document.getElementById("refresh-btn");
const addTextureBtn = document.getElementById("add-texture-btn");
const extractBtn = document.getElementById("extract-btn");
const replaceBtn = document.getElementById("replace-btn");
const duplicateBtn = document.getElementById("duplicate-btn");
const deleteBtn = document.getElementById("delete-btn");
const invertBtn = document.getElementById("invert-btn");
const trasnparentBtn = document.getElementById("trasnparent-btn");

// Const for getting Menu Options elements
const showmipmapsCheck = document.getElementById("show-mipmaps-btn");
const showadvancedCheck = document.getElementById("show-advanced-btn");

// Const for getting other Menu elements
const exportAllBtn = document.getElementById("exportAllBtn");
const helpBtn = document.getElementById("help");
const minimizeBtn = document.getElementById("minimize");
const maximizeBtn = document.getElementById("maximize");
const closeWindowBtn = document.getElementById("closeWindow");

// Const for table cells
let widthEl = document.getElementsByClassName("texture-width");
let heightEl = document.getElementsByClassName("texture-height");
let colorsEl = document.getElementsByClassName("select-colors");
let interlaceEl = document.getElementsByClassName("select-interlace");
let renderEl = document.getElementsByClassName("texture-render");
let mipmapsEl = document.getElementsByClassName("texture-mipmaps");
let resolutionEl = document.getElementsByClassName("texture-resolution");
let unk1El = document.getElementsByClassName("texture-unk1");
let unk2El = document.getElementsByClassName("texture-unk2");
let unk3El = document.getElementsByClassName("texture-unk3");
let unk4El = document.getElementsByClassName("texture-unk4");
let count = document.getElementById("total-textures");

// Const for Texture Area elements
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const downloadBtn = document.getElementById("download");

// Menu actions (open/save/quit)
openFile.addEventListener("click", () => {
   ipcRenderer.send("openTPLfile");
   ipcRenderer.send("closeTPLfile");
});

saveAsBtn.addEventListener("click", () => {
   ipcRenderer.send("saveAsTPLfile");
});

quitApp.addEventListener("click", () => {
   ipcRenderer.send("quitApp");
});

// Window menu actions
menuWindow.addEventListener("click", () => {
   ipcRenderer.send("openMainMenu");
});

minimizeBtn.addEventListener("click", () => {
   ipcRenderer.send("minimize");
});

maximizeBtn.addEventListener("click", () => {
   ipcRenderer.send("maximize");
});

closeWindowBtn.addEventListener("click", () => {
   ipcRenderer.send("closeWindow");
});

// Basic funcionalities

helpBtn.addEventListener("click", function () {
   ipcRenderer.send("showHelp");
});

/* ===============
    READ
   =============== */

// Tests


// Global variables
let textureIterator = 0;
let pointerAcumulator = 0;
let selectedRow = ''; // Gets texture row ID

// Getting file path
ipcRenderer.on("tplFileChannel", (e, filepath) => {
   var fd = fs.openSync(filepath); // Opening the file in memory
   var buffer = fs.readFileSync(fd); // Converting file string to buffer (hex)

   // Defining headers
   headerFileSize.value = buffer.length + " bytes"; // Outputing file size to the header
   headerFileName.value = path.basename(filepath); // Outputing file name to the header
   let folderName = path.parse(filepath).name;
   let totalTextures = buffer.at(4);
   count.innerText = totalTextures;

   // Functions
   function createTableCells(index) {
      const tr = document.createElement("tr");
      const td_checkbox = document.createElement("td");
      const input_checkbox = document.createElement("input");
      const td_img = document.createElement("td");
      const canvas = document.createElement("canvas");
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
      canvas.id = `canvas`;
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
      td_render.classList.add("texture-render", "advanced-parameters", "hide");
      td_mipmaps.classList.add("texture-mipmaps", "advanced-parameters", "hide");
      td_resolution.classList.add(
         "texture-resolution",
         "advanced-parameters",
         "hide"
      );
      td_unk1.classList.add("texture-unk1", "advanced-parameters", "hide");
      td_unk2.classList.add("texture-unk2", "advanced-parameters", "hide");
      td_unk3.classList.add("texture-unk3", "advanced-parameters", "hide");
      td_unk4.classList.add("texture-unk4", "advanced-parameters", "hide");

      td_name.innerText = `${index}.tpl`;
      td_name.setAttribute("contenteditable", "true");

      // Bit Depth
      opt_4bit.value = 8;
      opt_4bit.innerText = "4 Bit";
      opt_8bit.value = 9;
      opt_8bit.innerText = "8 Bit";
      select_colors.append(opt_4bit, opt_8bit);
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
      td_interlace.appendChild(select_interlace);

      td_checkbox.appendChild(input_checkbox);
      // td_img.appendChild(canvas);

      tr.append(
         td_checkbox,
         td_img,
         td_name,
         td_width,
         td_height,
         td_colors,
         td_interlace,
         td_render,
         td_mipmaps,
         td_resolution,
         td_unk1,
         td_unk2,
         td_unk3,
         td_unk4
      );
      tbody.appendChild(tr);
   }

   function readTexture(textureChunk, index) {
      widthEl[index].innerText = buffer.readUint16LE(16 + textureChunk);
      heightEl[index].innerText = buffer.readUint16LE(18 + textureChunk);

      // Bit Depth
      if (buffer.readUint8(20 + textureChunk) == 8) {
         colorsEl[index].selectedIndex = 0;
      } else {
         colorsEl[index].selectedIndex = 1;
      }

      interlaceEl[index].selectedIndex = buffer.readUint8(22 + textureChunk);
      renderEl[index].innerText = buffer.readUint16LE(24 + textureChunk);
      mipmapsEl[index].innerText = buffer.readUint8(26 + textureChunk);
      resolutionEl[index].innerText = buffer.readUint16LE(28 + textureChunk);
      // let mipmap_1 = buffer.readUint32LE(32 + textureChunk);
      // let mipmap_2 = buffer.readUint32LE(36 + textureChunk);
      // let indicesOffset = buffer.readUint32LE(48 + textureChunk);
      // let palleteOffset = buffer.readUint32LE(52 + textureChunk);
      unk1El[index].innerText = buffer.readUint8(57 + textureChunk);
      unk2El[index].innerText = buffer.readUint8(58 + textureChunk);
      unk3El[index].innerText = buffer.readUint8(59 + textureChunk);
      unk4El[index].innerText = buffer.readUint8(60 + textureChunk);
   }

   function exportSingleTexture(Singlechunk) {
      // Creates a Header for TPL count
      let mainHeader = Buffer.alloc(16, "00100000010000001000000000000000", "hex");
      let header;
      let indices;
      let pallete;
      let bufferComplete;

      if (Singlechunk != buffer.readUInt16LE(0x04)) {
         header = buffer.subarray(16 + (48 * Singlechunk), 16 + (48 * Singlechunk) + 48);
         indices = buffer.subarray(header.readUint32LE(32), header.readUint32LE(36));

         // Check if user does not want mipmap header bytes
         // if (!includeMipmapCheckboxEl.checked) {
         //    header.writeUint8(0, 10);
         //    header.writeUint32LE(0, 16);
         //    header.writeUint32LE(0, 20);
         //    header.writeUint32LE(0, 24);
         //    header.writeUint32LE(0, 28);
         // }

         // Check bit-depth and gets pallete bytes
         if (header.at(4) == 8) {
            pallete = buffer.subarray(buffer.readUint32LE(52), buffer.readUint32LE(52) + 128);
         } else if (header.at(4) == 9) {
            pallete = buffer.subarray(buffer.readUint32LE(52), buffer.readUint32LE(52) + 394);
         }

         bufferComplete = Buffer.concat([mainHeader, header, indices, pallete]);
         bufferComplete.writeUint32LE(64, 48); // Writes 40 00 00 00 to the texture pointer

         // Update pallete pointers
         if (bufferComplete.readUint8(20) == 8) {
            bufferComplete.writeUint32LE(bufferComplete.length - 128, 52);
         } else if (bufferComplete.readUint8(20) == 9) {
            bufferComplete.writeUint32LE(bufferComplete.length - 394, 52);
         }

         textBox("Texture exported successfully!", "green");
         Singlechunk = 0;
         return bufferComplete;
      } else {
         console.log("Algo deu erro");
         return;
      }
   }

   function exportTexture(chunk) {
      // Creates a Header for TPL count
      let mainHeader = Buffer.alloc(16, "00100000010000001000000000000000", "hex");
      let header;
      let indices;
      let pallete;
      let bufferComplete;

      if (chunk != buffer.readUInt16LE(0x04)) {
         header = buffer.subarray(16 + (48 * chunk), 16 + (48 * chunk) + 48);
         indices = buffer.subarray(header.readUint32LE(32), header.readUint32LE(36));

         // Check if user does not want mipmap header bytes
         // if (!includeMipmapCheckboxEl.checked) {
         //   header.writeUint8(0, 10);
         //   header.writeUint32LE(0, 16);
         //   header.writeUint32LE(0, 20);
         //   header.writeUint32LE(0, 24);
         //   header.writeUint32LE(0, 28);
         // }

         // Check bit-depth and gets pallete bytes
         if (colorsEl[chunk].selectedIndex == 0) {
            pallete = buffer.subarray(
               buffer.readUint32LE(52),
               buffer.readUint32LE(52) + 128
            );
         } else if (colorsEl[chunk].selectedIndex == 1) {
            pallete = buffer.subarray(
               buffer.readUint32LE(52),
               buffer.readUint32LE(52) + 394
            );
         }

         bufferComplete = Buffer.concat([mainHeader, header, indices, pallete]);
         bufferComplete.writeUint32LE(64, 48); // Writes 40 00 00 00 to the texture pointer

         // Update pallete pointers
         if (bufferComplete.readUint8(20) == 8) {
            bufferComplete.writeUint32LE(bufferComplete.length - 128, 52);
         } else if (bufferComplete.readUint8(20) == 9) {
            bufferComplete.writeUint32LE(bufferComplete.length - 394, 52);
         }

         textBox("All textures exported successfully!", "green");
         return bufferComplete;
      } else {
         console.log("Deu zero");
         return;
      }
   }

   function importNewTexture() {
      ipcRenderer.send("addNewTPLBtn");
   };

   function duplicateTexture() {
      let iterator = 0;
      let chunk = 0x30 * Number(selectedRow.substring(3));
      let temp_header = buffer.subarray(0x10 + chunk, (0x10 + chunk) + 0x30); // Creates a temporary header for copying (avoids both buffers being edited)
      let header = Buffer.from(temp_header);
      let paletteSize = 0;
      if (header.at(4) == 8) { paletteSize = 128; } else { paletteSize = 1024; } // 128 for 4-bit, 1024 for 8-bit
      let pixels = buffer.subarray(buffer.readUint32LE(0x30 + chunk), buffer.readUint32LE(0x34 + chunk));
      let palette = buffer.subarray(buffer.readUint32LE(0x34 + chunk), buffer.readUint32LE(0x34 + chunk) + paletteSize);

      let complete_mainHeader = buffer.subarray(0, 0x10);
      let complete_textureHeader = buffer.subarray(0x10, (0x30 * complete_mainHeader.readUint8(4)) + 0x10);
      let complete_mipMapHeader = buffer.subarray((0x30 * complete_mainHeader.readUint8(4)) + 16, buffer.readUint32LE(0x30))
      let complete_indicesAndPallete = buffer.subarray(buffer.readUint32LE(0x30));

      // Updates new texture header pointers before inserting
      header.writeUint32LE(buffer.length + 48, 0x20);

      // Check bit depth and updates palette pointer
      if (header.readUint8(4) == 8) {
         console.log("4-bit texture");
         header.writeUint32LE((buffer.length + pixels.length + 0x30), 0x24);
      } else {
         console.log("8-bit texture");
         header.writeUint32LE((buffer.length + pixels.length + 0x30), 0x24);
      }

      // Add new texture header to the end of headers area and updates every pointer by +48
      complete_indicesAndPallete = Buffer.concat([complete_indicesAndPallete, pixels, palette]);

      // Updates every pointer by +48
      for (let i = 0; i != complete_mainHeader.readUint8(4); i++) {
         complete_textureHeader.writeUint32LE(complete_textureHeader.readUint32LE(0x20 + iterator) + 0x30, 0x20 + iterator)
         complete_textureHeader.writeUint32LE(complete_textureHeader.readUint32LE(0x24 + iterator) + 0x30, 0x24 + iterator)
         if (complete_textureHeader.readUint32LE(16 + iterator) > 0) {
            complete_textureHeader.writeUint32LE(complete_textureHeader.readUint32LE(0x10 + iterator) + 0x30, 0x10 + iterator)
            complete_textureHeader.writeUint32LE(complete_textureHeader.readUint32LE(0x14 + iterator) + 0x30, 0x14 + iterator)
         }
         iterator += 0x30;
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
      complete_textureHeader = Buffer.concat([complete_textureHeader, header, complete_mipMapHeader]);
      buffer = Buffer.concat([complete_mainHeader, complete_textureHeader, complete_indicesAndPallete]);

      textBox("Texture duplicated at the end of the file!", "green");
      count.innerText = Number(count.innerText) + 1;

      // Rebuilds the table to update values
      tbody.innerHTML = "";
      for (let row = 0; row != buffer.readUInt16LE(0x04); row++) {
         createTableCells(row);
      }
      textureIterator = 0;
      for (let row = 0; row != buffer.readUInt16LE(0x04); row++) {
         readTexture(textureIterator, row);
         textureIterator += 0x30;
      }
      // fs.closeSync(textureFD);
      // fs.writeFileSync(`TPL/duplicatedTexture.tpl`, buffer_textures);

   };

   function refreshTable() {
      for (let row = 0; row != buffer.readUInt16LE(0x04); row++) {
         createTableCells(row);
      }

      for (let row = 0; row != buffer.readUInt16LE(0x04); row++) {
         readTexture(textureIterator, row);
         textureIterator += 0x30;
      }
   };

   // Executed on Starting
   for (let row = 0; row != buffer.readUInt16LE(0x04); row++) {
      createTableCells(row);
   }

   for (let row = 0; row != buffer.readUInt16LE(0x04); row++) {
      readTexture(textureIterator, row);
      textureIterator += 0x30;
   }

   // ============= Event Listeners =============
   exportAllBtn.addEventListener("click", function () {
      fs.mkdirSync(`TPL/${folderName}`, { recursive: true });
      for (let i = 0; i != buffer.readUInt16LE(0x04); i++) {
         fs.writeFileSync(`TPL/${folderName}/${i}.tpl`, exportTexture(i));
      }
   });

   showadvancedCheck.addEventListener("change", function () {
      if (this.checked) {
         for (let index = 0; index < advancedParameters.length; index++) {
            advancedParameters[index].classList.remove("hide");
         }
      } else {
         for (let index = 0; index < advancedParameters.length; index++) {
            advancedParameters[index].classList.add("hide");
         }
      }
   });

   // REFRESH TABLE
   refreshBtn.addEventListener("click", function () {
      refreshTable();
   });

   // EXTRACT TEXTURE
   extractBtn.addEventListener("click", function () {
      if (selectedRow == "") {
         ipcRenderer.send("error-no-texture-selected");
         return;
      }
      if (!fs.existsSync(`TPL/${folderName}`)) {
         fs.mkdirSync(`TPL/${folderName}`, { recursive: true });
      }
      fs.writeFileSync(`TPL/${folderName}/${selectedRow.substring(3)}.tpl`, exportSingleTexture(selectedRow.substring(3)));
   });

   // REPLACE TEXTURE
   replaceBtn.addEventListener("click", function () {
      if (selectedRow == "") {
         ipcRenderer.send("error-no-texture-selected");
         return;
      }
      ipcRenderer.send("replace-texture-open");
   });

   ipcRenderer.on("replace-texture-file", function (e, filepath) {
      if (filepath != undefined && filepath != '') {
         let importedTexture = fs.readFileSync(filepath);

         // Verifies if it's a valid TPL with 1 single texture
         if (importedTexture.at(4) > 1) {
            ipcRenderer.send("error-multiple-textures");
            return;
         }

         // Splitting the imported file in Header, Pixels and Palette
         let importedTextureHeader = importedTexture.subarray(0x10, 0x40);
         let importedTexturePixels = importedTexture.subarray(0x40, importedTextureHeader.readUint32LE(0x24));
         let importedTexturePalette = importedTexture.subarray(importedTextureHeader.readUint32LE(0x24));

         // New Params
         let newWidth = importedTextureHeader.readUint16LE(0x00);
         let newHeight = importedTextureHeader.readUint16LE(0x02);

         // Splitting the old texture in Header, Bit Depth, Pixels nd Palette
         let oldTextureHeader = buffer.subarray(0x10 + (0x30 * Number(selectedRow.substring(3))), 0x10 + (0x30 * Number(selectedRow.substring(3))) + 0x30);
         let oldTexturePixels = buffer.subarray(0x40 + (0x30 * Number(selectedRow.substring(3))), oldTextureHeader.readUint32LE(0x24));
         let bitDepth = 0;
         if (oldTextureHeader.at(4) == 8) { bitDepth = 0x80; } else { bitDepth = 0x400 };
         let oldTexturePalette = buffer.subarray(oldTextureHeader.readUint32LE(0x24), oldTextureHeader.readUint32LE(0x24) + bitDepth);

         // Old Params
         let oldWidth = oldTextureHeader.readUint16LE(0x00);
         let oldHeight = oldTextureHeader.readUint16LE(0x02);

         // Verifies if width or height changed
         if (newWidth != oldWidth || newHeight != oldHeight) {
            // ipcRenderer.send("texture-different-resolution");
         }

         let buffer_top = buffer.subarray(0x00, buffer.readUint32LE(0x30 + (0x30 * Number(selectedRow.substring(3)))));
         let buffer_down = buffer.subarray(buffer.readUint32LE(0x30 + (0x30 * Number(selectedRow.substring(3) + 1))));
         let buffer_complete = Buffer.concat([buffer_top, importedTexturePixels, importedTexturePalette, buffer_down]); // Replacing old texture

         buffer_complete.writeUint16LE(importedTextureHeader.readUint16LE(0x00), 0x10 + (0x30 * Number(selectedRow.substring(3)))); // Width
         buffer_complete.writeUint16LE(importedTextureHeader.readUint16LE(0x02), 0x12 + (0x30 * Number(selectedRow.substring(3)))); // Height
         buffer_complete.writeUint8(importedTextureHeader.readUint8(0x04), 0x14 + (0x30 * Number(selectedRow.substring(3)))); // Bit Depth
         buffer_complete.writeUint8(importedTextureHeader.readUint8(0x06), 0x16 + (0x30 * Number(selectedRow.substring(3)))); // Interlace
         buffer_complete.writeUint16LE(importedTextureHeader.readUint16LE(0x08) * 2, 0x18 + (0x30 * Number(selectedRow.substring(3)))); // Render
         // buffer_complete.writeUint8(importedTextureHeader.readUint8(0x0A), 0x1A + (0x30 * Number(selectedRow.substring(3)))); // Mipmaps
         buffer_complete.writeUint16LE(importedTextureHeader.readUint16LE(0x0C) * 2, 0x1C + (0x30 * Number(selectedRow.substring(3)))); // Multiplied Resolution
         buffer_complete.writeUint32LE(buffer_complete.readUint32LE(0x30 + (0x30 * Number(selectedRow.substring(3)))) + (newWidth * newHeight) + 16, 0x34 + (0x30 * Number(selectedRow.substring(3))));

         // Get mipmap quantity
         let mipmapCount = 0;
         for (let texture = 0; texture != totalTextures; texture++) {
            mipmapCount += buffer_complete.readUint8(0x0A + (buffer_complete.readUint8(0x0A + (0x30 * texture))));
         }

         // Update pointers
         for (let pointer = 0; pointer != totalTextures + mipmapCount; pointer++) {
            let width = buffer_complete.readUint16LE(0x10 + (0x30 * pointer));
            let height = buffer_complete.readUint16LE(0x12 + (0x30 * pointer));
            let bitDepth = buffer_complete.readUint8(0x14 + (0x30 * pointer));
            let chunk = 0x30 * Number(selectedRow.substring(3));
            let firstTextureOffset = 48 * (totalTextures + mipmapCount) + 16;
            let tempPixelsPointer = buffer_complete.readUint32LE(0x30 + chunk);
            let tempPalettePointer = buffer_complete.readUint32LE(0x34 + chunk);

            // Updating pixels and palette pointers
            if (pointer == 0) {
               buffer_complete.writeUint32LE(firstTextureOffset, 0x30);
               buffer_complete.writeUint32LE(firstTextureOffset + ((width * height) / 2), 0x34);
            } else {
               if (bitDepth == 8) {
                  console.log("4 bit");
                  buffer_complete.writeUint32LE(buffer_complete.readUint32LE(0x34 + (chunk - 1)) + 128, 0x30 + chunk);
                  buffer_complete.writeUint32LE(buffer_complete.readUint32LE(0x30 + chunk) + ((width * height) / 2), 0x34 + chunk);
               } else {
                  buffer_complete.writeUint32LE(buffer_complete.readUint32LE(0x30 + chunk) + (width * height), 0x34 + chunk);
                  console.log("8 bit");
                  console.log(buffer_complete.readUint32LE(0x30 + chunk) + (width * height));
                  buffer_complete.writeUint32LE(buffer_complete.readUint32LE(0x34 + (chunk - 1)) + 1024, 0x30 + chunk);
               }
               // buffer_complete.writeUint32LE((width * height) + firstTextureOffset, 0x30 * Number(selectedRow.substring(3)));
            }
            pointerAcumulator += 0x30;
         }

         fs.writeFileSync(`TPL/file.tpl`, buffer_complete);

      } else {
         console.log("No file selected for replacing.");
         return;
      }
   });

   // ADD NEW TEXTURE
   addTextureBtn.addEventListener("click", function () {
      importNewTexture();
   });

   ipcRenderer.on("addTPLtexture", function (e, filepath) {
      let addNewTextureBuffer = Buffer.alloc(0);
      let iterator = 0;
      let mipMapCount = 0;
      addNewTextureBuffer = fs.readFileSync(filepath);

      let fileHeader = addNewTextureBuffer.subarray(0, 16);
      let textureHeader = addNewTextureBuffer.subarray(16, 64);
      let indices = addNewTextureBuffer.subarray(64, addNewTextureBuffer.readUint32LE(52));
      let pallete = addNewTextureBuffer.subarray(addNewTextureBuffer.readUint32LE(52));

      let complete_mainHeader = buffer.subarray(0, 16);
      let complete_textureHeader = buffer.subarray(16, (48 * complete_mainHeader.readUint8(4)) + 16);
      let complete_mipMapHeader = buffer.subarray((48 * complete_mainHeader.readUint8(4)) + 16, buffer.readUint32LE(48))
      let complete_indicesAndPallete = buffer.subarray(buffer.readUint32LE(48));

      // Updates new texture header pointers before inserting
      textureHeader.writeUint32LE(buffer.length + 48, 32);

      // Removing MipMaps
      textureHeader.writeUint8(0, 10);

      // Check bit depth
      if (textureHeader.readUint8(4) == 8) {
         console.log("4-bit texture");
         textureHeader.writeUint32LE((buffer.length + indices.length + 48), 36);
      } else {
         console.log("8-bit texture");
         textureHeader.writeUint32LE((buffer.length + indices.length + 48), 36);
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
      count.innerText = Number(count.innerText) + 1;
      textBox("New texture added sucessfully!", "green");
      // fs.closeSync(textureFD);
      fs.writeFileSync(`TPL/addnewtexture.tpl`, buffer_textures);
   });

   // DUPLICATE TEXTURE
   duplicateBtn.addEventListener("click", function () {
      if (selectedRow == "") {
         ipcRenderer.send("error-no-texture-selected");
         return;
      }
      duplicateTexture();
   });

   downloadBtn.addEventListener("click", function () {
      var image = document.getElementById("canvas").toDataURL("image/png")
         .replace("image/png", "image/octet-stream");
      download.setAttribute("href", image);
   })

   /* ==========================================
        NEW FUNCIONALITY: Context Menu
       ========================================== */

   // Context Menu
   tbody.addEventListener("contextmenu", function (e) {
      e.preventDefault();
      contextMenu.style.top = e.pageY + "px";
      contextMenu.style.left = e.pageX + "px";
      contextMenu.classList.add("context-menu-active");
      let rows = Array.from(tbody.children);
      rows.forEach(function (element, index, array) {
         element.classList.remove("selected");
      });
      if (e.target.parentNode.tagName == "TR") {
         selectedRow = e.target.parentNode.id;
         e.target.parentNode.classList.add("selected");
      } else {
         selectedRow = e.target.parentNode.parentNode.id;
         e.target.parentNode.parentNode.classList.add("selected");
      }
   });

   tbody.addEventListener("click", function (e) {
      let rows = Array.from(tbody.children);
      rows.forEach(function (element, index, array) {
         element.classList.remove("selected");
      });
      if (e.target.parentNode.tagName == "TR") {
         selectedRow = e.target.parentNode.id;
         e.target.parentNode.classList.add("selected");
         renderTexture8bit();
         render4BitTpl()
      } else {
         selectedRow = e.target.parentNode.parentNode.id;
         renderTexture8bit();
         render4BitTpl()
         e.target.parentNode.parentNode.classList.add("selected");
      }
   });

   window.addEventListener("click", function (e) {
      contextMenu.classList.remove("context-menu-active");
   })

   // Extract texture
   menuOption[0].addEventListener("click", function () {
      if (!fs.existsSync(`TPL/${folderName}`)) {
         fs.mkdirSync(`TPL/${folderName}`, { recursive: true });
      }
      fs.writeFileSync(`TPL/${folderName}/${selectedRow.substring(3)}.tpl`, exportSingleTexture(selectedRow.substring(3)));
   });

   // Replace texture
   menuOption[1].addEventListener("click", function () {
      ipcRenderer.send("replace-texture-open");
   });

   // Duplicate texture
   menuOption[2].addEventListener("click", function () {
      duplicateTexture();
   });

   /* ==========================================
       NEW FUNCIONALITY: Render textures
      ========================================== */

   function renderTexture8bit() {
      let chunk = 0x30 * Number(selectedRow.substring(3));
      let width = buffer.readUint16LE(0x10 + chunk);
      let height = buffer.readUint16LE(0x12 + chunk);
      let pointerPallete = buffer.readUint32LE(0x34 + chunk);
      let pixelsStart = 0x40;
      let imageData = ctx.createImageData(width, height);
      canvas.width = width;
      canvas.height = height;

      // Loop for 8-bit images
      for (let i = 0; i < imageData.data.length; i += 4) {
         // Reads RGBA for every indice
         imageData.data[i + 0] = buffer.readUint8(pointerPallete + (buffer.readUint8(pixelsStart + chunk))) // R value
         imageData.data[i + 1] = buffer.readUint8(pointerPallete + (buffer.readUint8(pixelsStart + chunk)) + 1) // G value
         imageData.data[i + 2] = buffer.readUint8(pointerPallete + (buffer.readUint8(pixelsStart + chunk)) + 2) // B value
         imageData.data[i + 3] = 255;
         pixelsStart++; // Moves to next indice
      }

      ctx.putImageData(imageData, 0, 0);
   };
   // renderTexture8bit();

   function render4BitTpl() {
      let chunk = 0x30 * Number(selectedRow.substring(3));
      let interlace = buffer.readUint8(0x16 + chunk)
      let indicesOffset = buffer.readUint32LE(0x30 + chunk);
      let indicesIterator = 0;
      let padding = 0;
      let width = buffer.readUint16LE(0x10 + chunk);
      let height = buffer.readUint16LE(0x12 + chunk);
      let pointerPallete = buffer.readUint32LE(0x34 + chunk);
      let imageData = ctx.createImageData(width, height);
      canvas.width = width;
      canvas.height = height;

      if (interlace == 0 || interlace == 1 || interlace == 2) {
         indicesIterator = 0
         // Loop for 4-bit images
         for (let i = 0; i < imageData.data.length; i += 4) {
            let higherbyte = buffer.readUint8(indicesOffset + ~~(indicesIterator / 2)) & 0x0F; // Gets second part of first byte, the offset is divided by 2 and returns integer
            let lowerbyte = buffer.readUint8(indicesOffset + ~~(indicesIterator / 2)) >> 4; // Gets first part of first byte, the offset is divided by 2 and returns integer

            // Adds padding of 32 bytes if texture byte is higher than 8
            if (higherbyte > 7) {
               padding = 32;
            } else {
               padding = 0
            }
            // Creates pixels in the canvas
            imageData.data[i + 0] = buffer.readUint8(pointerPallete + padding + (4 * higherbyte)) // R value
            imageData.data[i + 1] = buffer.readUint8(pointerPallete + padding + (4 * higherbyte + 1)) // G value
            imageData.data[i + 2] = buffer.readUint8(pointerPallete + padding + (4 * higherbyte + 2)) // B value
            imageData.data[i + 3] = 255; // Alpha value

            // Adds padding of 32 bytes if texture byte is higher than 8
            if (lowerbyte > 7) {
               padding = 32;
            } else {
               padding = 0
            }
            // Creates pixels in the canvas
            imageData.data[i + 0] = buffer.readUint8(pointerPallete + padding + (4 * lowerbyte)) // R value
            imageData.data[i + 1] = buffer.readUint8(pointerPallete + padding + (4 * lowerbyte + 1)) // G value
            imageData.data[i + 2] = buffer.readUint8(pointerPallete + padding + (4 * lowerbyte + 2)) // B value
            imageData.data[i + 3] = 255; // Alpha value

            indicesIterator++; // Moves to next indice
         }
         ctx.putImageData(imageData, 0, 0);
      }
   }
   render4BitTpl();

   // Save all modified buffer back to file
   saveBtn.addEventListener("click", () => {
      headerFileSize.value = buffer.length + " bytes";
      fs.writeFileSync(filepath, buffer);
      var saveMessage = document.querySelector(".hide");
      saveMessage.style.display = "block";
      setTimeout(() => {
         saveMessage.style.display = "none";
      }, 2000);
   });

   closeBtn.addEventListener("click", () => {
      fs.closeSync(fd);
      ipcRenderer.send("closeTPLfile");
   });

   ipcRenderer.on("saveAsTPLfileContent", (e, arg) => {
      let buffer = Buffer.concat([
         buffer_initial,
         buffer_VAG,
         buffer_audios,
      ]);
      fs.writeFileSync(arg, buffer);
   });
});
