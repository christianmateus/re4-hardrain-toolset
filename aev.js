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
var indexEl = document.querySelector(".index");
var cellExpand = document.querySelector(".event-bar");
var eventBox = document.querySelector(".event-box");

// Getting elements for cloneRow function
var table = document.querySelector("table");
var tBody = document.querySelector("tbody");
var row = document.querySelector(".tableRow");

// Const for getting Menu elements
const openFile = document.getElementById("openAEVfile");
const closeBtn = document.getElementById("closeAEVfile");
const saveBtn = document.getElementById("saveAEVfile");
const saveAsBtn = document.getElementById("saveAEVas");
const quitApp = document.getElementById("quitApp");
const minimizeBtn = document.getElementById("minimize");
const maximizeBtn = document.getElementById("maximize");
const closeWindowBtn = document.getElementById("closeWindow");

// Menu actions (open/save/quit)
openFile.addEventListener("click", () => {
    ipcRenderer.send("openETSfile")
    ipcRenderer.send("closeETSfile")
})

saveAsBtn.addEventListener("click", () => {
    ipcRenderer.send("saveAsETSfile")
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

cellExpand.addEventListener("click", () => {

    if (eventBox.classList.contains("hide")) {
        eventBox.classList.remove("hide");
    } else {
        eventBox.classList.add("hide");
    }
})

/* ===============
    READ
   =============== */

// Global variables
var chunk = 0; // Will be incremented in each chunk
var seq = 1; // Slot for item number
var select_id = 2; // Add a new id for each select (used in cloneRow())
var index_id = 2; // Add a new id for each index (used in cloneRow())
var posX_id = 2; // Add a new id for each posX (used in cloneRow())
var posY_id = 2; // Add a new id for each posX (used in cloneRow())
var posZ_id = 2; // Add a new id for each posX (used in cloneRow())
var rotX_id = 2; // Add a new id for each posX (used in cloneRow())
var rotY_id = 2; // Add a new id for each posX (used in cloneRow())
var rotZ_id = 2; // Add a new id for each posX (used in cloneRow())

// Getting file path
ipcRenderer.on("etsFileChannel", (e, filepath) => {

    var fd = fs.openSync(filepath); // Opening the file in memory
    var buffer = fs.readFileSync(fd); // Converting file string to buffer (hex)

    let total_obj = buffer.readUInt8(0); // Reading number of objects
    countEl.setAttribute("value", total_obj);

    // Reading table data
    for (i = 1; i != total_obj; i++) {
        numberSequential.innerText = 1;

        cloneRow();
    }

    function cloneRow() {
        let clone = row.cloneNode(true); // Cloning row
        chunk = chunk + 64; // Reading next chunks
        seq++; // Slot for item number
        // select_id++;

        let cloneSeq = clone.querySelector(".number-sequential");
        cloneSeq.innerText = seq;

        tBody.appendChild(clone); // Appending row to the end of table

    }


    /* ===============
        UPDATE
       =============== */

    // Getting object ID and image
    tBody.addEventListener("change", function (e) {
        if (e.target.className == "objectList") {
            // Gets value from select/option and sets to buffer
            var select_number = e.target.id; // Get clicked select ID attribute
            var select_opt = e.target.selectedIndex; // Get *option* selected from the clicked select
            var chunk_save = 64 * (parseInt(select_number) - 1); // Multiply chunk size by select ID number

            // Using the same class name for every image and using the *option* selected value as the index
            var imageChanger = document.getElementsByClassName("imageEl")[parseInt(select_number) - 1];
            buffer.writeUint8(select_opt, 64 + chunk_save); // Writes data on buffer on every hange
            imageChanger.setAttribute("src", `./images/obj/${select_opt}.png`);
        }
        if (e.target.className == "index") {
            // Gets value from index input and sets to buffer
            var setIndex = e.target.value;
            var setIndexId = e.target.id;
            var chunk_save = 64 * (parseInt(setIndexId) - 1);
            if (setIndex <= 255) {
                buffer.writeUint8(setIndex, 66 + chunk_save);
                document.getElementsByClassName("index")[parseInt(setIndexId) - 1].style.color = "#000";
                document.getElementsByClassName("index")[parseInt(setIndexId) - 1].style.outline = "none";
            } else {
                document.getElementsByClassName("index")[parseInt(setIndexId) - 1].style.color = "red";
                document.getElementsByClassName("index")[parseInt(setIndexId) - 1].style.outline = "1px solid red";
            }
        }
        if (e.target.className == "posX") {
            // Gets value from posX and sets to buffer
            var setPosX = e.target.value;
            var setPosXid = e.target.id;
            var chunk_save = 64 * (parseInt(setPosXid) - 1);
            buffer.writeFloatLE(setPosX, 48 + chunk_save).toFixed(2);

        }
        if (e.target.className == "posY") {
            // Gets value from posY and sets to buffer
            var setPosY = e.target.value;
            var setPosYid = e.target.id;
            var chunk_save = 64 * (parseInt(setPosYid) - 1);
            buffer.writeFloatLE(setPosY, 52 + chunk_save).toFixed(2);

        }
        if (e.target.className == "posZ") {
            // Gets value from posY and sets to buffer
            var setPosZ = e.target.value;
            var setPosZid = e.target.id;
            var chunk_save = 64 * (parseInt(setPosZid) - 1);
            buffer.writeFloatLE(setPosZ, 56 + chunk_save).toFixed(2);

        }
        if (e.target.className == "rotX") {
            // Gets value from rotX and sets to buffer
            var setRotX = e.target.value;
            var setRotXid = e.target.id;
            var chunk_save = 64 * (parseInt(setRotXid) - 1);
            buffer.writeFloatLE(setRotX, 32 + chunk_save).toFixed(2);

        }
        if (e.target.className == "rotY") {
            // Gets value from rotY and sets to buffer
            var setRotY = e.target.value;
            var setRotYid = e.target.id;
            var chunk_save = 64 * (parseInt(setRotYid) - 1);
            buffer.writeFloatLE(setRotY, 36 + chunk_save).toFixed(2);

        }
        if (e.target.className == "rotZ") {
            // Gets value from rotZ and sets to buffer
            var setRotZ = e.target.value;
            var setRotZid = e.target.id;
            var chunk_save = 64 * (parseInt(setRotZid) - 1);
            buffer.writeFloatLE(setRotZ, 40 + chunk_save).toFixed(2);

        }
    })


    // Save all modified buffer back to file

    saveBtn.addEventListener("click", () => {
        fs.writeFileSync(filepath, buffer);
        var saveMessage = document.querySelector(".hide");
        saveMessage.style.display = "block"
        setTimeout(() => {
            saveMessage.style.display = "none"
        }, 2000);
    })

    // NEEDS FIX!!
    closeBtn.addEventListener("click", () => {
        ipcRenderer.send("closeETSfile");
    })

    ipcRenderer.on("saveAsETSfileContent", (e, arg) => {
        fs.writeFileSync(arg, buffer);
    })
});

