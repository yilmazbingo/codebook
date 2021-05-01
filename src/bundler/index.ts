import * as esbuild from "esbuild-wasm";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";

let service: esbuild.Service;

// rawCode is what user enters
// named function is helpful for debugging. bundle() is called in code-cell
const bundle = async (rawCode: string) => {
  // when first time we run the code, start the service, assign it to the service
  if (!service) {
    service = await esbuild.startService({
      worker: true,
      // wasmURL: "/assets/esbuild.wasm",
      // instead of getting file from node_modules, we import
      wasmURL: "https://unpkg.com/esbuild-wasm@0.8.42/esbuild.wasm",
    });
  }

  // we catch this error to show inside iframe
  try {
    const result = await service.build({
      // we want index.js to be bundled inside of our application. Once esbuild try to find this file, by default, it checks hard drive. but with plugins we tell what to do. If user, writes something in textarea, we want that to be our entry point. We need to communcate "input" into our plugin as contents.
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      // fetchPlugin(input) will take the input and traspile it.
      plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
      // global:window is done by webpack automatically. with esbuild we provide.
      define: { "process.env.NODE_ENV": '"production"', global: "window" },
      // jsxFactory and jsxFragment are added to avoid namin collisions
      jsxFactory: "_React.createElement",
      jsxFragment: "_React.Fragment",
    });
    // we return obj to distinguish if something went wrong or not.
    return { code: result.outputFiles[0].text, error: "" };
  } catch (e) {
    // e.message is string.
    console.log("errr in catch of build function", e);
    return { code: "", error: e.message };
  }
};

export default bundle;
