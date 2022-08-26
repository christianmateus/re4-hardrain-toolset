const fs = require('fs');
const { ipcRenderer } = require('electron');

const ETS = document.getElementById("ets-card");
const ITA = document.getElementById("ita-card");

// Eventos
ETS.addEventListener("click", function () {
    ipcRenderer.send("openETStool")
})

ITA.addEventListener("click", function () {
    ipcRenderer.send("openITAtool")
})
