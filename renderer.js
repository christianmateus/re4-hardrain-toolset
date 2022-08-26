const fs = require('fs');
const { windowsStore } = require('process');
const { ipcRenderer } = require('electron');

// Const for testing text output (DEBUG)
const textarea = document.getElementById("testes");

// Const for getting Menu elements
const openFile = document.getElementById("openFile")
const closeBtn = document.getElementById("closeFile")
const saveAsBtn = document.getElementById("saveAs")
const minimizeBtn = document.getElementById("minimize")
const maximizeBtn = document.getElementById("maximize")
const closeWindowBtn = document.getElementById("closeWindow")

// Menu actions (open/save/quit)
openFile.addEventListener("click", () => {
    ipcRenderer.send("openfile")
    let table = document.querySelector("table");
    while (table.rows.length > 2) {
        table.deleteRow(1);
    }
})

saveAsBtn.addEventListener("click", () => {
    ipcRenderer.send("saveFile")
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

// App start after loading file
ipcRenderer.on("dialog", (e, arg) => {
    let fd = fs.openSync(arg); // fd means file descriptor
    debugger
    var contador = 176; // 
    var somador = 0; // Used together with sum to read all chunks data
    var seq = 1; // Used to update the row/slot number

    var stats = fs.statSync(arg); // Gets file's object with informations
    var fileSize = stats.size; // Stores file's size in "fileSize" variable

    // Buffer for storing bytes
    let buffer = Buffer.alloc(fileSize);// 16 bytes
    // Item slot number
    var seq = document.querySelector(".number-sequential").innerHTML = 01;
    // seq.innerText = 01;
    // ===============
    // ---- HEADER
    // ===============
    var ff = fs.readSync(fd, buffer, 0, 16, 0);
    console.log(ff)
    let program = function () {

        // fs.read(fd, buffer, offset, length, position, callback)
        fs.read(fd, buffer, 0, 16, 0, function (err, bytesread, buffer_header) {
            // Getting values
            var total_item = buffer_header.readInt8(6);
            // Setting values
            var cont = document.getElementById("count");
            cont.setAttribute("value", total_item);

            for (i = 1; i <= total_item; i++) {

                if (i == 1) {
                    contador = 16;
                    somador = 0;
                    chunk();

                } else if (i == 2) {
                    setTimeout(() => {
                        somador = somador + 176
                        cloneRow();
                    }, 150);

                } else if (i == 3) {
                    setTimeout(() => {
                        somador = somador + 176
                        cloneRow();
                    }, 300);

                } else if (i == 4) {
                    setTimeout(() => {
                        somador = somador + 176
                        cloneRow();
                    }, 450);
                } else if (i == 5) {
                    setTimeout(() => {
                        somador = somador + 176
                        cloneRow();
                    }, 600);
                } else if (i == 6) {
                    setTimeout(() => {
                        somador = somador + 176
                        cloneRow();
                    }, 750);
                } else if (i == 7) {
                    setTimeout(() => {
                        somador = somador + 176
                        cloneRow();
                    }, 900);

                } else if (i == 8) {
                    setTimeout(() => {
                        somador = somador + 176
                        cloneRow();
                    }, 1050);
                } else if (i == 9) {
                    setTimeout(() => {
                        somador = somador + 176
                        cloneRow();
                    }, 1200);
                } else if (i == 10) {
                    setTimeout(() => {
                        somador = somador + 176
                        cloneRow();
                    }, 1350);
                } else if (i == 11) {
                    setTimeout(() => {
                        somador = somador + 176
                        cloneRow();
                    }, 1500);
                } else if (i == 12) {
                    setTimeout(() => {
                        somador = somador + 176
                        cloneRow();
                    }, 1650);
                } else if (i == 13) {
                    setTimeout(() => {
                        somador = somador + 176
                        cloneRow();
                    }, 1800);
                } else if (i == 14) {
                    setTimeout(() => {
                        somador = somador + 176
                        cloneRow();
                    }, 1950);
                } else if (i == 15) {
                    setTimeout(() => {
                        somador = somador + 176
                        cloneRow();
                    }, 2100);
                } else if (i == 16) {
                    setTimeout(() => {
                        somador = somador + 176
                        cloneRow();
                    }, 2250);
                } else if (i == 17) {
                    setTimeout(() => {
                        somador = somador + 176
                        cloneRow();
                    }, 2400);
                } else if (i == 18) {
                    setTimeout(() => {
                        somador = somador + 176
                        cloneRow();
                    }, 2550);
                } else if (i == 19) {
                    setTimeout(() => {
                        somador = somador + 176
                        cloneRow();
                    }, 2700);
                } else if (i == 20) {
                    setTimeout(() => {
                        somador = somador + 176
                        cloneRow();
                    }, 2850);
                } else if (i == 21) {
                    setTimeout(() => {
                        somador = somador + 176
                        cloneRow();
                    }, 3000);
                } else if (i == 22) {
                    setTimeout(() => {
                        somador = somador + 176
                        cloneRow();
                    }, 3150);
                } else if (i == 23) {
                    setTimeout(() => {
                        somador = somador + 176
                        cloneRow();
                    }, 3300);
                } else if (i == 24) {
                    setTimeout(() => {
                        somador = somador + 176
                        cloneRow();
                    }, 3450);
                } else if (i == 25) {
                    setTimeout(() => {
                        somador = somador + 176
                        cloneRow();
                    }, 3600);
                } else if (i == 26) {
                    setTimeout(() => {
                        somador = somador + 176
                        cloneRow();
                    }, 3750);
                } else if (i == 27) {
                    setTimeout(() => {
                        somador = somador + 176
                        cloneRow();
                    }, 3900);
                } else if (i == 28) {
                    setTimeout(() => {
                        somador = somador + 176
                        cloneRow();
                    }, 4050);
                } else if (i == 29) {
                    setTimeout(() => {
                        somador = somador + 176
                        cloneRow();
                    }, 4200);
                }
                // } else if (i == 30) {
                //     setTimeout(() => {
                //         somador = somador + 176
                //         cloneRow();
                //     }, 4350);
                // } else if (i == 31) {
                //     setTimeout(() => {
                //         somador = somador + 176
                //         cloneRow();
                //     }, 4500);
                // } else if (i == 32) {
                //     setTimeout(() => {
                //         somador = somador + 176
                //         cloneRow();
                //     }, 4650);
                // } else if (i == 33) {
                //     setTimeout(() => {
                //         somador = somador + 176
                //         cloneRow();
                //     }, 4800);
                // } else if (i == 34) {
                //     setTimeout(() => {
                //         somador = somador + 176
                //         cloneRow();
                //     }, 4950);
                // } else if (i == 35) {
                //     setTimeout(() => {
                //         somador = somador + 176
                //         cloneRow();
                //     }, 5100);
                // } else if (i == 36) {
                //     setTimeout(() => {
                //         somador = somador + 176
                //         cloneRow();
                //     }, 5250);
                // }

            }

            // Função para criar novas linhas
            function cloneRow() {
                var clone = row.cloneNode(true); // Cloning all child nodes
                clone.querySelector(".number-sequential").innerText = seq = seq + 1;

                // Reading next INDEX byte
                fs.read(fd, buffer, somador, 176, somador, (err, bytesread, buffer) => {
                    let cloneIndex = buffer.readUInt8(70 + somador);
                    // buffer.writeInt8; USAR ISSO PARA SALVAR ALTERAÇÕES
                    clone.querySelector(".item-index").innerHTML = cloneIndex;
                    // let editIndex = buffer.writeUInt8(70 + somador);
                })

                //Reading next INSIDE bytes
                fs.read(fd, buffer, somador, 176, somador, (err, bytesread, buffer) => {
                    let cloneInside = buffer.readUInt8(86 + somador);

                    if (cloneInside == 0) {
                        clone.querySelector(".inside").selectedIndex = 0;
                    } else if (cloneInside == 1) {
                        clone.querySelector(".inside").selectedIndex = 1;
                    } else {
                        clone.querySelector(".inside").selectedIndex = 2;
                    }
                })

                // Reading next ETS byte
                fs.read(fd, buffer, somador, 176, somador, (err, bytesread, buffer) => {
                    let cloneETS = buffer.readUInt8(87 + somador);
                    clone.querySelector(".ets").innerHTML = cloneETS;
                })

                //Reading next QUANTITY bytes
                fs.read(fd, buffer, somador, 176, somador, (err, bytesread, buffer) => {
                    let cloneQuantity = buffer.readUInt16LE(152 + somador);
                    clone.querySelector(".quantity").innerHTML = cloneQuantity;
                })

                //Reading next RANDOM bytes
                fs.read(fd, buffer, somador, 176, somador, (err, bytesread, buffer) => {
                    let cloneRandom = buffer.readUInt8(149 + somador);

                    if (cloneRandom == 16) {
                        clone.querySelector(".random").selectedIndex = 0;
                    } else {
                        clone.querySelector(".random").selectedIndex = 1;
                    }
                })

                //Reading next GLOW bytes
                fs.read(fd, buffer, somador, 176, somador, (err, bytesread, buffer) => {
                    let cloneGlow = buffer.readUInt8(140 + somador);
                    clone.querySelector(".glow");

                    if (cloneGlow == 0) {
                        clone.querySelector(".glow").selectedIndex = 0;
                    } else if (cloneGlow == 1) {
                        clone.querySelector(".glow").selectedIndex = 1;
                    } else if (cloneGlow == 2) {
                        clone.querySelector(".glow").selectedIndex = 2;
                    } else if (cloneGlow == 3) {
                        clone.querySelector(".glow").selectedIndex = 3;
                    } else if (cloneGlow == 4) {
                        clone.querySelector(".glow").selectedIndex = 4;
                    } else if (cloneGlow == 5) {
                        clone.querySelector(".glow").selectedIndex = 5;
                    } else if (cloneGlow == 6) {
                        clone.querySelector(".glow").selectedIndex = 6;
                    } else if (cloneGlow == 7) {
                        clone.querySelector(".glow").selectedIndex = 7;
                    } else if (cloneGlow == 8) {
                        clone.querySelector(".glow").selectedIndex = 8;
                    } else if (cloneGlow == 9) {
                        clone.querySelector(".glow").selectedIndex = 9;
                    }
                })

                //Reading next ITEM STATUS bytes
                fs.read(fd, buffer, somador, 176, somador, (err, bytesread, buffer) => {
                    let cloneStatus = buffer.readUInt8(160 + somador);

                    if (cloneStatus == 16) {
                        clone.querySelector(".status").selectedIndex = 2;
                    } else if (cloneStatus == 2 || cloneStatus == 6) {
                        clone.querySelector(".status").selectedIndex = 1;
                    } else {
                        clone.querySelector(".status").selectedIndex = 0;
                    }
                })

                //Reading next ITEM ID bytes
                fs.read(fd, buffer, somador, 176, somador, (err, bytesread, buffer) => {
                    let cloneItem_id = buffer.readUInt8(148 + somador);
                    let selectItem_id = clone.querySelector(".item-id");

                    for (var i = 0; i < selectItem_id.options.length; i++) {
                        if (selectItem_id.options[i].value == cloneItem_id) {
                            selectItem_id.selectedIndex = i;
                        }
                    }
                })

                //Reading next X Coordinate bytes
                fs.read(fd, buffer, somador, 176, somador, (err, bytesread, buffer) => {
                    let cloneX = buffer.readFloatLE(112 + somador).toFixed(2);
                    clone.querySelector(".itemX").innerHTML = cloneX;
                })

                //Reading next Y Coordinate bytes
                fs.read(fd, buffer, somador, 176, somador, (err, bytesread, buffer) => {
                    let cloneY = buffer.readFloatLE(116 + somador).toFixed(2);
                    clone.querySelector(".itemY").innerHTML = cloneY;
                })

                //Reading next Z Coordinate bytes
                fs.read(fd, buffer, somador, 176, somador, (err, bytesread, buffer) => {
                    let cloneZ = buffer.readFloatLE(120 + somador).toFixed(2);
                    clone.querySelector(".itemZ").innerHTML = cloneZ;
                })

                table.appendChild(clone); // add new row to end of table

            }

            new Notification("Resident Evil 4 ITA Tool", {
                body: "ITA file opened successfully!"
            })
        })

    }

    // ===============
    // ---- CHUNKS
    // ===============
    let chunk = function () {
        fs.read(fd, buffer, 16, 176, contador, function (err, bytesread, buffer) {

            // Editable fields
            getItem_index = buffer.readInt8(54 + 16);
            getInside = buffer.readInt8(70 + 16);
            getETS = buffer.readUInt8(71 + 16);
            getItem_id = buffer.readUInt8(132 + 16);
            getQuantity = buffer.readInt16LE(136 + 16);
            getRandom = buffer.readUInt8(133 + 16);
            getGlow = buffer.readUInt8(140 + 16);
            getStatus = buffer.readUInt8(144 + 16);
            getItemX = buffer.readFloatLE(96 + 16).toFixed(2);
            getItemY = buffer.readFloatLE(100 + 16).toFixed(2);
            getItemZ = buffer.readFloatLE(104 + 16).toFixed(2);

            // Set value for Index
            var item_index = document.querySelector(".item-index");
            item_index.innerHTML = getItem_index;

            // Set value for Inside
            var inside = document.querySelector(".inside");
            if (getInside == 0) {
                inside.selectedIndex = 0;
            } else if (getInside == 1) {
                inside.selectedIndex = 1;
            } else {
                inside.selectedIndex = 2;
            }

            // Set value for ETS
            var ETS = document.querySelector(".ets");
            ETS.innerText = getETS;

            // Set value for Quantity
            var quantity = document.querySelector(".quantity");
            quantity.innerHTML = getQuantity;

            // Set value for Random
            var random = document.querySelector(".random");
            if (getRandom == 16) {
                random.selectedIndex = 0;
            } else {
                random.selectedIndex = 1;
            }

            // Set value for Glow
            var glow = document.querySelector(".glow");
            if (getGlow == 0) {
                glow.selectedIndex = 0;
            } else if (getGlow == 1) {
                glow.selectedIndex = 1;
            } else if (getGlow == 2) {
                glow.selectedIndex = 2;
            } else if (getGlow == 3) {
                glow.selectedIndex = 3;
            } else if (getGlow == 4) {
                glow.selectedIndex = 4;
            } else if (getGlow == 5) {
                glow.selectedIndex = 5;
            } else if (getGlow == 6) {
                glow.selectedIndex = 6;
            } else if (getGlow == 7) {
                glow.selectedIndex = 7;
            } else if (getGlow == 8) {
                glow.selectedIndex = 8;
            } else if (getGlow == 9) {
                glow.selectedIndex = 9;
            }

            // Set value for Item Status
            var status = document.querySelector(".status");
            if (getStatus == 16) {
                status.selectedIndex = 2;
            } else if (getStatus == 2 || getStatus == 6) {
                status.selectedIndex = 1;
            } else {
                status.selectedIndex = 0;
            }

            // Set value for ID (Item name)
            var item_id = document.querySelector(".item-id");
            for (var i = 0; i < item_id.options.length; i++) {
                if (item_id.options[i].value == getItem_id) {
                    item_id.selectedIndex = i;
                    // break;
                }
            }

            // Set value for X Coordinate
            var itemX = document.querySelector(".itemX");
            itemX.innerText = getItemX;
            // Set value for Y Coordinate
            var itemY = document.querySelector(".itemY");
            itemY.innerText = getItemY;
            // Set value for Z Coordinate
            var itemZ = document.querySelector(".itemZ");
            itemZ.innerText = getItemZ;

        })
    }

    program();

    var row = document.querySelector(".item-row"); // Finding row to copy
    var table = document.querySelector("table"); // Finding table to append to

    //Menu buttons
    closeBtn.addEventListener("click", closeFile);

    //Functions
    function closeFile() {
        fs.closeSync(fd);
        let table = document.querySelector("table");
        while (table.rows.length > 2) {
            table.deleteRow(1);
        }
    }

    // fs.read(fd, buffer, 0, buffer.length, 16, (err, bytesread, buffer) => {
    //     // let edit = buffer.readUint16LE(152);
    // })

    var buffer_ready = Buffer.from(buffer);

    // Save system with write 
    ipcRenderer.on("savefile", (e, arg) => {
        buffer.writeUint16LE(255, 152)
        fs.appendFileSync(arg, buffer_ready)
    })
})
