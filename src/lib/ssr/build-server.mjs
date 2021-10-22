import esbuild from "esbuild";

await esbuild.build({
   entryPoints: ["src/lib/ssr/server.ts"],
   outdir: "dist",
   platform: "node",
   format: "cjs",
   target: "node16",
   bundle: false,
   treeShaking: true,
   minify: process.env.NODE_ENV === "production",
});
