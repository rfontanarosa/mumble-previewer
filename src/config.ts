import { Config, LanguageExtension, makeConfig } from "./types";
import { alcahestConfig } from "./_alcahest";
import { seventhsagaConfig } from "./_7thsaga";
import { brainlordConfig } from "./_brainlord";
import { ffmqConfig } from "./_ffmq";
import { gaiaConfig } from "./_gaia";
import { ignitionConfig } from "./_ignition";
import { lufiaConfig } from "./_lufia";
import { MMLEGENDS } from "./_mmlegends";
import { lomConfig } from "./_lom";
import { neugierConfig } from "./_neugier";
import { spikeConfig } from "./_spike";
import { soeConfig } from "./_soe";
import { somConfig } from "./_som";
import { staroceanConfig } from "./_starocean";
import { sd3Config, sd3ConfigAlt, sd3ConfigLine } from "./_sd3";
import { bofConfig } from "./_bof";
import { smrpgConfig } from "./_smrpg";
import { valkyrieConfig } from "./_valkyrie";
import { generateCharWidthMap } from "./utils";

export type { Config, LanguageExtension };
export { makeConfig };

function applyLanguage(base: Config, langCode: string, lang: LanguageExtension): Config {
  const mergedPairs = [...base.charWidthPairs, ...lang.charWidthPairs];
  return {
    ...base,
    fontClass: `${base.fontClass} ${langCode}`,
    charWidthPairs: mergedPairs,
    charWidthMap: generateCharWidthMap(mergedPairs),
    ...(lang.charLimit !== undefined && { charLimit: lang.charLimit }),
    ...(lang.lineLimit !== undefined && { lineLimit: lang.lineLimit }),
  };
}

const BASE_CONFIGS: Record<string, (text: string) => Config> = {
  "7thsaga":   ()     => seventhsagaConfig,
  "alcahest":  ()     => alcahestConfig,
  "bof":       ()     => bofConfig,
  "brainlord": ()     => brainlordConfig,
  "ffmq":      ()     => ffmqConfig,
  "gaia":      ()     => gaiaConfig,
  "ignition":  ()     => ignitionConfig,
  "lom":       ()     => lomConfig,
  "lufia":     ()     => lufiaConfig,
  "mmlegends": (text) => ({ ...MMLEGENDS.config, ...MMLEGENDS.getConfigByText(text) }),
  "neugier":   ()     => neugierConfig,
  "sd3":       (text) => {
    if (text.startsWith("<ALT>"))  return sd3ConfigAlt;
    if (text.startsWith("<LINE>")) return sd3ConfigLine;
    // <BOX>, <CHOICE>, <MULTI> all use the standard box config
    return sd3Config;
  },
  "smrpg":     ()     => smrpgConfig,
  "soe":       ()     => soeConfig,
  "som":       ()     => somConfig,
  "spike":     ()     => spikeConfig,
  "starocean": ()     => staroceanConfig,
  "valkyrie":  ()     => valkyrieConfig,
  "ys3":       (text) => ({ ...YS3.config, ...YS3.getConfigByText(text) }),
};

export const CONFIG_IDS: string[] = Object.keys(BASE_CONFIGS);

export function getConfig(id: string, text: string): Config {
  const exact = BASE_CONFIGS[id];
  if (exact) return exact(text);

  const sep = id.lastIndexOf("_");
  if (sep > 0) {
    const gameId   = id.slice(0, sep);
    const langCode = id.slice(sep + 1);
    const baseFactory = BASE_CONFIGS[gameId];
    if (baseFactory) {
      const base = baseFactory(text);
      const langExt = base.languages?.[langCode];
      if (langExt) return applyLanguage(base, langCode, langExt);
    }
  }

  console.warn(`mumble-previewer: unknown config id "${id}", falling back to starocean`);
  return staroceanConfig;
}
