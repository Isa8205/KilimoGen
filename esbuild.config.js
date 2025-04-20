// build.js
require("dotenv").config();
const esbuild = require("esbuild");
const path = require("path");
const { types } = require("util");

const isProd = process.env.NODE_ENV === "production";

const shared = {
  bundle: true,
  platform: "node",
  sourcemap: !isProd,
  minify: isProd,
  target: "es2020",
  external: ["electron", "mock-aws-s3", "aws-sdk", "nock", "/*.html"],
};

const builds = [
  {
    entryPoints: ["src/main/electron/main.ts"],
    outfile: "dist/main.js",
    ...shared,
  },
  {
    entryPoints: ["src/main/electron/preload.ts"],
    outfile: "dist/preload.js",
    platform: "browser", // because it's run in the renderer context
    ...shared,
  },
];

(async () => {
  try {
    for (const config of builds) {
      const result = await esbuild.build(config);
      console.log(`✅ Built: ${path.basename(config.outfile)}`);
    }
  } catch (err) {
    console.error("❌ Build failed", err);
    process.exit(1);
  }
})();
