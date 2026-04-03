import { Config, makeConfig } from "./types";
import { replaceAll } from "./utils";

const SEVENTHSAGA_CHAR_PAIRS: [string, number][] = [
  ["01234567", 8],
  ["89 ", 8],
  [")·", 8],
  ["▷/▲", 8],
  ["ABCDEFGH", 8],
  ["IJKLMNOP", 8],
  ["QRSTUVWX", 8],
  ["YZabcdef", 8],
  ["ghijklmn", 8],
  ["opqrstuv", 8],
  ["wxyz?", 8],
  [":;", 8],
  ["'\"", 8],
  ["-,.", 8],
  ["!", 8],
  ["♪", 8],
];

const SEVENTHSAGA_REGEXES: [string | RegExp, string][] = [
  [/\[F[56BCDEF][^\]]*\]\r?\n?/g, ""],
  [/\[YOURNAME\]/g, ""],
  [/\[PARTNERNAME\]/g, ""],
  [/\[ITEM\]/g, ""],
  [/\[PRICE\]/g, "9999"],
  [/\[\?\?\?\]/g, "???"],
  [/\[BOLD\]/g, ""],
  [/\[END\]/g, ""],
];

const SEVENTHSAGA_TEXT_REPLACER = (text: string): string => {
  text = replaceAll(text, SEVENTHSAGA_REGEXES);
  text = text.replaceAll(/\[PAGE\]/g, "\r");
  return text;
};

export const seventhsagaConfig: Config = makeConfig({
  charLimit: 222,
  lineLimit: 4,
  boxClasses: ["snes-256x224", "seventhsaga-box"],
  fontClass: "seventhsaga-main-font",
  charWidthPairs: SEVENTHSAGA_CHAR_PAIRS,
  replacer: SEVENTHSAGA_TEXT_REPLACER,
  languages: {
    it: { charWidthPairs: [["àèé", 8], ["ìòùÈ+°", 8]] }
  }
});
