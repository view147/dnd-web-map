const overlay = document.getElementById("dm-overlay");
const unlockBtn = document.getElementById("unlock-btn");

function unlockGame() {
    overlay.classList.remove("active");
    console.log("Session Started");
    // ในอนาคตสามารถใส่ระบบส่งสัญญาณไปหาผู้เล่นคนอื่นได้ที่นี่
}

unlockBtn.addEventListener('click', unlockGame);
