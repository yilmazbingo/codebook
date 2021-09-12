"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serve = void 0;
var path_1 = __importDefault(require("path"));
var express_1 = __importDefault(require("express"));
var http_proxy_middleware_1 = require("http-proxy-middleware");
var cells_1 = require("./routes/cells");
// browser will make request to local api to get the react files. we are building proxy inside local api
//
var serve = function (port, filename, dir, useProxy) {
    var app = express_1.default();
    // First see if this route hadnlers matches any. If not, then use the proxy middleware
    app.use(cells_1.createCellsRouter(filename, dir));
    // this will proxy the requeest to the local react dev server. this is set for development env. in cli we add "useProxy" option
    if (useProxy) {
        app.use(http_proxy_middleware_1.createProxyMiddleware({
            target: "htpp://localhost:3000",
            // create-react-app tells browser that development files changed
            ws: true,
            // hide all logs coming from proxy middleware
            logLevel: "silent",
        }));
    }
    else {
        // we added client dependency. but we cannot go to "../node_modules/client/build". becasue express.static does not work well with symbolic links. we have to resolve symbolic link into absolute path.
        // require.resolve does not load up a file. It is going to apply node's path resolution algorighm to figure out the directory. packagePath is absolute path.
        // path.dirname() gives the directory name.
        var packagePath = require.resolve("@js-codebook/client/build/index.html");
        app.use(express_1.default.static(path_1.default.dirname(packagePath)));
        // we cannot reference files between different packages .
        // Eventually we deplpy all packages to npm. Each package will be archived and sent to npm registry.  each will be independnt. They are not siblings, so we cannot write a path to another package.
        // we link "client" to "local-api" `lerna add client --scope=local-api` this adds dependency
    }
    return new Promise(function (resolve, reject) {
        //on is used to add a callback function that's going to be executed when the event is triggered
        app.listen(port, resolve).on("error", reject);
    }).catch(function (error) { return console.log("catch in new promise serve", error); });
};
exports.serve = serve;
