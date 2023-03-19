import esbuild from "esbuild";
import chokidar from "chokidar";
import { createServer } from "esbuild-serve";

const options = {
  entryPoints: ["src/index.mjs"],
  bundle: true,
  outfile: "dist/bundle.js",
  sourcemap: true,
};

function build() {
  esbuild.build(options).catch(() => process.exit(1));
}

build();

chokidar.watch("src/**/*.mjs").on("change", build);

createServer({
  servedir: "src",
  port: 3000,
});
