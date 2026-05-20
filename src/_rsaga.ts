import { Config, makeConfig } from "./types";
import { replaceAll } from "./utils";

const RSAGA_CHAR_PAIRS: [string, number][] = [
  ["Iil,.:;", 3],
  ["'!()", 4],
  ["1t² ", 5],
  ["EFLScfjrs“”", 6],
  ["02356789ABCDGHJOPQRTUVXYZabdeghknopquvxyz¿?/+-=<>", 7],
  ["4KN*", 8],
  ["&", 9],
  ["#♪♀", 10],
  ["MWm%★☆", 11],
  ["w♥♂", 12],
];

const RSAGA_REGEXES: [string | RegExp, string][] = [
  [/<40,.*?>/g, ""],
  [/<4a,.*?>/g, ""],
  [/\[MOVEMENT ..\]>/g, ""],
  [/\[NEWLINE_WINDOW1\]>/g, "\n"],
  [/\[NEWLINE_WINDOW2\]>/g, "\n"],
  [/\[PAUSE\]>/g, ""],
  [/\[SELECTION\]>/g, ""],
  [/\[SELECTION2\]>/g, ""],
  [/\[END_SELECTION2\]>/g, ""],
  [/\[JUMP_RETURN .. ..\]>/g, ""],
  [/\[TEXT_POSITION .. ..\]>/g, ""],
  [/\[SETFLAG .. ..\]>/g, ""],
  [/\[SETRAM .. .. ..\]>/g, ""],
  [/\[NAME ..\]>/g, "XXXXXX"],
  [/\[ITEM ..\]>/g, "YYYYYY"],
  [/\[NEWLINE_HALF\]>/g, "\n"],
  [/\[WAIT ..\]>/g, ""],
];

const RSAGA_TEXT_REPLACER = (text: string): string => {
  text = replaceAll(text, RSAGA_REGEXES);
  text = text.replaceAll("<WAIT>\n", "\r");
  text.match(/<PAD><..><..>/g)?.forEach((matchResult) => {
    const width = parseInt(matchResult.slice(6, 8), 16);
    // const height = parseInt(matchResult.slice(10, 12), 16);
    text = text.replaceAll(matchResult, "\t".repeat(width));
  });
  return text;
};

export const rsagaConfig: Config = makeConfig({
  charLimit: 208,
  lineLimit: 4,
  boxClasses: ["snes-256x224", "rsaga-box"],
  fontClass: "rsaga-main-font",
  charWidthPairs: RSAGA_CHAR_PAIRS,
  replacer: RSAGA_TEXT_REPLACER,
  autoLineBreak: true,
  autoBoxOverflow: true,
  languages: {
    it: { charWidthPairs: [["Ìì", 4], ["ÈÉ", 6], ["ÀÒÙ°àèéòù", 7]] }
  }
});
