import { defineConfig } from "vite"
import { fileURLToPath } from "url"
import { resolve, dirname } from "path"
import { viteStaticCopy } from "vite-plugin-static-copy"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  resolve: {
    alias: {
      src: resolve(__dirname, "src"),
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "assets/*",
          dest: "assets",
        },
      ],
    }),
  ],
})
