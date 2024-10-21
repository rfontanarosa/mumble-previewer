import { Config } from "./config";
import { replaceAll } from "./utils";

const SPIKE_CHAR_PAIRS: [string, number][] = [
  [" 0123456789ABCDE", 8],
  ["FGHIJKLMNOPQRSTU", 8],
  ["VWXYZabcdefghijk", 8],
  ["lmnopqrstuvwxyz", 8],
  ["àèéìòùÈ", 8],
  [".,'", 8],
  ['"-…!?:', 8],
];

const SPIKE_REGEXES: [string | RegExp, string][] = [
  [/\[WIN.+]|\[CONTINUE]\n|\[SCROLL ..]\n/g, "\r"],
  // [/\[WIN.+]/g, ""],
  [/\[COLOR .+]/g, ""],
  [/\[SCROLL ..]/g, ""],
  [/\[F4 .. ..]/g, ""],
  [/\[F6 ..]/g, ""],
  [/\[F8 ..]/g, ""],
  [/\[FD .. .. .. ..]/g, ""],
  [/\[FE ..]/g, ""],
  [/\[FF .. ..]/g, ""],
  [/\{..}/g, ""],
];

const SPIKE_TEXT_REPLACER = (text: string): string => {
  text = replaceAll(text, SPIKE_REGEXES);
  // text = text.replaceAll(/\[WIN.+]|\[CONTINUE]\n|\[SCROLL ..]\n/g, "\r");
  return text;
};

export const spikeConfig: Config = {
  charLimit: 128,
  lineLimit: 2,
  boxClasses: ["snes-256x224", "spike-box"],
  fontClass: "spike-main-font",
  charWidthPairs: SPIKE_CHAR_PAIRS,
  replacer: SPIKE_TEXT_REPLACER,
  autoParagraphBreak: false,
};
