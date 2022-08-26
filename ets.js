const fs = require('fs');
const { ipcRenderer } = require('electron');

// Const for testing text output (DEBUG)
const textarea = document.getElementById("testes");

/* ===============
    CREATE
   =============== */

// Getting elements
var countEl = document.getElementById("count");
var numberSequential = document.querySelector(".number-sequential");
var imageEl = document.querySelector(".imageEl");
var selectList = document.querySelector(".objectList");
var indexEl = document.querySelector(".index");
var posX = document.querySelector(".posX");
var posY = document.querySelector(".posY");
var posZ = document.querySelector(".posZ");
var rotX = document.querySelector(".rotX");
var rotY = document.querySelector(".rotY");
var rotZ = document.querySelector(".rotZ");

// Getting elements for cloneRow function
var table = document.querySelector("table");
var tBody = document.querySelector("tbody");
var row = document.querySelector(".tableRow");

// Const for getting Menu elements
const openaFile = document.getElementById("openETSfile")
const closeBtn = document.getElementById("closeETSfile")
const saveAsBtn = document.getElementById("saveETSas")
const quitApp = document.getElementById("quitApp")
const minimizeBtn = document.getElementById("minimize")
const maximizeBtn = document.getElementById("maximize")
const closeWindowBtn = document.getElementById("closeWindow")

// Menu actions (open/save/quit)
openaFile.addEventListener("click", () => {
    ipcRenderer.send("openETSfile")
})

quitApp.addEventListener("click", () => {
    ipcRenderer.send("quitApp")
})


/* ===============
    READ
   =============== */

// Global variables
var chunk = 0; // Will be incremented in each chunk
var seq = 1; // Slot for item number

// Getting file path
ipcRenderer.on("etsFileChannel", (e, filepath) => {

    var fd = fs.openSync(filepath); // Opening the file in memory
    var buffer = fs.readFileSync(fd); // Converting file string to buffer (hex)

    let total_obj = buffer.readUInt8(0); // Reading number of objects
    countEl.setAttribute("value", total_obj);

    // Reading table data
    for (i = 0; i < total_obj; i++) {
        numberSequential.innerText = 1;

        // Reading object ID
        var getObjId = buffer.readUint8(64);
        selectList.selectedIndex = getObjId;
        imageEl.setAttribute("src", `./images/obj/${getObjId}.png`)

        // Reading index byte
        var getIndex = buffer.readUint8(66)
        indexEl.setAttribute("value", getIndex);

        // Reading position X
        var getPosX = buffer.readFloatLE(48).toFixed(2);
        posX.innerText = getPosX;

        // Reading position Y
        var getPosY = buffer.readFloatLE(52).toFixed(2);
        posY.innerText = getPosY;

        // Reading position Z
        var getPosZ = buffer.readFloatLE(56).toFixed(2);
        posZ.innerText = getPosZ;

        // ROTATION
        // Reading rotation X
        var getRotX = buffer.readFloatLE(32).toFixed(2);
        rotX.innerText = getRotX;

        // Reading rotation Y
        var getRotY = buffer.readFloatLE(36).toFixed(2);
        rotY.innerText = getRotY;

        // Reading rotation Z
        var getRotZ = buffer.readFloatLE(40).toFixed(2);
        rotZ.innerText = getRotZ;


        cloneRow();
    }

    function cloneRow() {
        let clone = row.cloneNode(true); // Cloning row
        chunk = chunk + 64; // Reading next chunks
        seq++; // Slot for item number

        let cloneSeq = clone.querySelector(".number-sequential");
        cloneSeq.innerText = seq;

        // Getting object ID and image
        let cloneId = clone.querySelector(".objectList");
        let cloneImage = clone.querySelector(".imageEl")
        var getCloneObjId = buffer.readUint8(64 + chunk);
        cloneId.selectedIndex = getCloneObjId;
        cloneImage.setAttribute("src", `./images/obj/${getCloneObjId}.png`)

        // Getting index 
        let cloneIndex = clone.querySelector(".index");
        let getCloneIndex = buffer.readUint8(66 + chunk);
        cloneIndex.setAttribute("value", getCloneIndex);

        // Getting POSITION coordinates
        let clonePosX = clone.querySelector(".posX");
        let getClonePosX = buffer.readFloatLE(48 + chunk).toFixed(2);
        clonePosX.innerText = getClonePosX;

        let clonePosY = clone.querySelector(".posY");
        let getClonePosY = buffer.readFloatLE(52 + chunk).toFixed(2);
        clonePosY.innerText = getClonePosY;

        let clonePosZ = clone.querySelector(".posZ");
        let getClonePosZ = buffer.readFloatLE(56 + chunk).toFixed(2);
        clonePosZ.innerText = getClonePosZ;

        // Getting ROTATION coordinates
        let cloneRotX = clone.querySelector(".rotX");
        let getCloneRotX = buffer.readFloatLE(32 + chunk).toFixed(2);
        cloneRotX.innerText = getCloneRotX;

        let cloneRotY = clone.querySelector(".rotY");
        let getCloneRotY = buffer.readFloatLE(36 + chunk).toFixed(2);
        cloneRotY.innerText = getCloneRotY;

        let cloneRotZ = clone.querySelector(".rotZ");
        let getCloneRotZ = buffer.readFloatLE(40 + chunk).toFixed(2);
        cloneRotZ.innerText = getCloneRotZ;

        tBody.appendChild(clone); // Appending row to the end of table
    }
});










/* ===============
    Write
   =============== */
