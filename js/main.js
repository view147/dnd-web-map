console.log("DND WEB MAP LOADED")

/* PAGE LOADED */

document.addEventListener("DOMContentLoaded", () => {

console.log("Page ready")

initStartButton()

})

/* START GAME BUTTON */

function initStartButton(){

const startBtns = document.querySelectorAll(".start-btn")

if(startBtns.length === 0) return

startBtns.forEach(btn => {

btn.addEventListener("click", () => {

console.log("Chapter clicked")

})

})

}
