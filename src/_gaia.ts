import { Config } from "./config";

const GAIA_CHAR_PAIRS: [string, number][] = [
  ["?'", 8],
  ["0123456789.,:>“”", 8],
  ["ABCDEFGHIJKLMNO!", 8],
  ["PQRSTUVWXYZ/*-()", 8],
  ["abcdefghijklmno", 8],
  ["pqrstuvwxyz ", 8],
];

export const gaiaConfig: Config = {
  charLimit: 240,
  lineLimit: 4,
  boxClasses: ["snes-256x224", "gaia-box"],
  fontClass: "gaia-main-font",
  charWidthPairs: GAIA_CHAR_PAIRS,
};
