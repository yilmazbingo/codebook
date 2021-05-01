import * as esbuild from "esbuild-wasm";
// both plugins communicate each other with the "filter" and namespace

export const unpkgPathPlugin = () => {
  return {
    // name property is just for debugging. You might have several different plugins inside of your project.
    name: "unpkg-path-plugin",
    // setup will be called by esbuild automatically. build represents the bundling process. the entire process of finding some file, loading up,parsing it and joining a bunch of files together
    // onResolve and onLoad are event listeners
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  HANDLE MAIN FILE @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /(^index\.js$)/ }, () => {
        return { path: "index.js", namespace: "a" };
      });
      // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@ HANDLE RELATIVE PATHs IN MODULE @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
      // this file find "./" or "../"
      build.onResolve({ filter: /^\.+\// }, (args: any) => {
        return {
          namespace: "a",
          // "/" this represents relative  path. so args.path will be added to args.importer. args.importer/args.path
          path: new URL(args.path, "https://unpkg.com" + args.resolveDir + "/")
            .href,
        };
      });
      // figure out where the index.js file is stored. it returns the path of "index.js"
      // filter: operates on the path of the file. it controls whether or not any given file that esbuild is attempting to resolve the path for, should use this function. we can add multiple calls to resolve() and give each of them a different filter to control which file goes to which onResolve function instead of if statements
      // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@ HANDLE  Main file of module @@@@@@@@@@@@@@@@@@@@@@@@@@@@@
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log("onResolve", args);
        // namespace is used similar to how filter is used. this resolved file has a namespace:a. If we have different onResolve and onLoad functions, each onLoad will get the files from the namespace that it is given.
        return { namespace: "a", path: `https://unpkg.com/${args.path}` };
      });
    },
  };
};
