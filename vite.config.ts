import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/dnd-web-map/",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        gm: resolve(__dirname, "gm.html"),
        player: resolve(__dirname, "player.html"),
        setup: resolve(__dirname, "setup.html"),
      },
    },
  },
});
