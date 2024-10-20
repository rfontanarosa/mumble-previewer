import { Config } from "./config";
import { replaceAll } from "./utils";

const BOF_CHAR_PAIRS: [string, number][] = [
  ["ABCDEFGHIJKLMNOPQRSTUVWXYZ", 8],
  ["abcdefghijklmnopqrstuvwxyz", 8],
  ["0123456789", 8],
  [",.!?': ", 8],
  ["àèéìòùÈ", 8],
];

const BOF_REGEXES: [string | RegExp, string][] = [
  ["{07}{00}", "RyuX"],
  ["{07}{01}", "BoXX"],
  ["{07}{02}", "Nina"],
  ["{07}{03}", "OxXX"],
  ["{07}{04}", "Gobi"],
  ["{07}{05}", "Karn"],
  ["{07}{06}", "Mogu"],
  ["{07}{07}", "Bleu"],
  ["{09}{01}", "Drogen"],
  ["{09}{02}", "Nanai"],
  ["{09}{03}", "Winlan"],
  ["{09}{04}", "Romero"],
  ["{09}{05}", "Gust"],
  ["{09}{06}", "Camlon"],
  ["{09}{07}", "Nada"],
  ["{09}{08}", "Tantar"],
  ["{09}{09}", "Tuntar"],
  ["{09}{0a}", "Agua"],
  ["{09}{0b}", "Auria"],
  ["{09}{0c}", "Bleak"],
  ["{09}{0d}", "Arad"],
  ["{09}{0e}", "Spring"],
  ["{09}{0f}", "Tunlan"],
  ["{09}{10}", "Gant"],
  ["{09}{11}", "Scande"],
  ["{09}{12}", "Carmen"],
  ["{09}{13}", "Gramor"],
  ["{09}{14}", "Wisdon"],
  ["{09}{15}", "Karma"],
  ["{09}{16}", "Prima"],
  ["{09}{17}", "Crypt"],
  ["{09}{18}", "Nabal"],
  ["{09}{19}", "Tock"],
  ["{09}{1a}", "Spyre"],
  ["{09}{1b}", "ObeliskX"],
  ["{09}{1c}", "Pagoda"],
  ["{0a}{38}", "RemedyXX"],
  ["{0a}{3a}", "SawXXXXX"],
  ["{0a}{3b}", "TabletXX"],
  ["{0a}{3c}", "RingXXXX"],
  ["{0a}{46}", "BookXXXX"],
  ["{0a}{54}", "I.OreXXX"],
  ["{0a}{5a}", "EggXXXXX"],
  ["{0a}{5b}", "SphereXX"],
  ["{0a}{5c}", "GillsXXX"],
  ["{0a}{5d}", "G.BarXXX"],
  ["{0a}{5e}", "IcicleXX"],
  ["{0a}{5f}", "FifeXXXX"],
  ["{0a}{60}", "PassXXXX"],
  ["{0a}{65}", "ListXXXX"],
  ["{0a}{6a}", "TmKeyXXX"],
  ["{0a}{6e}", "BolsterX"],
  ["{0a}{70}", "G.FlyXXX"],
  ["{0a}{71}", "OilXXXXX"],
  [/\{0[8,9,a,b,c]}{..\}/g, "XXXXXXX"],
  ["{01}", ""],
  ["{05}", ""],
  ["{06}", "XXXX"],
  [/\{2[8,4,d,e]\}/g, " "],
];

const BOF_TEXT_REPLACER = (text: string): string => {
  text = replaceAll(text, BOF_REGEXES);
  text = text.replaceAll("{04}", "\r");
  text = text.replaceAll("\n", "\n\t\t\t\t\t\t\t\t");
  return text;
};

export const bofConfig: Config = {
  charLimit: 222,
  lineLimit: 4,
  boxClasses: ["snes-256x224", "bof-box"],
  fontClass: "bof-font",
  charWidthPairs: BOF_CHAR_PAIRS,
  replacer: BOF_TEXT_REPLACER,
  autoParagraphBreak: false,
};
