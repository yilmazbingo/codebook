import { program } from "commander";
import { serveCommand } from "./commands/serve";

program.addCommand(serveCommand);

// we need to install @types/node for process via lerna command
//lerna add @types/node --dev --scope=cli
// If I do not mention --scope, it would install in each package inside the packages.
program.parse(process.argv);
