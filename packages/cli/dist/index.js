"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var serve_1 = require("./commands/serve");
commander_1.program.addCommand(serve_1.serveCommand);
// we need to install @types/node for process via lerna command
//lerna add @types/node --dev --scope=cli
// If I do not mention --scope, it would install in each package inside the packages.
commander_1.program.parse(process.argv);
