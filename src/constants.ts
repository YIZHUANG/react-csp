import { ConfigExtension } from "./types";

let filename = "index.html";
const args = process.argv.slice(2);

args.forEach(function (value, index) {
  if(value === '--filename' || value === '--f') {
    if(args[index+1]) {
      filename = args[index+1];
    }
  }
});

const baseDir = process.cwd();
const configPath = (extension: ConfigExtension) =>
  process.cwd() + `/csp.${extension}`;
const htmlPath = process.cwd() + `/public/${filename}`;

export { baseDir, configPath, htmlPath, filename };
