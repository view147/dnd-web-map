let scale = 1;
let isPanning = false;
let pointX = 0;
let pointY = 0;
let start = { x: 0, y: 0 };

const map = document.getElementById("map");
const viewport = document.getElementById("viewport");

function updateTransform() {
    map.style.transform = `translate(${pointX}px, ${pointY}px) scale(${scale})`;
}

/* ---------- ZOOM ---------- */
viewport.addEventListener("wheel", (e) => {
    e.preventDefault();

    const zoomIntensity = 0.1;
    const direction = e.deltaY > 0 ? -1 : 1;
    const newScale = scale + direction * zoomIntensity;

    scale = Math.min(Math.max(0.2, newScale), 10);
    updateTransform();
}, { passive: false });

/* ---------- PAN ---------- */
viewport.addEventListener("mousedown", (e) => {
    // ถ้า DM ยังไม่มา ห้ามขยับ
    if (document.getElementById("dm-overlay").classList.contains("active")) return;

    isPanning = true;
    start = {
        x: e.clientX - pointX,
        y: e.clientY - pointY
    };
    viewport.style.cursor = "grabbing";
});

window.addEventListener("mouseup", () => {
    isPanning = false;
    viewport.style.cursor = "grab";
});

window.addEventListener("mousemove", (e) => {
    if (!isPanning) return;

    pointX = e.clientX - start.x;
    pointY = e.clientY - start.y;
    updateTransform();
});

