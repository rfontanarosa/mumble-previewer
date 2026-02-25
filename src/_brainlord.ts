import { Config, makeConfig } from "./types";
import { replaceAll } from "./utils";

const BRAINLORD_CHAR_PAIRS: [string, number][] = [
  ["01234567", 8],
  ["89 ", 8],
  [").", 8],
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
  ["-,·", 8],
  ["!", 8],
  ["♪", 8],
];

const BRAINLORD_REGEXES: [string | RegExp, string][] = [
  [/\[F[2356BCDEF][^\]]*\]/g, ""],
  [/\[RAM.*?\]/g, "XXX"],
  [/\[WHITE\]/g, ""],
];

const BRAINLORD_TEXT_REPLACER = (text: string): string => {
  text = replaceAll(text, BRAINLORD_REGEXES);
  text = text.replaceAll(/\[INPUT\]/g, "\r");
  return text;
};

export const brainlordConfig: Config = makeConfig({
  charLimit: 222,
  lineLimit: 4,
  boxClasses: ["snes-256x224", "brainlord-box"],
  fontClass: "brainlord-main-font",
  charWidthPairs: BRAINLORD_CHAR_PAIRS,
  replacer: BRAINLORD_TEXT_REPLACER,
  languages: {
    it: { charWidthPairs: [["àèé", 8], ["ìòùÈ°", 8]] },
    pt: { charWidthPairs: [["úç", 8], ["àáãâ", 8], ["éêíóõô", 8], ["ÀÁÃÂÉ", 8], ["ÊÍÓÕÔÚ", 8], ["Ç", 8]] }
  }
});
