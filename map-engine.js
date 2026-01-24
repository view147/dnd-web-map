let scale = 1;
let panning = false;
let pointX = 0;
let pointY = 0;
let start = { x: 0, y: 0 };

const container = document.getElementById("map-container");
const viewport = document.getElementById("game-viewport");

function updateTransform() {
    container.style.transform =
        `translate(${pointX}px, ${pointY}px) scale(${scale})`;
}

viewport.addEventListener("wheel", (e) => {
    e.preventDefault();
    const zoom = 0.1;
    scale += e.deltaY < 0 ? zoom : -zoom;
    scale = Math.min(Math.max(0.3, scale), 5);
    updateTransform();
}, { passive: false });

viewport.addEventListener("mousedown", (e) => {
    if (document.getElementById("dm-overlay").classList.contains("active")) return;
    panning = true;
    start = { x: e.clientX - pointX, y: e.clientY - pointY };
    viewport.style.cursor = "grabbing";
});

window.addEventListener("mouseup", () => {
    panning = false;
    viewport.style.cursor = "grab";
});

window.addEventListener("mousemove", (e) => {
    if (!panning) return;
    pointX = e.clientX - start.x;
    pointY = e.clientY - start.y;
    updateTransform();
});
