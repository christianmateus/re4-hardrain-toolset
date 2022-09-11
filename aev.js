const fs = require('fs');
const { ipcRenderer } = require('electron');
const { devNull } = require('os');

// Const for testing text output (DEBUG)
const textarea = document.getElementById("testes");

/* ===============
    CREATE
   =============== */

// Getting elements
var countEl = document.getElementById("count");
var numberSequential = document.querySelector(".number-sequential");
var indexEl = document.querySelector(".index");
var cellExpand = document.querySelector(".event-bar"); // Cell title w/ event name
var eventBox = document.querySelector(".event-box"); // Cell content: main & extra
var extraConfig = document.getElementsByClassName("extra-config");

// Getting elements from Main Config
var eventIdSelect = document.querySelector(".selectEventName")
var unk1El = document.querySelector("#unk1");
var unk2El = document.querySelector("#unk2");
var unk3El = document.querySelector("#unk3");
var canvasEl = document.querySelector(".main-canvas");
var topLeftXEl = document.querySelector(".top-leftX");
var topLeftZEl = document.querySelector(".top-leftZ");
var topRightXEl = document.querySelector(".top-rightX");
var topRightZEl = document.querySelector(".top-rightZ");
var bottomLeftXEl = document.querySelector(".bottom-leftX");
var bottomLeftZEl = document.querySelector(".bottom-leftZ");
var bottomRightXEl = document.querySelector(".bottom-rightX");
var bottomRightZEl = document.querySelector(".bottom-rightZ");
var lowerLimitEl = document.querySelector(".lower-limit");
var higherLimitEl = document.querySelector(".higher-limit");

// Getting elements from event types
var type0 = document.querySelector(".type0");
var type1 = document.querySelector(".type1");
var type2 = document.querySelector(".type2");
var type4 = document.querySelector(".type4");
var type5 = document.querySelector(".type5");
var type8 = document.querySelector(".type8");
var type10 = document.querySelector(".type10");
var type11 = document.querySelector(".type11");
var type14 = document.querySelector(".type14");
var type16 = document.querySelector(".type16");
var type17 = document.querySelector(".type17");
var type18 = document.querySelector(".type18");
var type20 = document.querySelector(".type20");
var type21 = document.querySelector(".type21");

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
    ipcRenderer.send("openAEVfile")
    ipcRenderer.send("closeAEVfile")
})

