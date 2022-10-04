const fs = require('fs');
const { ipcRenderer } = require('electron');

// Const for testing text output (DEBUG)

/* ===============
    CREATE
   =============== */

// Getting elements
var rootEl = document.querySelector(":root");
var containerMainConfig = document.querySelector(".container-main-config");
var containerEventConfig = document.querySelector(".container-event-config");
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
var roomSelectEl = document.querySelector(".room-select");
var roomImage = document.querySelector(".room-image");

// Getting elements from event type 2
var offset88El = document.getElementById("offset88");
var offset89El = document.getElementById("offset89");
var offset90El = document.getElementById("offset90");

// Getting elements from event type 4
var enemyGroupEl = document.getElementById("enemyGroupByte");

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

    var getRoomID1 = buffer.readUint8(128);
    var getRoomID2 = buffer.readUint8(129);
    for (i = 0; i < roomSelectEl.length; i++) {
        if (roomSelectEl.options[i].value.substring(0, 1) == getRoomID1 &&
            roomSelectEl.options[i].value.substring(1, 2) == getRoomID2 ||
            roomSelectEl.options[i].value.substring(0, 1) == getRoomID1 &&
            roomSelectEl.options[i].value.substring(1, 3) == getRoomID2) {
            roomSelectEl.selectedIndex = i;
        }
    }
    //Change image acording to room ID
    if (getEventType == 1) {
        roomImage.src = `./images/rooms/${getRoomID1}${getRoomID2}.png`
    }

    // Event type 2
    var getOffset88 = buffer.readUint8(88);
    var getOffset89 = buffer.readUint8(89);
    var getOffset90 = buffer.readUint8(90);
    offset88El.value = getOffset88;
    offset89El.value = getOffset89;
    offset90El.value = getOffset90;

    // Event type 4
    var getEnemyGroupByte = buffer.readUint8(114);
    enemyGroupEl.value = getEnemyGroupByte;

    // Event type 5


    function showNextEvent(operator) {
        chunk = chunk + operator;

        // Reading event type
        let getCloneEventType = buffer.readUint8(69 + chunk);
        for (i = 0; i < eventIdSelect.length; i++) {
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


        // Reading Event 1: Door Teleport 
        var getCloneTeleportX = buffer.readFloatLE(112 + chunk).toFixed(2);
        var getCloneTeleportY = buffer.readFloatLE(116 + chunk).toFixed(2);
        var getCloneTeleportZ = buffer.readFloatLE(120 + chunk).toFixed(2);
        var getCloneFacingAngle = buffer.readFloatLE(124 + chunk).toFixed(2);
        teleportXEl.value = getCloneTeleportX;
        teleportYEl.value = getCloneTeleportY;
        teleportZEl.value = getCloneTeleportZ;
        teleportFacingAngleEl.value = getCloneFacingAngle;

        var getCloneRoomID1 = buffer.readUint8(128 + chunk);
        var getCloneRoomID2 = buffer.readUint8(129 + chunk);
        for (i = 0; i < roomSelectEl.length; i++) {
            if (roomSelectEl.options[i].value.substring(0, 1) == getCloneRoomID1 &&
                roomSelectEl.options[i].value.substring(1, 2) == getCloneRoomID2 ||
                roomSelectEl.options[i].value.substring(0, 1) == getCloneRoomID1 &&
                roomSelectEl.options[i].value.substring(1, 3) == getCloneRoomID2) {
                roomSelectEl.selectedIndex = i;
            }
        }
        if (getCloneEventType == 1) {
            roomImage.src = `./images/rooms/${getCloneRoomID1}${getCloneRoomID2}.png`
        }

        // Reading Event 2: Cutscene 
        var getCloneOffset88 = buffer.readUint8(88 + chunk);
        var getCloneOffset89 = buffer.readUint8(89 + chunk);
        var getCloneOffset90 = buffer.readUint8(90 + chunk);
        offset88El.value = getCloneOffset88;
        offset89El.value = getCloneOffset89;
        offset90El.value = getCloneOffset90;

        // Reading Event 4: Enemy Group Trigger
        var getCloneEnemyGroupByte = buffer.readUint8(114 + chunk);
        enemyGroupEl.value = getCloneEnemyGroupByte;
    }


    /* ===============
        UPDATE
       =============== */

    // Getting any change from Main Config Container values
    containerMainConfig.addEventListener("change", function (e) {
        if (e.target.classList.contains("selectEventName")) {
            // Gets value from select/option and sets to buffer
            var select_number = parseInt(eventNumber.value + 1); // Get clicked select ID attribute
            var select_opt = e.target.selectedIndex; // Get *option* selected from the clicked select
            var chunk_save = 160 * (parseInt(select_number) - 1); // Multiply chunk size by select ID number

            // Showing event based on type
            for (i = 0; i < eventConfig.length; i++) {
                if (eventConfig[i].classList.contains(`type${select_opt}`)) {
                    buffer.writeUint8(select_opt, 69 + parseInt(chunk_save));
                    eventConfig[i].classList.remove("hide");

                }
            }
            // Hiding event based on type
            for (i = 0; i < eventConfig.length; i++) {
                if (!eventConfig[i].classList.contains(`type${select_opt}`)) {
                    eventConfig[i].classList.add("hide");
                }
            }
            // Writes data on buffer on every hange
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
        if (e.target.classList.contains("lowerLimitEl")) {
            // Gets value from Lower Limit and sets to buffer
            var lower_limit = e.target.value;
            var chunk_save = 160 * (parseInt(eventNumber.value) - 1);
            buffer.writeFloatLE(lower_limit, 24 + chunk_save).toFixed(2);
        }
        if (e.target.classList.contains("higherLimitEl")) {
            // Gets value from Higher Limit and sets to buffer
            var higher_limit = e.target.value;
            var chunk_save = 160 * (parseInt(eventNumber.value) - 1);
            buffer.writeFloatLE(higher_limit, 28 + chunk_save).toFixed(2);
        }
        if (e.target.classList.contains("unk1")) {
            // Gets value from Unknown Bytes and sets to buffer
            var setUnk1 = e.target.value;
            var chunk_save = 160 * (parseInt(eventNumber.value) - 1);
            if (setUnk1 <= 255) {
                buffer.writeUint8(setUnk1, 71 + chunk_save);
                indexEl.style.color = "#000";
                indexEl.style.outline = "none";
            } else {
                indexEl.style.color = "red";
                indexEl.style.outline = "1px solid red";
            }
        }
        if (e.target.classList.contains("unk2")) {
            // Gets value from Unknown Bytes and sets to buffer
            var setUnk2 = e.target.value;
            var chunk_save = 160 * (parseInt(eventNumber.value) - 1);
            if (setUnk2 <= 255) {
                buffer.writeUint8(setUnk2, 72 + chunk_save);
                indexEl.style.color = "#000";
                indexEl.style.outline = "none";
            } else {
                indexEl.style.color = "red";
                indexEl.style.outline = "1px solid red";
            }
        }
        if (e.target.classList.contains("unk3")) {
            // Gets value from Unknown Bytes and sets to buffer
            var setUnk3 = e.target.value;
            var chunk_save = 160 * (parseInt(eventNumber.value) - 1);
            if (setUnk3 <= 255) {
                buffer.writeUint8(setUnk3, 73 + chunk_save);
                indexEl.style.color = "#000";
                indexEl.style.outline = "none";
            } else {
                indexEl.style.color = "red";
                indexEl.style.outline = "1px solid red";
            }
        }
    })

    containerEventConfig.addEventListener("change", function (e) {
        if (e.target.classList.contains("def1")) {
            // Gets value from Definition Bytes and sets to buffer
            var setDef1 = e.target.value;
            var chunk_save = 160 * (parseInt(eventNumber.value) - 1);
            if (setDef1 <= 255) {
                buffer.writeUint8(setDef1, 84 + chunk_save);
                indexEl.style.color = "#000";
                indexEl.style.outline = "none";
            } else {
                indexEl.style.color = "red";
                indexEl.style.outline = "1px solid red";
            }
        }
        if (e.target.classList.contains("def2")) {
            // Gets value from Definition Bytes and sets to buffer
            var setDef2 = e.target.value;
            var chunk_save = 160 * (parseInt(eventNumber.value) - 1);
            if (setDef2 <= 255) {
                buffer.writeUint8(setDef2, 85 + chunk_save);
                indexEl.style.color = "#000";
                indexEl.style.outline = "none";
            } else {
                indexEl.style.color = "red";
                indexEl.style.outline = "1px solid red";
            }
        }
        if (e.target.classList.contains("def3")) {
            // Gets value from Definition Bytes and sets to buffer
            var setDef3 = e.target.value;
            var chunk_save = 160 * (parseInt(eventNumber.value) - 1);
            if (setDef3 <= 255) {
                buffer.writeUint8(setDef3, 86 + chunk_save);
                indexEl.style.color = "#000";
                indexEl.style.outline = "none";
            } else {
                indexEl.style.color = "red";
                indexEl.style.outline = "1px solid red";
            }
        }
        if (e.target.classList.contains("def4")) {
            // Gets value from Definition Bytes and sets to buffer
            var setDef4 = e.target.value;
            var chunk_save = 160 * (parseInt(eventNumber.value) - 1);
            if (setDef4 <= 255) {
                buffer.writeUint8(setDef4, 87 + chunk_save);
                indexEl.style.color = "#000";
                indexEl.style.outline = "none";
            } else {
                indexEl.style.color = "red";
                indexEl.style.outline = "1px solid red";
            }
        }
        /* ===== Event: General Purpose ====== */

        /* ===== Event: Door Teleport ====== */
        if (e.target.classList.contains("room-select")) {
            // Gets value from Room Selector and sets to buffer
            let selectRoom_opt = e.target.selectedIndex;
            let setRoomCompleteID = e.target.options[selectRoom_opt].value;
            let stageID = setRoomCompleteID.substring(0, 1);

            function getRoomID() {
                if (setRoomCompleteID.length == 1) {
                    return setRoomCompleteID.substring(1, 2);
                } else {
                    return setRoomCompleteID.substring(1, 3);
                }
            }

            var chunk_save = 160 * (parseInt(eventNumber.value) - 1);
            buffer.writeUint8(stageID, 128 + chunk_save);
            buffer.writeUint8(getRoomID(), 129 + chunk_save);
            // Changing image acording to room ID
            roomImage.src = `./images/rooms/${stageID}${getRoomID()}.png`
        }
        if (e.target.classList.contains("teleport-x")) {
            // Gets value from Teleport X and sets to buffer
            var setTeleportX = e.target.value;
            var chunk_save = 160 * (parseInt(eventNumber.value) - 1);
            buffer.writeFloatLE(setTeleportX, 112 + chunk_save).toFixed(2);
        }
        if (e.target.classList.contains("teleport-y")) {
            // Gets value from Teleport Y and sets to buffer
            var setTeleportY = e.target.value;
            var chunk_save = 160 * (parseInt(eventNumber.value) - 1);
            buffer.writeFloatLE(setTeleportY, 116 + chunk_save).toFixed(2);
        }
        if (e.target.classList.contains("teleport-z")) {
            // Gets value from Teleport Z and sets to buffer
            var setTeleportZ = e.target.value;
            var chunk_save = 160 * (parseInt(eventNumber.value) - 1);
            buffer.writeFloatLE(setTeleportZ, 120 + chunk_save).toFixed(2);
        }
        if (e.target.classList.contains("teleport-rotation")) {
            // Gets value from Teleport Rotation and sets to buffer
            var setTeleportZ = e.target.value;
            var chunk_save = 160 * (parseInt(eventNumber.value) - 1);
            buffer.writeFloatLE(setTeleportZ, 124 + chunk_save).toFixed(2);
        }

        /* ===== Event: Cutscene ====== */
        if (e.target.classList.contains("offset88")) {
            // Gets value from Offset 88 and sets to buffer
            var setOffset88 = e.target.value;
            var chunk_save = 160 * (parseInt(eventNumber.value) - 1);
            if (setOffset88 <= 255) {
                buffer.writeUint8(setOffset88, 88 + chunk_save);
                indexEl.style.color = "#000";
                indexEl.style.outline = "none";
            } else {
                indexEl.style.color = "red";
                indexEl.style.outline = "1px solid red";
            }
        }
        if (e.target.classList.contains("offset89")) {
            // Gets value from Offset 89 and sets to buffer
            var setOffset89 = e.target.value;
            var chunk_save = 160 * (parseInt(eventNumber.value) - 1);
            if (setOffset89 <= 255) {
                buffer.writeUint8(setOffset89, 89 + chunk_save);
                indexEl.style.color = "#000";
                indexEl.style.outline = "none";
            } else {
                indexEl.style.color = "red";
                indexEl.style.outline = "1px solid red";
            }
        }
        if (e.target.classList.contains("offset90")) {
            // Gets value from Offset 90 and sets to buffer
            var setOffset90 = e.target.value;
            var chunk_save = 160 * (parseInt(eventNumber.value) - 1);
            if (setOffset90 <= 255) {
                buffer.writeUint8(setOffset90, 90 + chunk_save);
                indexEl.style.color = "#000";
                indexEl.style.outline = "none";
            } else {
                indexEl.style.color = "red";
                indexEl.style.outline = "1px solid red";
            }
        }

        /* ===== Event: Enemy Group Trigger ====== */
        if (e.target.classList.contains("enemyGroupByte")) {
            // Gets value from Enemy Group Byte and sets to buffer
            var setEnemyGroup = e.target.value;
            var chunk_save = 160 * (parseInt(eventNumber.value) - 1);
            if (setEnemyGroup <= 255) {
                buffer.writeUint8(setEnemyGroup, 114 + chunk_save);
                indexEl.style.color = "#000";
                indexEl.style.outline = "none";
            } else {
                indexEl.style.color = "red";
                indexEl.style.outline = "1px solid red";
            }
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

