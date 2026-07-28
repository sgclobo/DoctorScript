const fs = require("fs");
const path = require("path");

const distDir = path.join(__dirname, "..", "dist");

if (!fs.existsSync(distDir)) {
  throw new Error(`dist directory not found at ${distDir}`);
}

const htmlFiles = fs
  .readdirSync(distDir)
  .filter((fileName) => fileName.endsWith(".html"));

for (const fileName of htmlFiles) {
  if (fileName === "index.html") {
    continue;
  }

  const routeName = fileName.replace(/\.html$/, "");
  const sourcePath = path.join(distDir, fileName);

  if (routeName === "+not-found") {
    const notFoundTarget = path.join(distDir, "404.html");
    fs.copyFileSync(sourcePath, notFoundTarget);
    continue;
  }

  const routeDir = path.join(distDir, routeName);
  fs.mkdirSync(routeDir, { recursive: true });
  fs.copyFileSync(sourcePath, path.join(routeDir, "index.html"));
}

console.log("Prepared deploy-friendly route folders in dist/");
