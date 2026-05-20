import { Config, makeConfig } from "./types";
import { replaceAll } from "./utils";

const CHAR_PAIRS: [string, number][] = [
  [" ABCDEFGHIJKLMNO", 8],
  ["PQRSTUVWXYZabcde", 8],
  ["fghijklmnopqrstu", 8],
  ["vwxyz1234567890!", 8],
  ["?.,':-=·\"àèéìòùÈ", 8],
];

const REGEXES: [string | RegExp, string][] = [
  ["{{{", ""],
  ["}}}", ""],
  ["{f4}T", ""],
  ["{f6}A", ""],
  ["{f6}C", ""],
  ["{f6}D", ""],
  ["{f6}E", ""],
  ["{f6}F", ""],
  ["{f6} ", ""],
  ["{fd}", ""],
  ["{fc}", ""],
  ["{ff}", ""],
];

const TEXT_REPLACER = (text: string): string => {
  text = replaceAll(text, REGEXES);
  text = text.replaceAll("{02}{00}", "");
  text = text.replaceAll("{f3} ", "\n");
  text = text.replaceAll("{f2} ", "\n");
  text = text.replaceAll("<NEXT>\n\n", "\r");
  return text;
};

export const YS3 = {
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
  config: makeConfig({
    charLimit: 12 * 5,
    lineLimit: 4,
    boxClasses: ["snes-256x224", "ys3-box"],
    fontClass: "ys3-main-font",
    charWidthPairs: CHAR_PAIRS,
    replacer: TEXT_REPLACER,
  }),
};
