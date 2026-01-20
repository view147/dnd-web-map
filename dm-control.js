const overlay = document.getElementById("dm-overlay");
const unlockBtn = document.getElementById("unlock-btn");

// ตรวจสถานะตอนโหลดหน้า
if (localStorage.getItem("dmUnlocked") === "true") {
    overlay.classList.remove("active");
}

// ฟังก์ชันปลดล็อก
function unlockGame() {
    overlay.classList.remove("active");
    localStorage.setItem("dmUnlocked", "true");
    console.log("Session Started");
}

// คลิกปุ่ม DM
unlockBtn.addEventListener("click", unlockGame);
