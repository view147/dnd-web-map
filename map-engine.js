let scale = 1;
let panning = false;
let pointX = 0;
let pointY = 0;
let start = { x: 0, y: 0 };

const container = document.getElementById("map-container");
const viewport = document.getElementById("game-viewport");

function updateTransform() {
    container.style.transform = `translate(${pointX}px, ${pointY}px) scale(${scale})`;
}

// ระบบ Zoom (เลื่อนล้อเมาส์)
viewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomSpeed = 0.1;
    if (e.deltaY > 0) scale = Math.max(0.1, scale - zoomSpeed);
    else scale = Math.min(10, scale + zoomSpeed);
    updateTransform();
}, { passive: false });

// ระบบ Pan (ลากเมาส์)
viewport.addEventListener('mousedown', (e) => {
    // ถ้า DM ยังไม่ปลดล็อก ห้ามลาก
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
    pointX = e.clientX - start.x;
    pointY = e.clientY - start.y;
    updateTransform();
});