saveAsBtn.addEventListener("click", () => {
    ipcRenderer.send("saveAsAEVfile")
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
var unk1_id = 2; // Add a new id for each unk1 (used in cloneRow())
var unk2_id = 2; // Add a new id for each unk2 (used in cloneRow())
var unk3_id = 2; // Add a new id for each unk3 (used in cloneRow())
var topLeftX_id = 2; // Add a new id for each posX (used in cloneRow())
var topLeftZ_id = 2; // Add a new id for each posX (used in cloneRow())
var topRightX_id = 2; // Add a new id for each posX (used in cloneRow())
var topRightZ_id = 2; // Add a new id for each posX (used in cloneRow())
var bottomRightX_id = 2; // Add a new id for each posX (used in cloneRow())
var bottomRightZ_id = 2; // Add a new id for each posX (used in cloneRow())
var bottomLeftX_id = 2; // Add a new id for each posX (used in cloneRow())
var bottomLeftZ_id = 2; // Add a new id for each posX (used in cloneRow())

// Getting file path
ipcRenderer.on("aevFileChannel", (e, filepath) => {

    var fd = fs.openSync(filepath); // Opening the file in memory
    var buffer = fs.readFileSync(fd); // Converting file string to buffer (hex)

    let total_event = buffer.readUInt8(6); // Reading number of objects
    countEl.setAttribute("value", total_event);

    // Reading table data
    for (i = 1; i < total_event; i++) {
        numberSequential.innerText = 1;

        // Reading event type
        var getEventType = buffer.readUint8(69);
        for (i = 0; i < eventIdSelect.length; i++) {
            console.log(eventIdSelect.options[i].value)
            if (eventIdSelect.options[i].value == getEventType) {
                eventIdSelect.selectedIndex = i;
            }
        }
        console.log(extraConfig.length);

        // Reading event type 1
        for (i = 0; i < extraConfig.length; i++) {
            if (extraConfig[i].classList.contains(`type${getEventType}`)) {
                console.log("aaa")
                extraConfig[i].classList.remove("hide");
            }
        }

        // Reading index byte
        var getIndex = buffer.readUint8(70);
        indexEl.id = 1;
        indexEl.setAttribute("value", getIndex);

        // Reading unk bytes
        var getUnk1 = buffer.readUint8(71);
        var getUnk2 = buffer.readUint8(72);
        var getUnk3 = buffer.readUint8(73);
        unk1El.value = getUnk1;
        unk2El.value = getUnk2;
        unk3El.value = getUnk3;

        // Reading triggerzone coordinates
        var getTopLeftX = buffer.readFloatLE(36).toFixed(0);
        var getTopLeftZ = buffer.readFloatLE(40).toFixed(0);
        var getTopRightX = buffer.readFloatLE(44).toFixed(0);
        var getTopRightZ = buffer.readFloatLE(48).toFixed(0);
        var getBottomRightX = buffer.readFloatLE(52).toFixed(0);
        var getBottomRightZ = buffer.readFloatLE(56).toFixed(0);
        var getBottomLeftX = buffer.readFloatLE(60).toFixed(0);
        var getBottomLeftZ = buffer.readFloatLE(64).toFixed(0);

        topLeftXEl.value = getTopLeftX;
        topLeftZEl.value = getTopLeftZ;
        topRightXEl.value = getTopRightX;
        topRightZEl.value = getTopRightZ;
        bottomRightXEl.value = getBottomRightX;
        bottomRightZEl.value = getBottomRightZ;
        bottomLeftXEl.value = getBottomLeftX;
        bottomLeftZEl.value = getBottomLeftZ;

        // Reading lower and higher limits
        var getLowerLimit = buffer.readFloatLE(24).toFixed(0);
        var getHigherLimit = buffer.readFloatLE(28).toFixed(0);
        lowerLimitEl.value = getLowerLimit;
        higherLimitEl.value = getHigherLimit;

        cloneRow();
    }

    function cloneRow() {
        let clone = row.cloneNode(true); // Cloning row
        chunk = chunk + 160; // Reading next chunks
        seq++; // Slot for item number
        // select_id++;

        let cloneSeq = clone.querySelector(".number-sequential");
        cloneSeq.innerText = seq;



        // Reading event type
        let cloneEventTypeSelect = clone.querySelector(".selectEventName");
        let getCloneEventType = buffer.readUint8(69 + chunk);
        for (i = 0; i < cloneEventTypeSelect.length; i++) {
            console.log(cloneEventTypeSelect.options[i].value)
            if (cloneEventTypeSelect.options[i].value == getCloneEventType) {
                cloneEventTypeSelect.selectedIndex = i;
            }
        }

        // Reading event type 1
        if (extraConfig[1].classList.contains(`type${getCloneEventType}`)) {
            console.log("aaa")
            extraConfig[1].classList.add("hide");
        }


        // Reading event type 1
        let cloneExtraConfigEl = clone.getElementsByClassName("extra-config");
        for (i = 0; i < cloneExtraConfigEl.length; i++) {
            if (cloneExtraConfigEl[i].classList.contains(`type${getCloneEventType}`)) {
                console.log("aaa")
                cloneExtraConfigEl[i].classList.remove("hide");
            }
        }

        // Getting index 
        let cloneIndex = clone.querySelector(".index");
        let getCloneIndex = buffer.readUint8(70 + chunk);
        cloneIndex.id = index_id++;
        cloneIndex.setAttribute("value", getCloneIndex);

        // Getting unknown bytes
        let cloneUnk1 = clone.querySelector(".unk1");
        let cloneUnk2 = clone.querySelector(".unk2");
        let cloneUnk3 = clone.querySelector(".unk3");
        let getCloneUnk1 = buffer.readUint8(71 + chunk);
        let getCloneUnk2 = buffer.readUint8(72 + chunk);
        let getCloneUnk3 = buffer.readUint8(73 + chunk);
        cloneUnk1.id = unk1_id++;
        cloneUnk2.id = unk2_id++;
        cloneUnk3.id = unk3_id++;
        cloneUnk1.value = getCloneUnk1;
        cloneUnk2.value = getCloneUnk2;
        cloneUnk3.value = getCloneUnk3;

        // Getting triggerzone coordinates
        let cloneTopLeftXEl = clone.querySelector(".top-leftX");
        let cloneTopLeftZEl = clone.querySelector(".top-leftZ");
        let cloneTopRightXEl = clone.querySelector(".top-rightX");
        let cloneTopRightZEl = clone.querySelector(".top-rightZ");
        let cloneBottomLeftXEl = clone.querySelector(".bottom-leftX");
        let cloneBottomLeftZEl = clone.querySelector(".bottom-leftZ");
        let cloneBottomRightXEl = clone.querySelector(".bottom-rightX");
        let cloneBottomRightZEl = clone.querySelector(".bottom-rightZ");
        let getCloneTopLeftX = buffer.readFloatLE(36 + chunk).toFixed(0);
        let getCloneTopLeftZ = buffer.readFloatLE(40 + chunk).toFixed(0);
        let getCloneTopRightX = buffer.readFloatLE(44 + chunk).toFixed(0);
        let getCloneTopRightZ = buffer.readFloatLE(48 + chunk).toFixed(0);
        let getCloneBottomRightX = buffer.readFloatLE(52 + chunk).toFixed(0);
        let getCloneBottomRightZ = buffer.readFloatLE(56 + chunk).toFixed(0);
        let getCloneBottomLeftX = buffer.readFloatLE(60 + chunk).toFixed(0);
        let getCloneBottomLeftZ = buffer.readFloatLE(64 + chunk).toFixed(0);
        cloneTopLeftXEl.id = topLeftX_id++;
        cloneTopLeftZEl.id = topLeftZ_id++;
        cloneTopRightXEl.id = topRightX_id++;
        cloneTopRightZEl.id = topRightZ_id++;
        cloneBottomRightXEl.id = bottomRightX_id++;
        cloneBottomRightZEl.id = bottomRightZ_id++;
        cloneBottomLeftXEl.id = bottomLeftX_id++;
        cloneBottomLeftZEl.id = bottomLeftZ_id++;
        cloneTopLeftXEl.value = getCloneTopLeftX;
        cloneTopLeftZEl.value = getCloneTopLeftZ;
        cloneTopRightXEl.value = getCloneTopRightX;
        cloneTopRightZEl.value = getCloneTopRightZ;
        cloneBottomRightXEl.value = getCloneBottomRightX;
        cloneBottomRightZEl.value = getCloneBottomRightZ;
        cloneBottomLeftXEl.value = getCloneBottomLeftX;
        cloneBottomLeftZEl.value = getCloneBottomLeftZ;

        // Getting lower and higher limits
        let cloneLowerLimitEl = clone.querySelector(".lower-limit");
        let cloneHigherLimitEl = clone.querySelector(".higher-limit");
        let getCloneLowerLimit = buffer.readFloatLE(24).toFixed(0);
        let getCloneHigherLimit = buffer.readFloatLE(28).toFixed(0);
        cloneLowerLimitEl.value = getCloneLowerLimit;
        cloneHigherLimitEl.value = getCloneHigherLimit;

        cellExpand.addEventListener("click", () => {
            if (eventBox.classList.contains("hide")) {
                eventBox.classList.remove("hide");
            } else {
                eventBox.classList.add("hide");
            }
        })

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
        ipcRenderer.send("closeAEVfile");
    })

    ipcRenderer.on("saveAsAEVfileContent", (e, arg) => {
        fs.writeFileSync(arg, buffer);
    })
});

