import { Config, LanguageExtension, makeConfig } from "./types";
import { seventhsagaConfig } from "./_7thsaga";
import { alcahestConfig } from "./_alcahest";
import { bofConfig } from "./_bof";
import { brandishdrConfig } from "./_brandishdr";
import { brainlordConfig } from "./_brainlord";
import { ffmqConfig } from "./_ffmq";
import { gaiaConfig } from "./_gaia";
import { ignitionConfig } from "./_ignition";
import { lomConfig } from "./_lom";
import { lufiaConfig } from "./_lufia";
import { MMLEGENDS } from "./_mmlegends";
import { neugierConfig } from "./_neugier";
import { spikeConfig } from "./_spike";
import { soeConfig } from "./_soe";
import { somConfig } from "./_som";
import { staroceanConfig } from "./_starocean";
import { sd3Config, sd3ConfigAlt, sd3ConfigLine } from "./_sd3";
import { smrpgConfig } from "./_smrpg";
import { valkyrieConfig } from "./_valkyrie";
import { YS3 } from "./_ys3";
import { generateCharWidthMap } from "./utils";

export type { Config, LanguageExtension };
export { makeConfig };

export interface ConfigRef {
  id: string;
  language?: string;
}

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
  "brandishdr": ()    => brandishdrConfig,
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

export function getAvailableLanguages(id: string): string[] {
  const factory = BASE_CONFIGS[id];
  if (!factory) return [];
  return Object.keys(factory("").languages ?? {});
}

export function getConfig(ref: ConfigRef, text: string): Config {
  const { id, language } = ref;
  const factory = BASE_CONFIGS[id];
  if (!factory) {
    console.warn(`mumble-previewer: unknown config id "${id}", falling back to brandishdr`);
    return brandishdrConfig;
  }

  const base = factory(text);
  if (language) {
    const langExt = base.languages?.[language];
    if (langExt) return applyLanguage(base, language, langExt);
    console.warn(`mumble-previewer: unknown language "${language}" for "${id}", using default`);
  }
  return base;
}
