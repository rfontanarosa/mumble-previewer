import { Config } from "./config";

const LUFIA_CHAR_PAIRS: [string, number][] = [
  [" !\"àèéì'()*‥,-./", 8],
  ["0123456789:;<=>?", 8],
  ["ABCDEFGHIJKLMNO", 8],
  ["PQRSTUVWXYZ[ò]ù_", 8],
  ["abcdefghijklmno", 8],
  ["pqrstuvwxyz{È}~", 8],
];

export const lufiaConfig: Config = {
  charLimit: 240,
  lineLimit: 4,
  boxClasses: ["snes-256x224", "lufia-box"],
  fontClass: "lufia-main-font",
  charWidthPairs: LUFIA_CHAR_PAIRS,
};
