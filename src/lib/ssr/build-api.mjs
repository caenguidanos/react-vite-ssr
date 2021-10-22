import esbuild from "esbuild";

await esbuild.build({
   entryPoints: ["src/api/index.ts"],
   outdir: "dist/api",
   platform: "node",
   format: "cjs",
   target: "node16",
   bundle: true,
   treeShaking: true,
   external: ["express"],
   minify: process.env.NODE_ENV === "production",
});
