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
    for (let i = 0; i < char.length; i++) {
      charWidthMap[char[i]] = frequency;
    }
  }
  return charWidthMap;
}
