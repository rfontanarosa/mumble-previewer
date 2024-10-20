import { Config } from "./config";
import { replaceAll } from "./utils";

const FFMQ_CHAR_PAIRS: [string, number][] = [
  ["i;:'ì", 3],
  ["l!,.", 4],
  [" 1I", 5],
  ['t-"', 6],
  ["TYbcdeforsuvgjpyh?néèòù", 7],
  ["023456789ABCDEFGHJKLMNOPQRSUVWXZakmqwxz“”…/&%Èà", 8],
];

const FFMQ_REGEXES: [string | RegExp, string][] = [
  ['."', '"'],
  [/<HERONAME>/g, "HERONAME"],
  [/<082CFF>/g, "RAM"],
];

const FFMQ_TEXT_REPLACER = (text: string): string => {
  text = replaceAll(text, FFMQ_REGEXES);
  text = text.replace(/<(?:1A|1B|SPEAKER|SCROLL)[^>]*>\n/gm, "\r");
  text = text.replaceAll("<LINE>\n", "\r");
  return text;
};

export const ffmqConfig: Config = {
  charLimit: 208,
  lineLimit: 3,
  boxClasses: ["snes-256x224", "ffmq-box"],
  fontClass: "ffmq-font1",
  charWidthPairs: FFMQ_CHAR_PAIRS,
  replacer: FFMQ_TEXT_REPLACER,
  autoParagraphBreak: true,
};
