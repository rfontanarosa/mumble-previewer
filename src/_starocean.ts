import { Config } from "./config";
import { replaceAll } from "./utils";

const STAROCEAN_CHAR_PAIRS: [string, number][] = [
  ["Iil,.:;", 3],
  ["'!()Ìì", 4],
  ["1t² ", 5],
  ["EFLScfjrs“”ÈÉ", 6],
  ["02356789ABCDEGHJOPQRTUVXYZabdeghknopquvxyz¿?/+-=<>ÀÒÙàèéòù", 7],
  ["4KN*", 8],
  ["&", 9],
  ["#♪", 10],
  ["MWm%★☆", 11],
  ["w♥", 12],
];

const STAROCEAN_REGEXES: [string | RegExp, string][] = [
  [/<RATIX>/g, "WWWWWWWW"],
  [/<MILLY>/g, "Milly"],
  [/<DORN>/g, "Dorn"],
  [/<RONIXIS>/g, "Ronixis"],
  [/<IRIA>/g, "Iria"],
  [/<CIUS>/g, "Cius"],
  [/<JOSHUA>/g, "Joshua"],
  [/<TINEK>/g, "Tinek"],
  [/<MARVEL>/g, "Marvel"],
  [/<PERISIE>/g, "Perisie"],
  [/<FEAR>/g, "Fear"],
  [/<ASHLAY>/g, "Ashlay"],
  [/<PAUSE><..>/g, ""],
  [/<COLOR><..>/g, ""],
  [/<WAIT><CLOSE>/g, ""],
  [/<CLOSE>/g, ""],
  [/<CODE 88><..>/g, ""],
  [/<CODE 81><..><..>/g, ""],
];

const STAROCEAN_TEXT_REPLACER = (text: string): string => {
  text = replaceAll(text, STAROCEAN_REGEXES);
  text = text.replaceAll("<WAIT>\n", "\r");
  text.match(/<PAD><..><..>/g)?.forEach((matchResult) => {
    const width = parseInt(matchResult.slice(6, 8), 16);
    // const height = parseInt(matchResult.slice(10, 12), 16);
    text = text.replaceAll(matchResult, "\t".repeat(width));
  });
  return text;
};

export const staroceanConfig: Config = {
  charLimit: 208,
  lineLimit: 4,
  boxClasses: ["snes-256x224", "starocean-box"],
  fontClass: "starocean-main-font",
  charWidthPairs: STAROCEAN_CHAR_PAIRS,
  replacer: STAROCEAN_TEXT_REPLACER,
  autoLineBreak: true,
  autoBoxOverflow: true,
};
