interface CspConfig {
  [key: string]: string | string[];
}

type ConfigName = "csp.js" | "csp.json";
type ConfigExtension = "js" | "json";

type Mutate<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;

type TemplateElement = Mutate<
  HTMLTemplateElement,
  {
    content: Mutate<DocumentFragment, { firstChild: Element }>;
  }
>;
export { ConfigName, CspConfig, ConfigExtension, TemplateElement };
