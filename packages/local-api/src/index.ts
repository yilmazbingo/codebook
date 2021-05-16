import path from "path";
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { createCellsRouter } from "./routes/cells";

// browser will make request to local api to get the react files. we are building proxy inside local api
//
export const serve = (
  port: number,
  filename: string,
  dir: string,
  useProxy: boolean
) => {
  const app = express();

  // First see if this route hadnlers matches any. If not, then use the proxy middleware
  app.use(createCellsRouter(filename, dir));

  // this will proxy the requeest to the local react dev server. this is set for development env. in cli we add "useProxy" option
  if (useProxy) {
    app.use(
      createProxyMiddleware({
        target: "htpp://localhost:3000",
        // create-react-app tells browser that development files changed
        ws: true,
        // hide all logs coming from proxy middleware
        logLevel: "silent",
      })
    );
  } else {
    // we added client dependency. but we cannot go to "../node_modules/client/build". becasue express.static does not work well with symbolic links. we have to resolve symbolic link into absolute path.
    // require.resolve does not load up a file. It is going to apply node's path resolution algorighm to figure out the directory. packagePath is absolute path.
    // path.dirname() gives the directory name.
    const packagePath = require.resolve("@js-codebook/client/build/index.html");
    app.use(express.static(path.dirname(packagePath)));
    // we cannot reference files between different packages .
    // Eventually we deplpy all packages to npm. Each package will be archived and sent to npm registry.  each will be independnt. They are not siblings, so we cannot write a path to another package.
    // we link "client" to "local-api" `lerna add client --scope=local-api` this adds dependency
  }

  return new Promise<void>((resolve, reject) => {
    //on is used to add a callback function that's going to be executed when the event is triggered
    app.listen(port, resolve).on("error", reject);
  });
};
