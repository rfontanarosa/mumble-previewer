import { Config } from "./config";
import { replaceAll } from "./utils";

const GAIA_CHAR_PAIRS: [string, number][] = [
  ["?'", 8],
  ["0123456789.,:>“”", 8],
  ["ABCDEFGHIJKLMNO!", 8],
  ["PQRSTUVWXYZ/*-()", 8],
  ["abcdefghijklmno", 8],
  ["pqrstuvwxyz ", 8],
];

const GAIA_REGEXES: [string | RegExp, string][] = [
  [/\[END.]/g, ""],
  [/\[CLEAR]/g, ""],
  [/\[NEXT]\n/g, ""],
  [/\[INPUT]/g, ""],
  [/\[WIN]\n/g, ""],
  [/\[ESCAPE]/g, ""],
  [/\[WIN_POS .. ..]/g, ""],
  [/\[CLR ..]/g, ""],
  [/\[C5 .. .. .. ..]/g, ""],
  [/\[C6 .. .. .. ..]/g, ""],
  [/\[WIN_SIZE .. ..]/g, ""],
  [/\[PAUSE ..]/g, ""],
  [/\[SND ..]/g, ""],
  [/\[DELAY ..]/g, ""],
  [/\[COLOR_SND_(WILL|KARA|LILLY|ERIK|LANCE|SETH|NEIL)]\n/g, ""],
  [/\[COLOR_RED]\n/g, ""],
  [/\[WIN_..]\n/g, ""],
  [/\[WIN_WHERE_DO_YOU_GO]\n/g, ""],
  [/\[COLOR_(WILL|KARA|LILLY|LANCE])/g, ""],
];

const GAIA_TEXT_REPLACER = (text: string): string => {
  text = replaceAll(text, GAIA_REGEXES);
  text = text.replaceAll(/\[WAIT]\n/g, "\r");
  return text;
};

export const gaiaConfig: Config = {
  charLimit: 240,
  lineLimit: 4,
  boxClasses: ["snes-256x224", "gaia-box"],
  fontClass: "gaia-main-font",
  charWidthPairs: GAIA_CHAR_PAIRS,
  replacer: GAIA_TEXT_REPLACER,
};
