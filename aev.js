const fs = require('fs');
const { ipcRenderer } = require('electron');

// Const for testing text output (DEBUG)

/* ===============
    CREATE
   =============== */

// Getting elements
var rootEl = document.querySelector(":root");
var containerMainConfig = document.querySelector(".container-main-config")
var countEl = document.getElementById("count");
var indexEl = document.querySelector(".index");
var eventNumber = document.getElementById("event-changer-input");
var nextBtn = document.getElementById("nextBtn");
var prevBtn = document.getElementById("prevBtn");
var eventConfig = document.getElementsByClassName("event-config");
var fileName = document.getElementById("header-filename");
var headerFileSize = document.getElementById("header-filesize");
var mainHeader = document.getElementById("campo-superior");

// Getting elements from Main Config
var eventIdSelect = document.querySelector(".selectEventName")
var unk1El = document.querySelector("#unk1");
var unk2El = document.querySelector("#unk2");
var unk3El = document.querySelector("#unk3");
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

// Getting elements from definition bytes
var definitionByte1 = document.querySelector("#def1");
var definitionByte2 = document.querySelector("#def2");
var definitionByte3 = document.querySelector("#def3");
var definitionByte4 = document.querySelector("#def4");

// Getting elements from event type 1
var teleportXEl = document.querySelector("#teleport-x");
var teleportYEl = document.querySelector("#teleport-y");
var teleportZEl = document.querySelector("#teleport-z");
var teleportFacingAngleEl = document.querySelector("#teleport-rotation");

// Getting elements from event type HIDE
var xAshley = document.querySelector("#hide-event-x");

// Const for getting Menu elements
const openFile = document.getElementById("openAEVfile");
const closeBtn = document.getElementById("closeAEVfile");
const saveBtn = document.getElementById("saveAEVfile");
const saveAsBtn = document.getElementById("saveAEVas");
const quitApp = document.getElementById("quitApp");
const minimizeBtn = document.getElementById("minimize");
const maximizeBtn = document.getElementById("maximize");
const closeWindowBtn = document.getElementById("closeWindow");

const themeBtn = document.getElementById("changeTheme");

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

