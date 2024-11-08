import { Config } from "./config";
import { replaceAll } from "./utils";

const BRAINLORD_CHAR_PAIRS: [string, number][] = [
  ["01234567", 8],
  ["89 ", 8],
  [").", 8],
  ["/", 8],
  ["ABCDEFGH", 8],
  ["IJKLMNOP", 8],
  ["QRSTUVWX", 8],
  ["YZabcdef", 8],
  ["ghijklmn", 8],
  ["opqrstuv", 8],
  ["wxyz?", 8],
  [":;àèé", 8],
  ["ìòùÈ°'\"", 8],
  ["-,·", 8],
  ["!", 8],
  ["♪", 8],
];

const BRAINLORD_REGEXES: [string | RegExp, string][] = [
  [/\{f6}{..\}/g, ""],
  [/\{fb}{..\}{..\}{..\}{..\}{..\}/g, ""],
  [/\{fc}{..\}{..\}{..\}{..\}{..\}/g, ""],
  [/\{fd}{..\}{..\}/g, ""],
  [/\{fe}{..\}{..\}/g, ""],
  [/\{ff}{..\}{..\}{..\}/g, ""],
  ["{f3}", ""],
  ["{82}", ""],
  ["{89}", "X"],
  ["{8c}", "X"],
  ["{8d}", "X"],
  ["{ee}", " "],
  ["{ef}", " "],
  ["<name>", "PLAYER"],
  ["<ram>", "RAM"],
  ["<white>", ""],
];

const BRAINLORD_TEXT_REPLACER = (text: string): string => {
  text = replaceAll(text, BRAINLORD_REGEXES);
  text = text.replaceAll(/<input>/g, "\r");
  return text;
};

export const brainlordConfig: Config = {
  charLimit: 222,
  lineLimit: 4,
  boxClasses: ["snes-256x224", "brainlord-box"],
  fontClass: "brainlord-main-font",
  charWidthPairs: BRAINLORD_CHAR_PAIRS,
  replacer: BRAINLORD_TEXT_REPLACER,
};
