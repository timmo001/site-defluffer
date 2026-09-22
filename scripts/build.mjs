import { build } from "esbuild";
import { readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import manifest from "../extension/manifest.json" with { type: "json" };

const contentScriptOutputs = manifest.content_scripts.flatMap(
  (contentScript) => contentScript.js ?? []
);

const contentScriptSources = contentScriptOutputs.map((output) => {
  if (extname(output) !== ".js") {
    throw new Error(`Content script must be JavaScript: ${output}`);
  }

  return resolve("src", output.replace(/\.js$/, ".ts"));
});

const backgroundOutput = manifest.background?.service_worker;

const backgroundSource = backgroundOutput
  ? resolve("src", backgroundOutput.replace(/\.js$/, ".ts"))
  : null;

await build({
  entryPoints: [
    "src/popup.ts",
    ...contentScriptSources,
    ...(backgroundSource ? [backgroundSource] : [])
  ],
  bundle: true,
  format: "iife",
  loader: { ".woff2": "file" },
  outbase: "src",
  outdir: "extension"
});

const popupHtml = await readFile(
  resolve("extension", manifest.action.default_popup),
  "utf8"
);

const popupAssets = [
  ...popupHtml.matchAll(/<(?:link|script)\b[^>]+(?:href|src)="([^"]+)"/g)
].map((match) => {
  const asset = match[1];

  if (asset === undefined) {
    throw new Error("Missing popup asset path.");
  }

  return asset;
});

await Promise.all(
  [
    ...contentScriptOutputs,
    ...(backgroundOutput ? [backgroundOutput] : []),
    ...popupAssets
  ].map((asset) => readFile(resolve("extension", asset)))
);
