const viewport = document.getElementById("viewport");

let map; // SVG จริงจะมาอยู่ตรงนี้

let scale = 1;
let pos = { x: 0, y: 0 };
let dragging = false;
let start = { x: 0, y: 0 };

// โหลด SVG
fetch("maps/pale_south.svg")
  .then(res => res.text())
  .then(svg => {
    viewport.innerHTML = svg;
    map = viewport.querySelector("svg");
    map.id = "map";
    updateTransform();
  });

function updateTransform() {
  if (!map) return;
  map.style.transform =
    `translate(${pos.x}px, ${pos.y}px) scale(${scale})`;
  map.style.transformOrigin = "0 0";
}

/* ---------- Drag ---------- */
viewport.addEventListener("mousedown", (e) => {
  dragging = true;
  start.x = e.clientX - pos.x;
  start.y = e.clientY - pos.y;
});

window.addEventListener("mouseup", () => dragging = false);

window.addEventListener("mousemove", (e) => {
  if (!dragging || !map) return;
  pos.x = e.clientX - start.x;
  pos.y = e.clientY - start.y;
  updateTransform();
});

/* ---------- Zoom ---------- */
viewport.addEventListener("wheel", (e) => {
  e.preventDefault();
  if (!map) return;

  const zoom = e.deltaY < 0 ? 1.1 : 0.9;
  scale *= zoom;
  scale = Math.min(Math.max(scale, 0.2), 8); // จำกัดซูม
  updateTransform();
});
