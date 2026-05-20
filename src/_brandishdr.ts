import { Config, makeConfig } from "./types";

const BRANDISHDR_CHAR_PAIRS: [string, number][] = [
  // [" ", 1],
  ["!',.:;Iil", 2 + 2],
  ["\"()]`j", 3 + 2],
  ["*-1[ ", 4 + 2],
  ["^_frt", 5 + 2],
  ["+<>ahknsuvxyz", 6 + 2],
  ["#$=EFJKLZ¥bcdegopq", 7 + 2],
  ["&/023456789?ABCDGHMNOPQRSTUVXY", 8 + 2],
  ["%@Mmw", 9 + 2],
  ["W", 10 + 2],
];

export const brandishdrConfig: Config = makeConfig({
  charLimit: 320,
  lineLimit: 3,
  boxClasses: ["psp-480x272", "brandishdr-box"],
  fontClass: "brandishdr-main-font",
  charWidthPairs: BRANDISHDR_CHAR_PAIRS,
  languages: {
    it: { charWidthPairs: [["àèéòù", 6 + 2], ["ì", 3 + 2], ["È", 7 + 2]] }
  }
});
