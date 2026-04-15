import { Config, makeConfig } from "./types";

const BRANDISHDR_CHAR_PAIRS: [string, number][] = [
  ["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 16],
];

export const brandishdrConfig: Config = makeConfig({
  charLimit: 19 * 16,
  lineLimit: 3,
  boxClasses: ["psp-480x272", "brandishdr-box"],
  fontClass: "brandishdr-main-font",
  charWidthPairs: BRANDISHDR_CHAR_PAIRS,
});
