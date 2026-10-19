import { Config, ConfigRef, LanguageInfo, VariantInfo, getAvailableLanguages, getAvailableVariants, getConfig } from "./config";
import { decodeAbsolutePad, replaceAt } from "./utils";

export type { ConfigRef, LanguageInfo, VariantInfo };
export { getAvailableLanguages, getAvailableVariants };

function processText(
  text: string,
  charWidthMap: { [key: string]: number },
  options: Config
): string {
  const { charLimit, lineLimit, replacer, autoLineBreak, autoBoxOverflow } = options;

  if (replacer) text = replacer(text);

  let spaceIndex = -1;
  let charCounter = 0;
  let wordCounter = 0;
  let lineCounter = 1;
  let processedText = "";
  let utf16Index = 0;
  for (const utf16char of text) {
    processedText += utf16char;
    switch (utf16char) {
      case "\r":
        spaceIndex = -1;
        charCounter = 0;
        wordCounter = 0;
        lineCounter = 1;
        break;
      case "\n":
        spaceIndex = -1;
        charCounter = 0;
        wordCounter = 0;
        if (lineCounter >= lineLimit) {
          processedText = processedText.slice(0, -1) + "\r";
          lineCounter = 1;
        } else {
          lineCounter += 1;
        }
        break;
      case " ":
        spaceIndex = utf16Index;
        charCounter += charWidthMap[utf16char] || 0;
        wordCounter = 0;
        break;
      default: {
        const charWidth = charWidthMap[utf16char] || 0;
        charCounter += charWidth;
        wordCounter += charWidth;
        if (autoLineBreak && charCounter > charLimit) {
          if (spaceIndex !== -1) {
            if (lineCounter >= lineLimit) {
              if (autoBoxOverflow) {
                processedText = replaceAt(processedText, spaceIndex, "\r");
                lineCounter = 1;
              }
            } else {
              processedText = replaceAt(processedText, spaceIndex, "\n");
              lineCounter += 1;
            }
          }
          spaceIndex = -1;
          charCounter = wordCounter;
        }
      }
    }
    utf16Index += utf16char.length;
  }
  return processedText;
}

function isCentered(diff: number, padStep: number): boolean {
  return diff >= -(padStep - 1) && diff <= padStep;
}

function suggestedPadding(left: number, right: number, charLimit: number, step: number): number {
  const ideal = (charLimit - (right - left)) / 2;
  return Math.max(0, Math.ceil((ideal - (step - 1) / 2) / step) * step);
}

