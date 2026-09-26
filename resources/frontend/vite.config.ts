import path from "path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(({ mode }) => ({
    plugins: [react(), tailwindcss()],

    base: mode === "development" ? "/" : "/app/",

    server: {
        port: 5173,
        strictPort: true,
        cors: true,
        proxy: {
            "/api": {
                target: "http://localhost:8000",
                changeOrigin: true,
            },
            "/public": {
                target: "http://localhost:8000",
                changeOrigin: true,
            },
        },
    },

    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },

    build: {
        outDir: "../../public/app",
        emptyOutDir: true,
        chunkSizeWarningLimit: 1200,
    },
}));
