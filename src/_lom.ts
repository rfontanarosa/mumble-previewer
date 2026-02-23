import { Config } from "./config";

const LOM_CHAR_PAIRS: [string, number][] = [
  ["Ii", 3],
  ["l", 4],
  [" !',:;‘j", 5],
  [".<>Jabcdefghknopqrstuyz", 6],
  ["#$()+-/0123456789=?@ABCDEFGHKLNPRSTUVXYZ[\\]^_mvx{|}“", 7],
  ["”%&*OQw~", 8],
  ["MW", 9],
];

export const lomConfig: Config = {
  charLimit: 174,
  lineLimit: 3,
  boxClasses: ["psx-ntsc-320x240", "lom-box"],
  fontClass: "lom-main-font",
  charWidthPairs: LOM_CHAR_PAIRS,
};
