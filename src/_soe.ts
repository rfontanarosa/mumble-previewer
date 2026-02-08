import { Config } from "./config";
import { replaceAll } from "./utils";

const SOE_CHAR_PAIRS: [string, number][] = [
  ["|", 2],
  ["',.:;`il", 3],
  [" !()1[]", 4],
  ["<>It", 5],
  ['"*+/EFLS\\cfjrs', 6],
  ["$-02356789=?ABCDGOJHPQRTUVXYZabdeghknopquvxyz", 7],
  ["&4NK", 8],
  ["#%@M…", 9],
  ["Wmw", 11],
];

const SOE_CHAR_PAIRS_IT: [string, number][] = [
  ...SOE_CHAR_PAIRS,
  ["ì", 4],
  ["Ì", 5],
  ["ÈÉ", 6],
  ["àèéòùÀÒÙ", 7]
];

const SOE_CHAR_PAIRS_PT: [string, number][] = [
  ...SOE_CHAR_PAIRS,
  ["í", 3],
  ["É", 6],
  ["àêéóúÁáâçôãÓõ", 7]
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
  autoLineBreak: true,
};

export const soeItConfig: Config = {
  ...soeConfig,
  fontClass: "soe-main-font italian",
  charWidthPairs: SOE_CHAR_PAIRS_IT,
};

export const soePtConfig: Config = {
  ...soeConfig,
  fontClass: "soe-main-font portuguese",
  charWidthPairs: SOE_CHAR_PAIRS_PT,
};
