import { JSDOM, DOMWindow } from "jsdom";
import chalk from "chalk";

import { TemplateElement } from "./types";
import { getConfig, loadHTML, writeToHtml, formatCSP } from "./utils";

const cspSelector = 'meta[http-equiv="Content-Security-Policy"]';

async function reactCsp() {
  const config = await getConfig();
  const html = await loadHTML();
  const csp = formatCSP(config);
  const newHTML = reshapeHTML(html, csp);
  await writeToHtml(newHTML);
}

function reshapeHTML(oldHTML: string, csp: string) {
  const dom = new JSDOM(oldHTML);
  const {
    window: { document },
  } = dom;
  const foundCSP = document.querySelector(cspSelector);
  const cspElement = cspToHtmlElement(document, csp);
  if (cspElement === null) {
    throw new Error("Failed to create CSP to html tag");
  }
  if (foundCSP !== null) {
    console.log(
      `Found existing CSP tag ${chalk.underline(
        "present"
      )} in the HTML file, replacing it with the new one...`
    );
    foundCSP.replaceWith(cspElement);
  } else {
    const head = document.querySelector("head");
    if (!head) {
      throw new Error("No <head /> tag present in the HTML file");
    }
    console.log(
      `${chalk.red(
        "No CSP tag present"
      )} in the HTML file, inserting it at the end of the <head> tag`
    );
    head && head.insertAdjacentElement("beforeend", cspElement);
  }
  const newHTML = dom.serialize();
  return newHTML;
}

function cspToHtmlElement(document: DOMWindow["document"], csp: string) {
  const template = document.createElement("template") as TemplateElement;
  template.innerHTML = csp;
  return template.content.firstChild;
}

export default reactCsp;
