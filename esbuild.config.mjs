import esbuild from "esbuild";
import chokidar from "chokidar";
import fs from "fs";
import glob from "glob";
import path from "path";
import { promisify } from "util";
import pkg from 'esbuild-plugin-postcss2';
import postcss from "postcss";
import postcssImport from "postcss-import";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

const { default: createPostcssPlugin } = pkg;

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
  plugins: [
    createPostcssPlugin({
      plugins: [postcssImport, tailwindcss, autoprefixer],
      onEnd: async ({ css }) => {
        if (css) {
          await fs.promises.writeFile("dist/tailwind.css", css);
        }
      },
    }),
  ],
};

async function build() {
  const inputCss = await fs.promises.readFile("src/tailwind.css", "utf8");
  const output = await postcss([tailwindcss, autoprefixer]).process(inputCss, { from: "src/tailwind.css", to: "dist/tailwind.css" });
  await fs.promises.writeFile("dist/tailwind.css", output.css);
}

function createDistFolder() {
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
  }
}

createDistFolder();
fs.copyFileSync("src/index.html", "dist/index.html");
async function runBuild() {
  await esbuild.build(options);
}

runBuild();

chokidar.watch("src/**/*.mjs").on("change", runBuild);
chokidar.watch("src/**/*.html").on("change", () => {
  fs.copyFileSync("src/index.html", "dist/index.html");
});
chokidar.watch("src/**/*.css").on("change", build);
chokidar.watch("src/**/*.mjs").on("change", build);