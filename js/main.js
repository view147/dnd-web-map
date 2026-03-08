console.log("DND WEB MAP LOADED")

/* PAGE LOADED */

document.addEventListener("DOMContentLoaded", () => {

console.log("Page ready")

initStartButton()

})

/* START GAME BUTTON */

function initStartButton(){

const startBtn = document.querySelector(".start-btn")

if(!startBtn) return

startBtn.addEventListener("click", () => {

console.log("Start Game clicked")

// ไปหน้า map
window.location.href = "pages/map.html"

})

}
