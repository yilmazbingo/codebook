import path from "path";
import { Command } from "commander";
import { serve } from "@js-codebook/local-api";

const isProduction = process.env.NODE_ENV === "production";

//[] indicates that this is optional
// <> indicates that this is a required value
export const serveCommand = new Command()
  .command("serve [filename]")
  // when user enters node index.js --help, it sees description
  .description("Open a file for editing")
  .option("-p, --port <number>", "port to run server on", "4005")
  // first arg will be the arg that passed in command()
  // second arg is all other options
  .action(async (filename = "codebook.js", options: { port: string }) => {
    // console.log(path.join(process.cwd()), path.dirname(filename));
    // console.log(path.basename(filename));
    try {
      const dir = path.join(process.cwd(), path.dirname(filename));
      // if we are on production, we are not going to use proxy. !isProduction will be false
      await serve(
        parseInt(options.port),
        path.basename(filename),
        dir,
        !isProduction
      );
      console.log(
        `Opened ${filename}. Navigate to http://localhost:${options.port} to edit the file`
      );
    } catch (error) {
      if (error.code === "EADDRINUSE") {
        console.error("Port is in use. Try runnng on a different port ");
      } else {
        console.log("Issue is :", error.message);
      }
      process.exit(1);
    }
  });
//path.basename(filename) gives the file name even if "motes/notebook.js" is passed
