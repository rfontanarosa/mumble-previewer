import { Config } from "./config";
import { replaceAll } from "./utils";

const NEUGIER_CHAR_PAIRS: [string, number][] = [
  [":", 2],
  [".'", 3],
  [",!)Iilì(", 4],
  ["j", 5],
  ["…” J‘ft-“1", 6],
  ["?Lacegorsàèéàò", 7],
  ["ABCDEFGHKMNOPQRSTUVWYZbdhkmnpquvwxyzùÈ023456789~+;", 8],
];

const NEUGIER_REGEXES: [string | RegExp, string][] = [[/\{..\}/g, ""]];

const NEUGIER_TEXT_REPLACER = (text: string): string => {
  text = replaceAll(text, NEUGIER_REGEXES);
  const dialogs = [];
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i += 4) {
    const dialog = lines.slice(i, i + 4).join("\n");
    dialogs.push(dialog);
  }
  text = dialogs.join("\r");
  return text;
};

export const neugierConfig: Config = {
  charLimit: 240,
  lineLimit: 4,
  boxClasses: ["snes-256x224", "neugier-box"],
  fontClass: "neugier-font1",
  charWidthPairs: NEUGIER_CHAR_PAIRS,
  replacer: NEUGIER_TEXT_REPLACER,
  autoParagraphBreak: false,
};
