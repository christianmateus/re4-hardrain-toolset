const fs = require('fs');
const { ipcRenderer } = require('electron');

const ETS = document.getElementById("ets-card");
const ITA = document.getElementById("ita-card");
const AEV = document.getElementById("aev-card");

// Window menu buttons
const minimizeBtn = document.getElementById("minimize")
const maximizeBtn = document.getElementById("maximize")
const closeWindowBtn = document.getElementById("closeWindow")

// Eventos
ETS.addEventListener("click", function () {
    ipcRenderer.send("openETStool")
})

ITA.addEventListener("click", function () {
    ipcRenderer.send("openITAtool")
})

AEV.addEventListener("click", function () {
    ipcRenderer.send("openAEVtool")
})

// Window menu actions
minimizeBtn.addEventListener("click", () => {
    ipcRenderer.send("minimize")
})

maximizeBtn.addEventListener("click", () => {
    ipcRenderer.send("maximize")
})

closeWindowBtn.addEventListener("click", () => {
    ipcRenderer.send("closeWindow")
})
