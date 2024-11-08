import { Config } from "./config";
import { replaceAll } from "./utils";

const SMRPG_CHAR_PAIRS: [string, number][] = [
  ["IilìÌ", 3],
  [" '", 4],
  ["(),-.1Lbefhjrtèé", 5],
  ["!“”·/DFJNSTYZacdgknopqsuxyzàòù", 6],
  ["023456789BCEGHKOPQUVXÈÉmv:;ÒÙ", 7],
  ["♥♪‥~?©ARÀw<>&", 8],
  ["MW…#+×%*", 9],
];

const SMRPG_REGEXES: [string | RegExp, string][] = [
  [/\[1\]/g, "\n"], // New line
  [/\[6\]/g, ""], // End string
  [/\[0\]/g, ""], // End string, wait for input
  [/\[7\]/g, ""], // Option triangle
  [/\[12\]/g, ""], // Pause 1 second
  [/\[5\]/g, ""], // Pause, wait for input
  [/\[36\]/g, "♥"],
  [/\[37\]/g, "♪"],
  [/\[42\]/g, "·"],
  [/\[43\]/g, "‥"],
];

const SMRPG_TEXT_REPLACER = (text: string): string => {
  text = replaceAll(text, SMRPG_REGEXES);
  text = text.replace(/\[13\]\[.\]/g, ""); // Pause?
  text = text.replace(/\[13\]\[..\]/g, ""); // Pause?
  text = text.replace(/\[28\]\[.\]/g, ""); // RAM?
  // text = text.replace(/\[2\]/g, "\t[2]"); // <div class="newline_newpage_arrow"></div>
  // text = text.replace(/\[3\]/g, "\t[3]"); // <div class="newline_newpage_arrow"></div>
  text = text.replaceAll(/\[2\]|\[3\]|\[4\]/g, "\r"); // Wait for input, clean previous lines / New page, wait for input / New page
  return text;
};

export const smrpgConfig: Config = {
  charLimit: 222,
  lineLimit: 3,
  boxClasses: ["snes-256x224", "smrpg-box"],
  fontClass: "smrpg-main-font",
  charWidthPairs: SMRPG_CHAR_PAIRS,
  replacer: SMRPG_TEXT_REPLACER,
};
