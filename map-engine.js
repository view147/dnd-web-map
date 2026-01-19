let scale = 1;
let panning = false;
let pointX = 0;
let pointY = 0;
let start = { x: 0, y: 0 };

const container = document.getElementById("map-container");
const viewport = document.getElementById("game-viewport");

// ฟังชันอัปเดตตำแหน่ง
function updateTransform() {
    container.style.transform = `translate(${pointX}px, ${pointY}px) scale(${scale})`;
}

// ระบบ Zoom
viewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomSpeed = 0.1;
    if (e.deltaY > 0) scale = Math.max(0.2, scale - zoomSpeed);
    else scale = Math.min(10, scale + zoomSpeed); // ซูมได้สูงสุด 10 เท่า
    updateTransform();
}, { passive: false });

// ระบบ Pan (ลากแผนที่)
viewport.addEventListener('mousedown', (e) => {
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
