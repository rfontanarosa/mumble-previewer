import { Config, makeConfig } from "./types";
import { replaceAll } from "./utils";

const RSAGA_CHAR_PAIRS: [string, number][] = [
  ["il.!': ", 2],
  ["j()", 3],
  ["IJft1,\"-", 4],
  ["BCDEFGHKLPQRUVXabcdeghknopqrsuvyz023456789", 5],
  ["AMNOSTWYZmwx?", 6],
  ["/", 7],
  ["♂♀", 7],
];

const RSAGA_REGEXES: [string | RegExp, string][] = [
  [/\[WINDOW_POSITION ..\]\n?/g, ""],
  [/\[WINDOW ..\]\n?/g, ""],
  [/\[CLOSE\]\n?/g, ""],
  [/<[0-9A-Fa-f]{2},[0-9A-Fa-f]*>/g, ""], // <40,xxxx> / <4A,xxxx> opcodes
  [/\[MOVEMENT ..\]/g, ""],
  [/\[NEWLINE_WINDOW1\]\n?/g, "\n"],
  [/\[NEWLINE_WINDOW2\]\n?/g, "\n"],
  [/\[PAUSE\]/g, ""],
  [/\[SELECTION\]/g, ""],
  [/\[SELECTION2\]/g, ""],
  [/\[END_SELECTION2\]/g, ""],
  [/\[JUMPRETURN .. ..\]/g, ""],
  [/\[CHECKFLAG .. ..\]/g, ""],
  [/\[TEXT_POSITION .. ..\]/g, ""],
  [/\[SETFLAG .. ..\]/g, ""],
  [/\[SETRAM .. .. ..\]/g, ""],
  [/\[NAME ..\]/g, "XXXXXX"],
  [/\[ITEM ..\]/g, "YYYYYY"],
  [/\[NEWLINE_HALF\]/g, "\n"],
  [/\[WAIT ..\]/g, ""],
  [/\[NUMBER .. ..\]/g, "00"],
  [/\[[0-9A-F]{2}( [0-9A-F]{2})*\]/g, ""], // raw control bytes, e.g. [2B A0] [FF]
];

const RSAGA_TEXT_REPLACER = (text: string): string => {
  text = replaceAll(text, RSAGA_REGEXES);
  text = text.replaceAll("<WAIT>\n", "\r");
  text.match(/<PAD><..><..>/g)?.forEach((matchResult) => {
    const width = parseInt(matchResult.slice(6, 8), 16);
    // const height = parseInt(matchResult.slice(10, 12), 16);
    text = text.replaceAll(matchResult, "\t".repeat(width));
  });
  return text;
};

// Window types (the byte of `[WINDOW xx]`) and their text area. Widths come from the
// original RS1 editor (RS1Editor.previewText); a page without `[WINDOW]` uses the default
// window, and `[CLOSE]` resets to it.
// TODO line limits marked "?" are guesses: check them against the game.
const makeRsagaConfig = (windowId: string, charLimit: number, lineLimit: number): Config =>
  makeConfig({
    charLimit,
    lineLimit,
    boxClasses: ["snes-256x224", "rsaga-box", `window_${windowId}`],
    fontClass: "rsaga-main-font",
    charWidthPairs: RSAGA_CHAR_PAIRS,
    replacer: RSAGA_TEXT_REPLACER,
    autoLineBreak: true,
    autoBoxOverflow: true,
    languages: {
      it: { charWidthPairs: [["ì", 3], ["àèéòù", 5]] }
    }
  });

export const rsagaConfig = makeRsagaConfig("default", 191, 4);
export const rsagaConfig04 = makeRsagaConfig("04", 119, 2);
export const rsagaConfig0B = makeRsagaConfig("0B", 183, 4);
export const rsagaConfig0C = makeRsagaConfig("0C", 119, 3);
export const rsagaConfig0D = makeRsagaConfig("0D", 71, 2);

// Everything before the first visible character of a page: whitespace, newlines and codes that
// print nothing. Left in, the line breaks they carry become blank lines that push the text
// into an empty box (and, with autoBoxOverflow, into the next one).
const RSAGA_LEADING_CODES =
  /^(?:\s+|\[NEWLINE_WINDOW[12]\]|\[(?:WINDOW_POSITION|WINDOW|MOVEMENT|SETRAM|SETFLAG|CHECKFLAG|JUMPRETURN|TEXT_POSITION|WAIT|PAUSE)(?: [0-9A-Fa-f]{2})+\]|\[PAUSE\]|<[0-9A-Fa-f]{2},[0-9A-Fa-f]*>|\[[0-9A-F]{2}(?: [0-9A-F]{2})*\])+/;

/** Splits a text into boxes at every `[CLOSE]`, tagging each with its window id (if any). Pages without visible text are dropped. */
export function rsagaPaginate(text: string): { text: string; variant?: string }[] {
  return text
    .split("[CLOSE]")
    .map((page) => ({
      text: page.replace(RSAGA_LEADING_CODES, ""),
      variant: page.match(/\[WINDOW ([0-9A-Fa-f]{2})\]/)?.[1].toUpperCase(),
    }))
    // drop pages with nothing visible left once control codes are stripped (script-only pages
    // made of [SETRAM]/<4A,..>/[MOVEMENT]/[NEWLINE_WINDOW] would otherwise render empty boxes)
    .filter((page) => RSAGA_TEXT_REPLACER(page.text).trim() !== "");
}
