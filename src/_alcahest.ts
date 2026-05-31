import { Config, makeConfig } from "./types";
import { replaceAll } from "./utils";

const ALCAHEST_CHAR_PAIRS: [string, number][] = [
  [":i|", 1],
  [",.;l・", 2],
  ["!\"'()1I[]`", 3],
  [" j{}" , 4],
  ["#$%&*+-/023456789<=>?@ABCDEFGHJKLMNOPQRSTUVWXYZ¥^_abcdefghkmnopqrstuvwxyz。「」、", 5],
  ["𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐖𝐗𝐘𝐙", 10],
];

const ALCAHEST_CHAR_PAIRS_ITA: [string, number][] = [
  ...ALCAHEST_CHAR_PAIRS,
  ...([
    ["ì", 2],
    ["àéèòù", 5],
    ["È", 6]
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
  [/\[CALL 7D 1A 00\]/g, "𝐘"],
  [/\[CALL 80 1A 00\]/g, "𝐁"],
  [/\[CALL 83 1A 00\]/g, "𝐗"],
  [/\[CALL 86 1A 00\]/g, "𝐋・𝐑"],
  [/\[CALL 89 1A 00\]/g, "𝐀"],
  [/\[PAIR .. ..\]/g, ""],
  [/\[PAUSE\]/g, ""],
  [/\[FLAG1\]/g, ""],
  [/\[FLAG2\]/g, ""],
  [/\[IF .. .. .. .. .. .. .. .. ..\]/g, ""],
  [/\[DELAY ..\]/g, ""],
  [/\[EVENT ..\]/g, ""],
  [/\[SPEAKER ..\]/g, ""],
  [/\[TRIGGER\]/g, ""],
  [/\{..}/g, ""],
];

const ALCAHEST_TEXT_REPLACER = (text: string): string => {
  text = replaceAll(text, ALCAHEST_REGEXES);
  text = text.replaceAll("[CLOSE]\n", "\r");
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
