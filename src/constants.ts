import { ConfigExtension } from "./types";

const baseDir = process.cwd();
const configPath = (extension: ConfigExtension) =>
  process.cwd() + `/csp.${extension}`;
const htmlPath = process.cwd() + "/public/index.html";

export { baseDir, configPath, htmlPath };
