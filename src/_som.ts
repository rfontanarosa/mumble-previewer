import { Config } from "./config";
import { replaceAll } from "./utils";

const SOM_CHAR_PAIRS: [string, number][] = [
  [" abcdefghijklmno", 8],
  ["pqrstuvwxyzABCDE", 8],
  ["FGHIJKLMNOPQRSTU", 8],
  ["VWXYZ0123456789.", 8],
  [",/'“”:-%!&?()✕▼←", 8],
  ["→↑↓", 8]
];

const SOM_CHAR_PAIRS_IT: [string, number][] = [
  ...SOM_CHAR_PAIRS,
  ["àèéìòùÈ", 8]
];

const SOM_REGEXES: [string | RegExp, string][] = [
  [/\[BOY\]/g, "BOY"],
  [/\[GIRL\]/g, "GIRL"],
  [/\[SPRITE\]/g, "SPRITE"],
  [/\[.*?\]\n?/g, ''],
];

const SOE_TEXT_REPLACER = (text: string): string => {
  text = text.replaceAll(/\[CLEAR\]\n/g, "\r");
  text = text.replaceAll(/\[OPEN\]\n/g, "\r");
  text = text.replaceAll(/\[SLEEP 00\]\n/g, "\r");
  text.match(/\[SHIFT ..\]/g)?.forEach((matchResult) => {
    const width = parseInt(matchResult.slice(7, 9), 16);
    text = text.replaceAll(matchResult, "\t".repeat(width * 8));
  });
  text = replaceAll(text, SOM_REGEXES);
  return text;
};

export const somConfig: Config = {
  charLimit: 28 * 8,
  lineLimit: 3,
  boxClasses: ["snes-256x224", "som-box"],
  fontClass: "som-main-font",
  charWidthPairs: SOM_CHAR_PAIRS,
  replacer: SOE_TEXT_REPLACER,
  autoLineBreak: true,
};

export const somItConfig: Config = {
  ...somConfig,
  fontClass: "som-main-font italian",
  charWidthPairs: SOM_CHAR_PAIRS_IT,
};