function renderHtml(
  containerSelector: string,
  text: string,
  charWidthMap: { [key: string]: number },
  options: Config
) {
  const {
    charLimit,
    lineLimit,
    boxClasses,
    fontClass,
    relativePositionWindow,
    padStep = 1,
  } = options;
  const previewContainer = document.getElementById(containerSelector);
  if (!previewContainer) return;

  const fragment = document.createDocumentFragment();

  const dialogs = text.split("\r").filter((element) => element !== "");

  dialogs.forEach((dialog, index) => {
    const boxElementId = `box-${index}`;

    const boxElement = document.createElement("div");
    boxElement.id = boxElementId;
    boxElement.classList.add("preview-box", ...boxClasses);
    const screenElement = document.createElement("div");
    screenElement.className = "screen";
    screenElement.addEventListener("click", () => {
      infoBoxElement.style.display = infoBoxElement.style.display === 'none' ? '' : 'none';
    });
    const textBoxElement = document.createElement("div");
    textBoxElement.className = "text-box";
    if (relativePositionWindow) {
      const { left, top, width, height, padding } = relativePositionWindow;
      textBoxElement.style.cssText = `margin-left: ${left}px; margin-top: ${top}px; width: ${width}px; height: ${height}px; padding: ${padding || 0}px`;
    }
    const infoBoxElement = document.createElement("div");
    infoBoxElement.className = "info-box";
    infoBoxElement.style.display = "none";
    const warningBoxElement = document.createElement("div");
    warningBoxElement.className = "warning-box";
    warningBoxElement.style.display = "none";

    screenElement.appendChild(textBoxElement);
    boxElement.appendChild(screenElement);
    boxElement.appendChild(infoBoxElement);
    boxElement.appendChild(warningBoxElement);
    fragment.appendChild(boxElement);

    let lineIndex = 0;
    const lineBuffers: string[] = new Array(lineLimit).fill("");
    const charCounters: number[] = new Array(lineLimit).fill(0);
    const padCounters: number[] = new Array(lineLimit).fill(0);
    const penPositions: number[] = new Array(lineLimit).fill(0);
    const leftEdges: number[] = new Array(lineLimit).fill(Infinity);
    const rightEdges: number[] = new Array(lineLimit).fill(0);
    const usesPad: boolean[] = new Array(lineLimit).fill(false);
    const unsupportedChars = new Set<string>();

    for (const utf16char of dialog) {
      const utf16int = utf16char.codePointAt(0)!;
      if (utf16char in charWidthMap) {
        const charWidth = charWidthMap[utf16char];
        if (utf16char !== " ") {
          leftEdges[lineIndex] = Math.min(leftEdges[lineIndex], penPositions[lineIndex]);
          rightEdges[lineIndex] = Math.max(rightEdges[lineIndex], penPositions[lineIndex] + charWidth);
        }
        charCounters[lineIndex] = Math.max(charCounters[lineIndex], penPositions[lineIndex] + charWidth);
        penPositions[lineIndex] += charWidth;
        lineBuffers[lineIndex] +=
          `<div class="${fontClass} char char-${utf16int}" style="width:${charWidth}px"></div>`;
      } else if (decodeAbsolutePad(utf16char) !== null) {
        const target = decodeAbsolutePad(utf16char)!;
        usesPad[lineIndex] = true;
        const shift = target - penPositions[lineIndex];
        penPositions[lineIndex] = target;
        lineBuffers[lineIndex] += `<div class="pad" style="width:0;margin-left:${shift}px"></div>`;
      } else if (utf16char === "\t") {
        charCounters[lineIndex] += 1;
        penPositions[lineIndex] += 1;
        usesPad[lineIndex] = true;
        lineBuffers[lineIndex] += '<div class="pad"></div>';
      } else if (utf16char === "\n") {
        lineIndex++;
      } else {
        unsupportedChars.add(utf16char);
      }
    }

    leftEdges.forEach((edge, i) => {
      padCounters[i] = Number.isFinite(edge) ? edge : 0;
    });

    lineBuffers.forEach((lineBuffer) => {
      const lineElement = document.createElement("div");
      lineElement.innerHTML = lineBuffer;
      lineElement.className = "text-line";
      textBoxElement.appendChild(lineElement);
    });

    const table = document.createElement("table");
    table.innerHTML = `
      <thead>
        <tr>
          <th style="width: 20%;">#</th>
          <th style="width: 40%;">Width</th>
          <th style="width: 40%;">Padding</th>
        </tr>
      </thead>
    `;

    const tableBody = document.createElement("tbody");
    const tableRows: string[] = [];
    const warnings: string[] = [];

    charCounters.forEach((count, i) => {
      const textExceedsCharacterLimit = count > charLimit;
      const hasText = Number.isFinite(leftEdges[i]);
      // the smallest move available: a pad step, or a space when the line is padded with spaces
      const step = usesPad[i] ? padStep : Math.max(1, charWidthMap[" "] || 1);
      const left = padCounters[i];
      const right = rightEdges[i];
      const centered = hasText && isCentered(left - (charLimit - right), step);
      // when the line is already centred, show the current padding so the two values match
      const suggested = centered ? left : suggestedPadding(left, right, charLimit, step);

      const rowClass = !hasText ? "empty" : textExceedsCharacterLimit ? "overflow" : centered ? "centered" : "";
      const paddingCell = hasText ? `${left} / ${suggested}` : "-";
      tableRows.push(`
        <tr class="${rowClass}">
          <td>${i + 1}</td>
          <td>${count} / ${charLimit}</td>
          <td>${paddingCell}</td>
        </tr>
      `);

      if (textExceedsCharacterLimit) {
        warnings.push(`<div class="text-danger">Line ${i + 1} exceeds character limit</div>`);
      }
    });
    tableBody.innerHTML = tableRows.join("");
    table.appendChild(tableBody);
    infoBoxElement.appendChild(table);

    if (unsupportedChars.size > 0) {
      const escaped = [...unsupportedChars].map((c: string) => `&#${c.codePointAt(0)};`).join(", ");
      warnings.push(`<div class="text-danger">Unsupported character(s): ${escaped}</div>`);
    }
    if (warnings.length > 0) warningBoxElement.innerHTML = warnings.join("");

    warningBoxElement.style.display = warningBoxElement.hasChildNodes() ? '' : 'none';
  });

  // Preserve which info boxes were open before re-render
  const openInfoBoxes = new Set<number>();
  previewContainer.querySelectorAll<HTMLElement>(".info-box").forEach((el, i) => {
    if (el.style.display !== "none") openInfoBoxes.add(i);
  });

  previewContainer.innerHTML = "";
  previewContainer.appendChild(fragment);

  if (openInfoBoxes.size > 0) {
    previewContainer.querySelectorAll<HTMLElement>(".info-box").forEach((el, i) => {
      if (openInfoBoxes.has(i)) el.style.display = "";
    });
  }
}

export function renderPreview(
  containerId: string,
  text: string,
  config: string | ConfigRef | Config
): void {
  const container = document.getElementById(containerId);
  if (container) {
    let options: Config;
    if (typeof config === "string") {
      options = getConfig({ id: config }, text);
    } else if ("id" in config) {
      options = getConfig(config, text);
    } else {
      options = config;
    }
    const charWidthMap = options.charWidthMap;
    const processedText = processText(text, charWidthMap, options);
    renderHtml(containerId, processedText, charWidthMap, options);
  } else {
    console.error(`Missing container ${containerId}`);
  }
}
