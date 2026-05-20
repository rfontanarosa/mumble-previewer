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
  variant?: string;
}

type ConfigFactory = Config | ((text: string) => Config);

interface Variant {
  label: string;
  config: ConfigFactory;
}

interface GameDescriptor {
  default: ConfigFactory;
  variants?: Record<string, Variant>;
  detect?: (text: string) => string | undefined;
}

export interface VariantInfo {
  id: string;
  label: string;
}

export interface LanguageInfo {
  id: string;
  label: string;
}

const LANGUAGE_LABELS: Record<string, string> = {
  it: "Italian",
  pt: "Portuguese",
};

function resolveFactory(factory: ConfigFactory, text: string): Config {
  return typeof factory === "function" ? factory(text) : factory;
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

const BASE_CONFIGS: Record<string, GameDescriptor> = {
  "7thsaga":   { default: seventhsagaConfig },
  "alcahest":  { default: alcahestConfig },
  "bof":       { default: bofConfig },
  "brandishdr": { default: brandishdrConfig },
  "brainlord": { default: brainlordConfig },
  "ffmq":      { default: ffmqConfig },
  "gaia":      { default: gaiaConfig },
  "ignition":  { default: ignitionConfig },
  "lom":       { default: lomConfig },
  "lufia":     { default: lufiaConfig },
  "mmlegends": { default: (text) => ({ ...MMLEGENDS.config, ...MMLEGENDS.getConfigByText(text) }) },
  "neugier":   { default: neugierConfig },
  "sd3":       {
    default: sd3Config,
    variants: {
      alt:  { label: "Alternate", config: sd3ConfigAlt },
      line: { label: "Single line", config: sd3ConfigLine },
    },
    detect: (text) => {
      if (text.startsWith("<ALT>"))  return "alt";
      if (text.startsWith("<LINE>")) return "line";
      return undefined;
    },
  },
  "smrpg":     { default: smrpgConfig },
  "soe":       { default: soeConfig },
  "som":       { default: somConfig },
  "spike":     { default: spikeConfig },
  "starocean": { default: staroceanConfig },
  "valkyrie":  { default: valkyrieConfig },
  "ys3":       { default: (text) => ({ ...YS3.config, ...YS3.getConfigByText(text) }) },
};

export const CONFIG_IDS: string[] = Object.keys(BASE_CONFIGS);

export function getAvailableLanguages(id: string): LanguageInfo[] {
  const descriptor = BASE_CONFIGS[id];
  if (!descriptor) return [];
  return Object.keys(resolveFactory(descriptor.default, "").languages ?? {}).map(
    (code) => ({ id: code, label: LANGUAGE_LABELS[code] ?? code })
  );
}

export function getAvailableVariants(id: string): VariantInfo[] {
  const descriptor = BASE_CONFIGS[id];
  if (!descriptor) return [];
  return Object.entries(descriptor.variants ?? {}).map(
    ([id, v]) => ({ id, label: v.label })
  );
}

export function getConfig(ref: ConfigRef, text: string): Config {
  const { id, language, variant } = ref;
  const descriptor = BASE_CONFIGS[id];
  if (!descriptor) {
    console.warn(`mumble-previewer: unknown config id "${id}", falling back to brandishdr`);
    return brandishdrConfig;
  }

  let factory: ConfigFactory | undefined;
  if (variant) {
    factory = descriptor.variants?.[variant]?.config;
    if (!factory) {
      console.warn(`mumble-previewer: unknown variant "${variant}" for "${id}", using default`);
    }
  }
  if (!factory) {
    const detected = descriptor.detect?.(text);
    if (detected) factory = descriptor.variants?.[detected]?.config;
  }
  if (!factory) factory = descriptor.default;

  const base = resolveFactory(factory, text);
  if (language) {
    const langExt = base.languages?.[language];
    if (langExt) return applyLanguage(base, language, langExt);
    console.warn(`mumble-previewer: unknown language "${language}" for "${id}", using default`);
  }
  return base;
}
