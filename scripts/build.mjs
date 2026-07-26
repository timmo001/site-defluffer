import { build } from "esbuild";

await build({
  entryPoints: ["src/popup.ts", "src/sites/twitch/content.ts"],
  bundle: true,
  format: "iife",
  outbase: "src",
  outdir: "extension"
});
