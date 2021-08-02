import { ConfigExtension } from "./types";


let filename = "index.html";
const args = process.argv.slice(2);

if (Array.isArray(args) && args[1] !== undefined) {
  filename = args[1];
  console.log(`Using ${args[1]} as the file name`);
} 

const baseDir = process.cwd();
const configPath = (extension: ConfigExtension) =>
  process.cwd() + `/csp.${extension}`;
const htmlPath = process.cwd() + `/public/${filename}`;

export { baseDir, configPath, htmlPath, filename };
