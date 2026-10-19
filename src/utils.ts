export function replaceAt(
  str: string,
  index: number,
  replacement: string
): string {
  return (
    str.slice(0, index) + replacement + str.slice(index + replacement.length)
  );
}

export function replaceAll(
  str: string,
  regexes: [string | RegExp, string][]
): string {
  return regexes.reduce(
    (curr, [pattern, replacement]) => curr.replaceAll(pattern, replacement),
    str
  );
}

export function generateCharWidthMap(charWidthPairs: [string, number][]): {
  [key: string]: number;
} {
  const charWidthMap: { [key: string]: number } = {};
  for (const [char, frequency] of charWidthPairs) {
    for (const c of char) {
      charWidthMap[c] = frequency;
    }
  }
  return charWidthMap;
}

// Private-use code points encode an "absolute pad" (pixels from the left
// border of the line, valid until the next pad or the end of the line).
const ABSOLUTE_PAD_BASE = 0xe000;

export function encodeAbsolutePad(pixels: number): string {
  return String.fromCharCode(ABSOLUTE_PAD_BASE + pixels);
}

export function decodeAbsolutePad(char: string): number | null {
  const code = char.charCodeAt(0) - ABSOLUTE_PAD_BASE;
  return char.length === 1 && code >= 0 && code <= 0xff * 8 ? code : null;
}
