// map-engine.js - ระบบควบคุมแผนที่ (Zoom & Pan)
let scale = 1;
let panning = false;
let pointX = 0;
let pointY = 0;
let start = { x: 0, y: 0 };

const container = document.getElementById("map-container");
const viewport = document.getElementById("game-viewport");

// ฟังชันอัปเดตตำแหน่ง (ปรับปรุงให้ซูมลื่นขึ้นสำหรับแผนที่หลายภาค)
function updateTransform() {
    // ใช้ translate ควบคู่กับ scale โดยอ้างอิงจากจุดที่เซตไว้ใน CSS
    container.style.transform = `translate(${pointX}px, ${pointY}px) scale(${scale})`;
}

// ระบบ Zoom (เลื่อนลูกล้อเมาส์)
viewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomSpeed = 0.1;
    const oldScale = scale;

    // คำนวณ Scale ใหม่
    if (e.deltaY > 0) {
        scale = Math.max(0.1, scale - zoomSpeed); // ซูมออกได้เล็กสุด 0.1
    } else {
        scale = Math.min(15, scale + zoomSpeed);  // ซูมเข้าได้สูงสุด 15 เท่า (สะใจแน่นอน)
    }

    updateTransform();
}, { passive: false });

// ระบบ Pan (คลิกซ้ายค้างเพื่อลากแผนที่)
viewport.addEventListener('mousedown', (e) => {
    // ป้องกันการลากถ้า DM Lock ยังทำงานอยู่ (เช็คจาก class)
    if (document.getElementById("dm-overlay").classList.contains("active")) return;

    panning = true;
    start = { x: e.clientX - pointX, y: e.clientY - pointY };
    viewport.style.cursor = "grabbing";
});

window.addEventListener('mouseup', () => {
    panning = false;
    viewport.style.cursor = "grab";
});

window.addEventListener('mousemove', (e) => {
    if (!panning) return;
    
    // คำนวณระยะที่ลาก
    pointX = e.clientX - start.x;
    pointY = e.clientY - start.y;
    
    updateTransform();
});

// เพิ่มระบบรองรับ Touch Screen (สำหรับ iPad/Tablet)
viewport.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
        panning = true;
        start = { x: e.touches[0].clientX - pointX, y: e.touches[0].clientY - pointY };
    }
}, { passive: false });

window.addEventListener('touchend', () => {
    panning = false;
});

window.addEventListener('touchmove', (e) => {
    if (!panning || e.touches.length !== 1) return;
    pointX = e.touches[0].clientX - start.x;
    pointY = e.touches[0].clientY - start.y;
    updateTransform();
}, { passive: false });
