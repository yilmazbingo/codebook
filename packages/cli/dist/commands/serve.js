"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serveCommand = void 0;
var path_1 = __importDefault(require("path"));
var commander_1 = require("commander");
var local_api_1 = require("local-api");
//[] indicates that this is optional
// <> indicates that this is a required value
exports.serveCommand = new commander_1.Command()
    .command("serve [filename]")
    // when user enters node index.js --help, it sees description
    .description("Open a file for editing")
    .option("-p, --port <number>", "port to run server on", "4005")
    // first arg will be the arg that passed in command()
    // second arg is all other options
    .action(function (filename, options) {
    if (filename === void 0) { filename = "codebook.js"; }
    // console.log(path.join(process.cwd()), path.dirname(filename));
    // console.log(path.basename(filename));
    var dir = path_1.default.join(process.cwd(), path_1.default.dirname(filename));
    local_api_1.serve(parseInt(options.port), path_1.default.basename(filename), dir);
});
//path.basename(filename) gives the file name even if "motes/notebook.js" is passed
