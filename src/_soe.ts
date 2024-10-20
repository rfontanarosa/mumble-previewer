import { Config } from "./config";
import { replaceAll } from "./utils";

const SOE_CHAR_PAIRS: [string, number][] = [
  ["|", 2],
  ["',.:;`il", 3],
  ["ì !()1[]", 4],
  ["Ì<>It", 5],
  ['ÈÉ"*+/EFLS\\cfjrs', 6],
  ["àèéòùÀÒÙ$-02356789=?ABCDGOJHPQRTUVXYZabdeghknopquvxyz", 7],
  ["&4NK", 8],
  ["#%@M…", 9],
  ["Wmw", 11],
];

const SOE_REGEXES: [string | RegExp, string][] = [
  [/{/g, '"'],
  [/}/g, '"'],
  [/<\$92>/g, ""],
  [/<\$93>/g, ""],
  [/<\$94>/g, ""],
  [/<\$96>/g, ""],
  [/<\$97>/g, ""],
  [/<\$85>/g, ""],
  [/<\$87>/g, ""],
  [/<\$A3>/g, "XXXXX"],
  [/<\Item>/g, "XXXXX"],
  [/<Boy>/g, "XXXXX"],
  [/<Dog>/g, "XXXXX"],
  [/<\Choice>/g, ""],
  [/<S \$.. \$..>/g, ""],
  [/«/g, "<"],
  [/»/g, ">"],
];

const SOE_TEXT_REPLACER = (text: string): string => {
  text = replaceAll(text, SOE_REGEXES);
  text = text.replaceAll("<$86>", "\r");
  return text;
};

export const soeConfig: Config = {
  charLimit: 152,
  lineLimit: 4,
  boxClasses: ["snes-256x224", "soe-box"],
  fontClass: "soe-main-font",
  charWidthPairs: SOE_CHAR_PAIRS,
  replacer: SOE_TEXT_REPLACER,
  autoParagraphBreak: true,
};
