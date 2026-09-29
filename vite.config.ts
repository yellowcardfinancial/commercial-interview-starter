import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { ratesApiPlugin } from "./server/api";

export default defineConfig({
  plugins: [vue(), ratesApiPlugin()],
  server: { port: 5173 },
});