themeBtn.addEventListener("click", () => {
    rootEl.style.setProperty("--main-background", "#3c6e71")
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

var operator = "";

// Getting file path
ipcRenderer.on("aevFileChannel", (e, filepath) => {

    var fd = fs.openSync(filepath); // Opening the file in memory
    var buffer = fs.readFileSync(fd); // Converting file string to buffer (hex)

    let total_event = buffer.readUInt8(6); // Reading number of objects i < eventIdSelect.length
    countEl.setAttribute("value", total_event);
    headerFileSize.value = buffer.length + " bytes";

    // Event Listeners
    nextBtn.addEventListener("click", (e) => {
        if (eventNumber.value != total_event) {
            eventNumber.value = Number(eventNumber.value) + 1;
            showNextEvent(160);
        } else {
            return;
        }
    })

    prevBtn.addEventListener("click", (e) => {
        if (eventNumber.value > 1) {
            eventNumber.value = Number(eventNumber.value) - 1;
            showNextEvent(-160);
        } else {
            return;
        }
    })

    // Reading event type
    var getEventType = buffer.readUint8(69);
    for (i = 0; eventIdSelect.options[i].value == getEventType; i++) {
        console.log(eventIdSelect.options[i].value)
        if (eventIdSelect.options[i].value == getEventType) {
            eventIdSelect.selectedIndex = i;
        }
    }

    // Showing the event based on its type
    for (i = 0; i < eventConfig.length; i++) {
        if (eventConfig[i].classList.contains(`type${getEventType}`)) {
            console.log("aaa")
            eventConfig[i].classList.remove("hide");
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
    var getTopLeftX = buffer.readFloatLE(36).toFixed(2);
    var getTopLeftZ = buffer.readFloatLE(40).toFixed(2);
    var getTopRightX = buffer.readFloatLE(44).toFixed(2);
    var getTopRightZ = buffer.readFloatLE(48).toFixed(2);
    var getBottomRightX = buffer.readFloatLE(52).toFixed(2);
    var getBottomRightZ = buffer.readFloatLE(56).toFixed(2);
    var getBottomLeftX = buffer.readFloatLE(60).toFixed(2);
    var getBottomLeftZ = buffer.readFloatLE(64).toFixed(2);

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

    // Reading definition bytes
    var getDefByte1 = buffer.readUint8(84);
    var getDefByte2 = buffer.readUint8(85);
    var getDefByte3 = buffer.readUint8(86);
    var getDefByte4 = buffer.readUint8(87);
    definitionByte1.value = getDefByte1;
    definitionByte2.value = getDefByte2;
    definitionByte3.value = getDefByte3;
    definitionByte4.value = getDefByte4;

    // Event type 1
    var getTeleportX = buffer.readFloatLE(112).toFixed(2);
    var getTeleportY = buffer.readFloatLE(116).toFixed(2);
    var getTeleportZ = buffer.readFloatLE(120).toFixed(2);
    var getFacingAngle = buffer.readFloatLE(124).toFixed(2);
    teleportXEl.value = getTeleportX;
    teleportYEl.value = getTeleportY;
    teleportZEl.value = getTeleportZ;
    teleportFacingAngleEl.value = getFacingAngle;

    // Event type 2
    var getXAshley = buffer.readFloatLE(112);
    xAshley.value = getXAshley;

    function showNextEvent(operator) {
        chunk = chunk + operator;

        // Reading event type
        let getCloneEventType = buffer.readUint8(69 + chunk);
        for (i = 0; i < eventIdSelect.length; i++) {
            console.log(eventIdSelect.options[i].value)
            if (eventIdSelect.options[i].value == getCloneEventType) {
                eventIdSelect.selectedIndex = i;
            }
        }

        // Showing event based on type
        for (i = 0; i < eventConfig.length; i++) {
            if (eventConfig[i].classList.contains(`type${getCloneEventType}`)) {
                eventConfig[i].classList.remove("hide");
            }
        }

        // Hiding event based on type
        for (i = 0; i < eventConfig.length; i++) {
            if (!eventConfig[i].classList.contains(`type${getCloneEventType}`)) {
                eventConfig[i].classList.add("hide");
            }
        }

        // Getting index 
        let getCloneIndex = buffer.readUint8(70 + chunk);
        indexEl.id = index_id++;
        indexEl.setAttribute("value", getCloneIndex);

        // Getting unknown bytes
        let getCloneUnk1 = buffer.readUint8(71 + chunk);
        let getCloneUnk2 = buffer.readUint8(72 + chunk);
        let getCloneUnk3 = buffer.readUint8(73 + chunk);
        unk1El.id = unk1_id++;
        unk2El.id = unk2_id++;
        unk3El.id = unk3_id++;
        unk1El.value = getCloneUnk1;
        unk2El.value = getCloneUnk2;
        unk3El.value = getCloneUnk3;

        // Getting triggerzone coordinates
        let getCloneTopLeftX = buffer.readFloatLE(36 + chunk).toFixed(2);
        let getCloneTopLeftZ = buffer.readFloatLE(40 + chunk).toFixed(2);
        let getCloneTopRightX = buffer.readFloatLE(44 + chunk).toFixed(2);
        let getCloneTopRightZ = buffer.readFloatLE(48 + chunk).toFixed(2);
        let getCloneBottomRightX = buffer.readFloatLE(52 + chunk).toFixed(2);
        let getCloneBottomRightZ = buffer.readFloatLE(56 + chunk).toFixed(2);
        let getCloneBottomLeftX = buffer.readFloatLE(60 + chunk).toFixed(2);
        let getCloneBottomLeftZ = buffer.readFloatLE(64 + chunk).toFixed(2);
        topLeftXEl.id = topLeftX_id++;
        topLeftZEl.id = topLeftZ_id++;
        topRightXEl.id = topRightX_id++;
        topRightZEl.id = topRightZ_id++;
        bottomRightXEl.id = bottomRightX_id++;
        bottomRightZEl.id = bottomRightZ_id++;
        bottomLeftXEl.id = bottomLeftX_id++;
        bottomLeftZEl.id = bottomLeftZ_id++;
        topLeftXEl.value = getCloneTopLeftX;
        topLeftZEl.value = getCloneTopLeftZ;
        topRightXEl.value = getCloneTopRightX;
        topRightZEl.value = getCloneTopRightZ;
        bottomRightXEl.value = getCloneBottomRightX;
        bottomRightZEl.value = getCloneBottomRightZ;
        bottomLeftXEl.value = getCloneBottomLeftX;
        bottomLeftZEl.value = getCloneBottomLeftZ;

        // Getting lower and higher limits
        let getCloneLowerLimit = buffer.readFloatLE(24).toFixed(2);
        let getCloneHigherLimit = buffer.readFloatLE(28).toFixed(2);
        lowerLimitEl.value = getCloneLowerLimit;
        higherLimitEl.value = getCloneHigherLimit;

        // Reading definition bytes
        var getCloneDefByte1 = buffer.readUint8(84 + chunk);
        var getCloneDefByte2 = buffer.readUint8(85 + chunk);
        var getCloneDefByte3 = buffer.readUint8(86 + chunk);
        var getCloneDefByte4 = buffer.readUint8(87 + chunk);
        definitionByte1.value = getCloneDefByte1;
        definitionByte2.value = getCloneDefByte2;
        definitionByte3.value = getCloneDefByte3;
        definitionByte4.value = getCloneDefByte4;

    }


    /* ===============
        UPDATE
       =============== */

    // Getting any change from Main Config Container values
    containerMainConfig.addEventListener("change", function (e) {
        if (e.target.classList.contains("selectEventName")) {
            console.log(e.target);
            // Gets value from select/option and sets to buffer
            var select_number = parseInt(eventNumber.value + 1); // Get clicked select ID attribute
            var select_opt = e.target.selectedIndex; // Get *option* selected from the clicked select
            var chunk_save = 160 * (parseInt(select_number) - 1); // Multiply chunk size by select ID number

            // Showing event based on type
            for (i = 0; i < eventConfig.length; i++) {
                if (eventConfig[i].classList.contains(`type${select_opt}`)) {
                    eventConfig[i].classList.remove("hide");
                }
            }
            // Hiding event based on type
            for (i = 0; i < eventConfig.length; i++) {
                if (!eventConfig[i].classList.contains(`type${select_opt}`)) {
                    eventConfig[i].classList.add("hide");
                }
            }
            buffer.writeUint8(select_opt, 69 + parseInt(chunk_save)); // Writes data on buffer on every hange
        }
        if (e.target.className == "index") {
            // Gets value from index input and sets to buffer
            var setIndex = parseInt(e.target.value);
            var chunk_save = 160 * (parseInt(eventNumber.value) - 1);
            if (setIndex <= 255) {
                buffer.writeUint8(setIndex, parseInt(70 + chunk_save));
                indexEl.style.color = "#000";
                indexEl.style.outline = "none";
            } else {
                indexEl.style.color = "red";
                indexEl.style.outline = "1px solid red";
            }
        }
        if (e.target.classList.contains("top-leftX")) {
            // Gets value from Top Left X and sets to buffer
            var top_leftX = e.target.value;
            var chunk_save = 160 * (parseInt(eventNumber.value) - 1);
            buffer.writeFloatLE(top_leftX, 36 + chunk_save).toFixed(2);

        }
        if (e.target.classList.contains("top-leftZ")) {
            // Gets value from Top Left Z and sets to buffer
            var top_leftZ = e.target.value;
            var chunk_save = 160 * (parseInt(eventNumber.value) - 1);
            buffer.writeFloatLE(top_leftZ, 40 + chunk_save).toFixed(2);

        }
        if (e.target.classList.contains("top-rightX")) {
            // Gets value from Top Right X and sets to buffer
            var top_rightX = e.target.value;
            var chunk_save = 160 * (parseInt(eventNumber.value) - 1);
            buffer.writeFloatLE(top_rightX, 44 + chunk_save).toFixed(2);

        }
        if (e.target.classList.contains("top-rightZ")) {
            // Gets value from Top Right Z and sets to buffer
            var top_rightZ = e.target.value;
            var chunk_save = 160 * (parseInt(eventNumber.value) - 1);
            buffer.writeFloatLE(top_rightZ, 48 + chunk_save).toFixed(2);

        }
        if (e.target.classList.contains("bottom-rightX")) {
            // Gets value from Bottom Right X and sets to buffer
            var bottom_rightX = e.target.value;
            var chunk_save = 160 * (parseInt(eventNumber.value) - 1);
            buffer.writeFloatLE(bottom_rightX, 52 + chunk_save).toFixed(2);

        }
        if (e.target.classList.contains("bottom-rightZ")) {
            // Gets value from Bottom Right Z and sets to buffer
            var bottom_rightZ = e.target.value;
            var chunk_save = 160 * (parseInt(eventNumber.value) - 1);
            buffer.writeFloatLE(bottom_rightZ, 56 + chunk_save).toFixed(2);

        }
        if (e.target.classList.contains("bottom-leftX")) {
            // Gets value from Bottom Left X and sets to buffer
            var bottom_leftX = e.target.value;
            var chunk_save = 160 * (parseInt(eventNumber.value) - 1);
            buffer.writeFloatLE(bottom_leftX, 60 + chunk_save).toFixed(2);

        }
        if (e.target.classList.contains("bottom-leftZ")) {
            // Gets value from Bottom Left Z and sets to buffer
            var bottom_leftZ = e.target.value;
            var chunk_save = 160 * (parseInt(eventNumber.value) - 1);
            buffer.writeFloatLE(bottom_leftZ, 64 + chunk_save).toFixed(2);

        }
        if (e.target.className == "posY") {
            // Gets value from posY and sets to buffer
            var setPosY = e.target.value;
            var setPosYid = e.target.id;
            var chunk_save = 160 * (parseInt(setPosYid) - 1);
            buffer.writeFloatLE(setPosY, 52 + chunk_save).toFixed(2);

        }
        if (e.target.className == "posZ") {
            // Gets value from posY and sets to buffer
            var setPosZ = e.target.value;
            var setPosZid = e.target.id;
            var chunk_save = 160 * (parseInt(setPosZid) - 1);
            buffer.writeFloatLE(setPosZ, 56 + chunk_save).toFixed(2);

        }
        if (e.target.className == "rotX") {
            // Gets value from rotX and sets to buffer
            var setRotX = e.target.value;
            var setRotXid = e.target.id;
            var chunk_save = 160 * (parseInt(setRotXid) - 1);
            buffer.writeFloatLE(setRotX, 32 + chunk_save).toFixed(2);

        }
        if (e.target.className == "rotY") {
            // Gets value from rotY and sets to buffer
            var setRotY = e.target.value;
            var setRotYid = e.target.id;
            var chunk_save = 160 * (parseInt(setRotYid) - 1);
            buffer.writeFloatLE(setRotY, 36 + chunk_save).toFixed(2);

        }
        if (e.target.className == "rotZ") {
            // Gets value from rotZ and sets to buffer
            var setRotZ = e.target.value;
            var setRotZid = e.target.id;
            var chunk_save = 160 * (parseInt(setRotZid) - 1);
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

