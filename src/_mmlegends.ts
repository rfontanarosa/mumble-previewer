import { Config } from "./config";
import { replaceAll } from "./utils";

const MMLEGENDS_CHAR_PAIRS: [string, number][] = [
  ["0123456789", 12],
  ["Wmw", 11],
  ["ACGMOQX", 10],
  ["ß?DHNTUVY&", 9],
  ["ç)BEFKLPRSZabcdeghno ", 8],
  ["!(Jfkpqstuvxyz", 7],
  [":jr", 6],
  ["I", 5],
  ["'", 4],
  ["il", 3],
];

const MMLEGENDS_REGEXES: [string | RegExp, string][] = [
  [/<AUTO>/g, ""],
  [/<AUDIO ........>\n/g, ""],
  [/<WIN PX=.... PY=.... SX=.. SY=..>\n/g, ""],
  [/<DECOR WT=.. PAD=..>\n/g, ""],
  [/<WAIT ....>\n/g, ""],
  [/<NEXT>/g, ""],
];

const MMLEGENDS_TEXT_REPLACER = (text: string): string => {
  text = replaceAll(text, MMLEGENDS_REGEXES);
  text = text.replaceAll("<NEXT>\n\n", "\r");
  return text;
};

// <DECOR WT=([0-9A-F]{2}) PAD=([0-9A-F]{2})>\n
// <WIN PX=([0-9A-F]{2,4}) PY=([0-9A-F]{2,4}) SX=([0-9A-F]{2}) SY=([0-9A-F]{2})>\n

export const MMLEGENDS = {
  getConfigByText: (text: string): Partial<Config> => {
    const config = { relativePositionWindow: {} } as Partial<Config>;

    text.match(/<DECOR WT=.. PAD=..>/g)?.forEach((matchResult) => {
      console.log(matchResult.slice(10, 12), matchResult.slice(17, 19));
      const padding = parseInt(matchResult.slice(17, 19), 16);
      config.relativePositionWindow!.padding = padding;
    });

    text.match(/<WIN PX=.... PY=.... SX=.. SY=..>/g)?.forEach((matchResult) => {
      const px = parseInt(matchResult.slice(8, 12), 16);
      const py = parseInt(matchResult.slice(16, 20), 16); //
      const sx = parseInt(matchResult.slice(24, 26), 16); // size colonne da 12 px
      const sy = parseInt(matchResult.slice(30, 32), 16); // lines
      config.relativePositionWindow = {
        ...config.relativePositionWindow,
        ...{
          left: px - config.relativePositionWindow!.padding!,
          top: py - config.relativePositionWindow!.padding!,
          width: sx * 12,
          height: sy * 12,
        },
      };
      config.charLimit = sx * 12;
      config.lineLimit = sy;
    });

    return config;
  },
  config: {
    charLimit: 12 * 5,
    lineLimit: 4,
    boxClasses: ["psx-ntsc-320x240", "mmlegends-box"],
    fontClass: "mmlegends-main-font",
    charWidthPairs: MMLEGENDS_CHAR_PAIRS,
    replacer: MMLEGENDS_TEXT_REPLACER,
  } as Config,
};
