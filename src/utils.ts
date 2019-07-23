import * as util from "util";
import * as fs from "fs";
import chalk from "chalk";

import { baseDir, configPath, htmlPath } from "./constants";
import { CspConfig } from "./types";

let env = "prod";
const args = process.argv.slice(2);

if (Array.isArray(args) && args[0] !== undefined) {
  env = args[0];
  console.log(`Using ${chalk.cyan(env)} as the environment`);
} else {
  console.log(`No env found, using ${chalk.cyan("prod")} as the default`);
}

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const patterns = {
  configName: new RegExp("(^|\\W)" + "(csp*?.(js|json))" + "($|\\W)", "gi"),
  configExtenstion: /(?:\.([^.]+))?$/,
};

async function getConfig() {
  const allFiles = fs.readdirSync(baseDir);
  const fileName = allFiles.find(fileName =>
    Array.isArray(fileName.match(patterns.configName))
  );
  console.log(
    `Reading config from ${baseDir} for ${chalk.cyan("csp.js")} or ${chalk.cyan(
      "csp.json"
    )}`
  );
  if (!fileName) {
    throw new Error("No csp config found, should be either csp.json or csp.js");
  }
  const fileExtenstions = patterns.configExtenstion.exec(fileName);
  if (
    !fileExtenstions ||
    (fileExtenstions[1] !== "json" && fileExtenstions[1] !== "js")
  ) {
    throw new Error("csp should have either js or json as the extension");
  }
  const fileExtension = fileExtenstions[1];
  let config = null;
  if (fileExtension === "json") {
    try {
      config = JSON.parse(await readFile(configPath(fileExtension), "utf8"));
    } catch (e) {
      throw e;
    }
  }
  if (fileExtension === "js") {
    config = require(configPath(fileExtension));
  }
  if (!config[env]) {
    throw new Error(
      `Environment ${env} is not found at the config as a key, please refer to the documentation`
    );
  }
  return config[env];
}

async function loadHTML() {
  try {
    console.log(`Loading existing from ${chalk.red(htmlPath)}`);
    const html = await readFile(htmlPath, "utf8");
    console.log(`${chalk.green("HTML")} is loaded`);
    return html;
  } catch (e) {
    throw e;
  }
}
async function writeToHtml(html: string) {
  console.log(
    `Writing to HTML with the ${chalk.greenBright("new")} CSP policy`
  );
  try {
    await writeFile(htmlPath, html, "utf8");
    console.log(chalk.blue("Successfully generated CSP in index.html!"));
  } catch (e) {
    console.log(chalk.red("Fail to generate CSP policy..."));
    throw e;
  }
}
function formatCSP(config: CspConfig): string {
  let content = "";
  for (const key in config) {
    const strs = config[key];
    content += `${key} `;
    if (Array.isArray(strs)) {
      content += strs.join(" ");
    } else {
      content += strs;
    }
    content += "; ";
  }
  return `<meta http-equiv="Content-Security-Policy" content="${content}" />`;
}

export { readFile, writeFile, getConfig, loadHTML, writeToHtml, formatCSP };
