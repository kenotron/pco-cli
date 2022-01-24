import dotenv from "dotenv";
import pLimit from "p-limit";
import path from "path/posix";
import yargs from "yargs";
import { exportCommand } from "./commands/exportCommand";
import { initCommand } from "./commands/initCommand";

dotenv.config();

yargs(process.argv.slice(2))
  .usage("$0 [--option value] [command]")
  .command(
    "export",
    "Exports data from Planning Center",
    (builder) =>
      builder
        .positional("products", {
          description: "Products to be exported (not used yet)",
          type: "string",
          demandOption: true,
        })
        .array("products")
        .options("outdir", {
          alias: ["o"],
          description: "output directory",
          default: path.join(process.cwd(), "exported", new Date().toISOString()),
        }),
    (args) => {
      exportCommand(args);
    }
  )
  .command(
    "*",
    "Initializes the .env file for use in this tool",
    (builder) => builder,
    () => {
      initCommand();
    }
  )
  .recommendCommands()
  .showHelpOnFail(true, "Specify --help for available options")
  .parseSync();
