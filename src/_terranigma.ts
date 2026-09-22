import { Config, makeConfig } from "./types";
import { replaceAll } from "./utils";

const TERRANIGMA_CHAR_PAIRS: [string, number][] = [
  [" ABCDEFG", 12],
  ["HIJKLMNO", 12],
  ["PQRSTUVW", 12],
  ["XYZ", 12],
  ["abcdefg", 12],
  ["hijklmno", 12],
  ["pqrstuvw", 12],
  ["xyz", 12],
  ["?()01234", 12],
  ["456789!,:", 12],
  ["→←↑↓“”'=", 12],
  ["%*+-/&.", 12],
];

const TERRANIGMA_REGEXES: [string | RegExp, string][] = [
  [/\[.*?\]/g, ''],
];

const TERRANIGMA_TEXT_REPLACER = (text: string): string => {
  text = replaceAll(text, TERRANIGMA_REGEXES);
  return text;
};

export const terranigmaConfig: Config = makeConfig({
  charLimit: 18 * 12,
  lineLimit: 4,
  boxClasses: ["snes-256x224", "terranigma-box"],
  fontClass: "terranigma-main-font",
  charWidthPairs: TERRANIGMA_CHAR_PAIRS,
  replacer: TERRANIGMA_TEXT_REPLACER,
  autoLineBreak: true,
  languages: {
    it: { charWidthPairs: [["àéèìòùÈ", 12]] }
  }
});
