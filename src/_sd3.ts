import { Config, makeConfig } from "./types";
import { replaceAll } from "./utils";

const SD3_CHAR_PAIRS: [string, number][] = [
  ["il.:", 3],
  [",';", 4],
  ["I!()", 5],
  [" ", 6],
  ["+fj1", 7],
  ['/"#$%&ABCDEFGHJKLNPRSUVabcdeghknopqrstuvyz23456789-?', 8],
  ["*MOQTWXYZmwx0", 9],
];

const SD3_REGEXES: [string | RegExp, string][] = [
  [/<CHAR 0>/g, "CHAR00"],
  [/<CHAR 1>/g, "CHAR01"],
  [/<CHAR 2>/g, "CHAR02"],
  [/<CHAR 3>/g, "CHAR03"],
  [/<DURAN>/g, "DURAN6"],
  [/<KEVIN>/g, "KEVIN6"],
  [/<HAWK>/g, "HAWK56"],
  [/<ANGELA>/g, "ANGELA"],
  [/<CARLIE>/g, "CARLIE"],
  [/<LISE>/g, "LISE56"],
  [/<WHITE>/g, ""],
  [/<YELLOW>/g, ""],
  [/<MONO WHITE>/g, ""],
  [/<MONO YELLOW>/g, ""],
  [/<MONO NARROW WHITE>/g, ""],
  [/<ITEM ...>/g, "ITEMXX"],
  [/<PAD [0-9][0-9]?>/g, ""],
  [/<BOX>\n/g, ""],
  [/<BOX><PAGE>\n/g, ""],
  [/<BOX>/g, ""],
  [/<WAIT><00>/g, ""],
  [/<WAIT><F.><..>/g, ""],
  [/<0[0,5,6,7,8,9]>/g, ""],
  [/<MULTI>/g, ""],
  [/<CHOICE>/g, ""],
  [/<CHOICE><..><..><..><..>/g, ""],
  [/<OR>/g, ""],
  [/<OPEN>/g, ""],
  [/<CLOSE>/g, ""],
];

export const sd3ConfigAlt: Config = makeConfig({
  charLimit: 239,
  lineLimit: 3,
  boxClasses: ["snes-256x224", "sd3-box", "window"],
  fontClass: "sd3-main-font",
  charWidthPairs: SD3_CHAR_PAIRS,
  replacer: (text: string) => {
    text = text.replaceAll(/<ALT><..>/g, "");
    text = text.replaceAll(/<PAGE>\n/g, "\r");
    text = text.replaceAll(/<END>\n/g, "\r");
    text = text.replaceAll("<END>", "");
    text = replaceAll(text, SD3_REGEXES);
    return text;
  },
  languages: {
    it: { charWidthPairs: [["Ì", 5], ["ÀàèéìòùÈÉÙ", 8], ["Ò", 9]] }
  }
});

export const sd3ConfigLine: Config = makeConfig({
  charLimit: 239,
  lineLimit: 1,
  boxClasses: ["snes-256x224", "sd3-box", "line"],
  fontClass: "sd3-main-font",
  charWidthPairs: SD3_CHAR_PAIRS,
  replacer: (text: string) => {
    text = text.replaceAll(/<LINE>/g, "");
    text = text.replaceAll(/<PAGE>\n/g, "\r");
    text = text.replaceAll(/<END>/g, "");
    text = replaceAll(text, SD3_REGEXES);
    return text;
  },
  languages: {
    it: { charWidthPairs: [["Ì", 5], ["ÀàèéìòùÈÉÙ", 8], ["Ò", 9]] }
  }
});

export const sd3Config: Config = makeConfig({
  charLimit: 239,
  lineLimit: 3,
  boxClasses: ["snes-256x224", "sd3-box", "window"],
  fontClass: "sd3-main-font",
  charWidthPairs: SD3_CHAR_PAIRS,
  replacer: (text: string): string => {
    text = text.replaceAll(/<PAGE>\n/g, "\r");
    text = text.replaceAll(/<END</g, "");
    text = replaceAll(text, SD3_REGEXES);
    return text;
  },
  languages: {
    it: { charWidthPairs: [["Ì", 5], ["ÀàèéìòùÈÉÙ", 8], ["Ò", 9]] }
  }
});
