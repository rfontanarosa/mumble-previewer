import { Config } from "./config";
import { replaceAll } from "./utils";

const IGNITION_CHAR_PAIRS: [string, number][] = [
  [" abcdefghijklmno", 8],
  ["pqrstuvwxyz.\",-'", 8],
  [":ABCDEFGHIJKLMNO", 8],
  ["PQRSTUVWXYZ?!()/", 8],
  ["0123456789;", 8],
];

const IGNITION_CHAR_PAIRS_ITA: [string, number][] = [
  ...IGNITION_CHAR_PAIRS,
  ...([["àéèìòùÈ°", 8]] as [string, number][]),
];

const IGNITION_REGEXES: [string | RegExp, string][] = [
  [/<..>/g, ""],
  [/<.. ..>/g, ""],
  [/\[PORTRAIT ..]\n/g, ""],
  [/\[WAIT ..]/g, ""],
  [/<CLOSE>/g, ""],
  [/<INPUT>\n/g, ""],
  [/<LINE>/g, ""],
  [/<PAUSE>\n/g, ""],
  [/<CONTINUE>\n/g, ""],
  [/\[FC03 ..]/g, ""],
  [/\<FC00 ..>/g, ""],
];

const IGNITION_TEXT_REPLACER = (text: string): string => {
  text = replaceAll(text, IGNITION_REGEXES);
  text = text.replaceAll(/<CLEAR>\n/g, "\r");
  return text;
};

export const ignitionConfig: Config = {
  charLimit: 176,
  lineLimit: 3,
  boxClasses: ["snes-256x224", "ignition-box"],
  fontClass: "ignition-main-font",
  charWidthPairs: IGNITION_CHAR_PAIRS_ITA,
  replacer: IGNITION_TEXT_REPLACER,
  autoParagraphBreak: false,
};
