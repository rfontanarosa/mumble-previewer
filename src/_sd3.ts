import { Config } from "./config";
import { replaceAll } from "./utils";

const SD3_CHAR_PAIRS: [string, number][] = [
  ["il.:", 3],
  [",'", 4],
  ["I!()", 5],
  [" ", 6],
  ["+fj1", 7],
  ['/"#$%&ABCDEFGHJKLNPRSUVabcdeghknopqrstuvyz23456789àèéìòùÈ-?', 8],
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
  [/<BOX><WAIT><00>/g, ""],
  [/<BOX><WAIT><00> /g, ""],
  [/<BOX><OPEN>/g, ""],
  [/<BOX>\n/g, ""],
  [/<BOX><PAGE>\n/g, ""],
  [/<BOX>/g, ""],
  [/<WAIT><00>/g, ""],
  [/<WAIT><F.><..>/g, ""],
  [/<LINE><OPEN>/g, ""],
  [/<END>/g, ""],
  [/<0[0,5,6,7,8,9]>/g, ""],
  [/<F2>/g, ""],
  [/<F3>/g, ""],
  [/<F4>/g, ""],
  //[/<WAIT>/g, ""],
  [/<MULTI>/g, ""],
  [/<CHOICE>/g, ""],
  [/<OR>/g, ""],
  //[/<PAGE>/g, ""),
  [/<OPEN>/g, ""],
  [/<CLOSE>/g, ""],
  [/<LINE>/g, ""],
];

export const sd3ConfigAlt: Config = {
  charLimit: 239,
  lineLimit: 3,
  boxClasses: ["sd3-bo", "window"],
  fontClass: "sd3-main-font",
  charWidthPairs: SD3_CHAR_PAIRS,
  replacer: (text: string) => {
    text = text.replace(/<ALT><..>/g, "");
    text = text.replace(/<END>\n/g, "<END>");
    text = text.replaceAll("<END>", "\r");
    text = replaceAll(text, SD3_REGEXES);
    return text;
  },
};

export const sd3ConfigLine: Config = {
  charLimit: 239,
  lineLimit: 1,
  boxClasses: ["sd3-box", "line"],
  fontClass: "sd3-main-font",
  charWidthPairs: SD3_CHAR_PAIRS,
  replacer: (text: string) => {
    text = text.replace(/<END>\n/g, "<END>");
    text = replaceAll(text, SD3_REGEXES);
    return text;
  },
};

export const sd3Config: Config = {
  charLimit: 239,
  lineLimit: 3,
  boxClasses: ["sd3-box", "window"],
  fontClass: "sd3-main-font",
  charWidthPairs: SD3_CHAR_PAIRS,
  replacer: (text: string) => {
    text = text.replace(/<PAGE>\n/g, "<PAGE>");
    text = text.replace(/<END>\n/g, "<END>");
    text = text.replaceAll("<END>", "\r");
    text = replaceAll(text, SD3_REGEXES);
    return text;
  },
};
