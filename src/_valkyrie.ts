import { Config } from "./config";
import { replaceAll } from "./utils";

const VALKYRIE_CHAR_PAIRS: [string, number][] = [
  ["°", 12],
  ["MWm", 9],
  ["@ABCDGHNOQRUVw", 8],
  ["&EFJKPSTXYZ", 7],
  ["\"#$%*+-/0123456789<=>Labcdeghknopqsuvxy¥", 6],
  ["?^`z~", 5],
  [" ()[]_frt", 4],
  ["!Iijl{|}", 3],
  ["',.:;", 2],
];

const VALKYRIE_CHAR_PAIRS_IT: [string, number][] = [...VALKYRIE_CHAR_PAIRS];

const VALKYRIE_REGEXES: [string | RegExp, string][] = [
  [/<DPORT>/g, ""],
  [/<PORT .,.>/g, ""],
  [/<SPEED ..>/g, ""],
  [/<SPEED .>/g, ""],
  [/<\/SPEED>/g, ""],
  [/<SSYNC>/g, ""],
  [/<START>/g, ""],
];

const VALKYRIE_TEXT_REPLACER = (text: string): string => {
  text = replaceAll(text, VALKYRIE_REGEXES);
  text = text.replaceAll("<WAIT>\n", "\r");
  text.match(/<PAD><..><..>/g)?.forEach((matchResult) => {
    const width = parseInt(matchResult.slice(6, 8), 16);
    // const height = parseInt(matchResult.slice(10, 12), 16);
    text = text.replaceAll(matchResult, "\t".repeat(width));
  });
  return text;
};

export const valkyrieConfig: Config = {
  charLimit: 208,
  lineLimit: 4,
  boxClasses: ["psx-ntsc-320x224", "valkyrie-box"],
  fontClass: "valkyrie-main-font",
  charWidthPairs: VALKYRIE_CHAR_PAIRS,
  replacer: VALKYRIE_TEXT_REPLACER,
  autoLineBreak: true,
  autoBoxOverflow: true,
};

export const valkyrieItConfig: Config = {
  ...valkyrieConfig,
  fontClass: "valkyrie-main-font italian",
  charWidthPairs: VALKYRIE_CHAR_PAIRS_IT,
};
