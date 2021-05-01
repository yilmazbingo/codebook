// the goal of this plugin is to attempt to fetch some file.
import * as esbuild from "esbuild-wasm";
import axios from "axios";
import localForage from "localforage";

const fileCache = localForage.createInstance({
  name: "filecache",
});

export const fetchPlugin = (inputCode: string) => {
  return {
    name: "fetch-plugin",
    setup(build: esbuild.PluginBuild) {
      // index.js file is resolved, now esbuild attempts to load up a file. if onLoad does not return anything, esbuild will run the code inside and skip to next onLoad(). So we are going to put all caching code in here.
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return {
          loader: "jsx",
          // when esbuild sees `import` it runs onResolve and onLoad again. now it will be looking for something except index.js. so else statement will run
          contents: inputCode,
        };
      });
      // @@@@@@@@@@@@@@@@@@@@@@ CACHING LOGIC @@@@@@@@@@@@@@@@@@@
      // if nothing returned here esbuild will continue to next onLoad
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        // we wont return anything here. we just cache. we return type  OnLoadResult
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );
        if (cachedResult) {
          return cachedResult;
        }
      });

      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);
        const escaped = data
          .replace(/\n/g, "") // first replace will collapse css into one single line. new lines are removed
          .replace(/"/g, '\\"') // this will escape all ""
          .replace(/'/g, "\\'"); // this will escape all ''
        const contents = `
              const style = document.createElement('style');
              style.innerText = '${escaped}';
              document.head.appendChild(style);
            `;

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents,
          //   this will be provided to the next file that we tried to require. it describes where we find the original file.
          // request.responseURL ends with "src/index.js" so "./" will strip off the "/index.js"
          resolveDir: new URL("./", request.responseURL).pathname,
        };
        await fileCache.setItem(args.path, result);
        return result;
      });
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);
        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents: data,
          //   this will be provided to the next file that we tried to require. it describes where we find the original file.
          // request.responseURL ends with "src/index.js" so "./" will strip off the "/index.js"
          resolveDir: new URL("./", request.responseURL).pathname,
        };
        await fileCache.setItem(args.path, result);
        return result;
      });
    },
  };
};
