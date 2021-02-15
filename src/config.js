/** config.js */

import yaml from "js-yaml";
import fs from "fs";
import path from "path";

const config = new Map(),
  defaultConfig = "default-config.yml";

let file, files, filepath, name;

filepath = path.join(process.cwd(), "config");
files = fs.readdirSync(filepath);

for (file of files) {
  try {
    if (file === defaultConfig) continue;
    name = file.split(".")[0];
    let data = yaml.load(fs.readFileSync(`${filepath}/${file}`, "utf8"));
    config.set(data.serverName, data);
  } catch (e) {
    console.error(`Failed to load configuration for '${name}' server.`);
    console.error(e);
  }
}

console.log("All configuration files loaded!");

export default config;
