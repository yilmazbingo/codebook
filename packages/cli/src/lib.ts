import fs from "fs";
const json = JSON.parse(fs.readFileSync("package.json", "utf8"));
export const version = json.version;
console.log("version", version);
