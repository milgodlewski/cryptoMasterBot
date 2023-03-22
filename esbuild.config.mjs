import esbuild from "esbuild";
import chokidar from "chokidar";
import fs from "fs";
import glob from "glob";
import path from "path";
import { promisify } from "util";

const globAsync = promisify(glob);

function copyFiles(globPattern) {
  const entries = glob.sync(globPattern, { nodir: true });
  for (const entry of entries) {
    const outputPath = path.join("dist", path.relative("src", entry));
    fs.promises.mkdir(path.dirname(outputPath), { recursive: true }).catch(() => {});
    fs.promises.copyFile(entry, outputPath)
    .then(() => console.log(`Copied ${entry} to ${outputPath}`))
    .catch((err) => console.error(`Error copying ${entry} to ${outputPath}: ${err.message}`));
  }
}

const options = {
  entryPoints: ["src/index.mjs"],
  bundle: true,
  outfile: "dist/bundle.js",
  sourcemap: true,
  format: "esm",
  define: { "process.env.NODE_ENV": '"production"' },
  loader: {
    ".js": "jsx",
  },
  inject: ["./src/plotly-shim.js"],
};

function build() {
  esbuild.build(options).catch(() => process.exit(1));
  copyFiles("src/**/*.html");
  copyFiles("src/**/*.css");
}


function createDistFolder() {
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
  }
}

createDistFolder();
fs.copyFileSync("src/index.html", "dist/index.html");
build();

chokidar.watch("src/**/*.mjs").on("change", build);
chokidar.watch("src/**/*.html").on("change", build);
chokidar.watch("src/**/*.css").on("change", build);
