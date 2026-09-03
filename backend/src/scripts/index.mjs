import fs from "fs-extra";

async function copyAssets() {
  await fs.copy("src/views", "dist/views");
  console.log("✅ Views copied to dist/views");
}

copyAssets();