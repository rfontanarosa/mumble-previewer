import { Config, makeConfig } from "./types";
import { replaceAll } from "./utils";

const ALCAHEST_CHAR_PAIRS: [string, number][] = [
  [":i|", 1],
  [",.;l", 2],
  ["!\"'()1I[]`", 3],
  [" j{}" , 4],
  ["#$%&*+-/023456789<=>?@ABCDEFGHJKLMNOPQRSTUVWXYZ¥^_abcdefghkmnopqrstuvwxyz。「」、・", 5],
  ["𝐗𝐘", 10],
];

const ALCAHEST_CHAR_PAIRS_ITA: [string, number][] = [
  ...ALCAHEST_CHAR_PAIRS,
  ...([
    ["ì", 2],
    ["àéèìòù°", 6]
  ] as [string, number][]),
];

const ALCAHEST_REGEXES: [string | RegExp, string][] = [
  [/\[POS .. ..\]/g, ""],
  [/\[DEFSPEED ..\]/g, ""],
  [/\[VAR ..\]/g, ""],
  [/\[TIMING .. ..\]/g, ""],
  [/\[CHARW ..\]/g, ""],
  [/\[SHIFT ..\]/g, ""],
  [/\[RATE ..\]/g, ""],
  [/\[CLEAR\]/g, ""],
  [/\[FLAG ..\]/g, ""],
  [/\[PTR .. ..\]/g, ""],
  [/\[COLOR .. .. .. ..\]/g, ""],
  [/\[GOTO .. ..\]/g, ""],
  [/\[CALL 7D 1A 00\]/g, "Y"],
  [/\[CALL 83 1A 00\]/g, "X"],
  [/\[PAIR .. ..\]/g, ""],
  [/\[PAUSE\]/g, ""],
  [/\[FLAG1\]/g, ""],
  [/\[FLAG2\]/g, ""],
  [/\[IF .. .. .. .. .. .. .. .. ..\]/g, ""],
  [/\[DELAY ..\]/g, ""],
  [/\[EVENT ..\]/g, ""],
  [/\[SPEAKER ..\]/g, ""],
  [/\[TRIGGER\]/g, ""],
];

const ALCAHEST_TEXT_REPLACER = (text: string): string => {
  text = replaceAll(text, ALCAHEST_REGEXES);
  text = text.replaceAll("[CLOSE]\n", "\r");
  text.match(/<PAD><..><..>/g)?.forEach((matchResult) => {
    const width = parseInt(matchResult.slice(6, 8), 16);
    // const height = parseInt(matchResult.slice(10, 12), 16);
    text = text.replaceAll(matchResult, "\t".repeat(width));
  });
  return text;
};

export const alcahestConfig: Config = makeConfig({
  charLimit: 136,
  lineLimit: 3,
  boxClasses: ["snes-256x224", "alcahest-box"],
  fontClass: "alcahest-main-font",
  charWidthPairs: ALCAHEST_CHAR_PAIRS,
  replacer: ALCAHEST_TEXT_REPLACER,
  autoLineBreak: true,
  autoBoxOverflow: true,
  languages: {
    it: { charWidthPairs: ALCAHEST_CHAR_PAIRS_ITA }
  }
});
