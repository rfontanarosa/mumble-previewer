import { seventhsagaConfig } from "./_7thsaga";
import { brainlordConfig } from "./_brainlord";
import { ffmqConfig } from "./_ffmq";
import { gaiaItConfig } from "./_gaia";
import { ignitionConfig } from "./_ignition";
import { lufiaConfig } from "./_lufia";
import { MMLEGENDS } from "./_mmlegends";
import { neugierConfig } from "./_neugier";
import { spikeConfig } from "./_spike";
import { soeConfig } from "./_soe";
import { staroceanConfig } from "./_starocean";
import { sd3Config, sd3ConfigAlt, sd3ConfigLine } from "./_sd3";
import { bofConfig } from "./_bof";
import { smrpgConfig } from "./_smrpg";

export interface Config {
  charLimit: number;
  lineLimit: number;
  boxClasses: string[];
  fontClass: string;
  charWidthPairs: [string, number][];
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
}

export function getConfig(id: string, text: string): Config {
  switch (id) {
    case "7thsaga":
      return seventhsagaConfig;
    case "bof":
      return bofConfig;
    case "brainlord":
      return brainlordConfig;
    case "ffmq":
      return ffmqConfig;
    case "gaia":
      return gaiaItConfig;
    case "ignition":
      return ignitionConfig;
    case "lufia":
      return lufiaConfig;
    case "mmlegends":
      return { ...MMLEGENDS.config, ...MMLEGENDS.getConfigByText(text) };
    case "neugier":
      return neugierConfig;
    case "spike":
      return spikeConfig;
    case "sd3":
      if (text.startsWith("<ALT>")) return sd3ConfigAlt;
      else if (text.startsWith("<BOX>")) return sd3Config;
      else if (text.startsWith("<LINE>")) return sd3ConfigLine;
      // else if (text.startsWith("<CHOICE>"))
      // else if (text.startsWith("<MULTI>"))
      else return sd3Config;
    case "smrpg":
      return smrpgConfig;
    case "soe":
      return soeConfig;
    case "starocean":
    default:
      return staroceanConfig;
  }
}
