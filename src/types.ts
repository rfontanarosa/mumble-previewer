import { generateCharWidthMap } from "./utils";

export interface LanguageExtension {
  charWidthPairs: [string, number][];
  charLimit?: number;
  lineLimit?: number;
}

export interface Config {
  charLimit: number;
  lineLimit: number;
  boxClasses: string[];
  fontClass: string;
  charWidthPairs: [string, number][];
  charWidthMap: Record<string, number>;
  replacer?: (input: string) => string;
  relativePositionWindow?: {
    left: number;
    top: number;
    width: number;
    height: number;
    padding?: number;
  };
  autoLineBreak?: boolean;
  autoBoxOverflow?: boolean;
  languages?: Record<string, LanguageExtension>;
}

export function makeConfig(def: Omit<Config, "charWidthMap">): Config {
  return {
    ...def,
    charWidthMap: generateCharWidthMap(def.charWidthPairs),
  };
}
