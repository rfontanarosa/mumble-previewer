import { Config, getConfig } from "./config";
import { generateCharWidthMap, replaceAt } from "./utils";

function processText(
  text: string,
  charWidthMap: { [key: string]: number },
  options: Config
): string {
  const { charLimit, lineLimit, replacer, autoLineBreak, autoBoxOverflow } =
    options;

  if (replacer) text = replacer(text);

  let spaceIndex = -1;
  let charCounter = 0;
  let wordCounter = 0;
  let lineCounter = 1;
  let processedText = "";
  for (let i = 0; i < text.length; i++) {
    const utf16char = text.charAt(i);
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
        spaceIndex = i;
        charCounter += charWidthMap[utf16char] || 0;
        wordCounter = 0;
        break;
      default:
        const charWidth = charWidthMap[utf16char] || 0;
        charCounter += charWidth;
        wordCounter += charWidth;
        if (autoLineBreak && charCounter > charLimit) {
          if (spaceIndex !== -1) {
            if (lineCounter >= lineLimit) {
              processedText = replaceAt(processedText, spaceIndex, "\r");
              lineCounter = 1;
            } else {
              if (autoBoxOverflow && lineCounter > lineLimit) {
                processedText = replaceAt(processedText, spaceIndex, "\r");
                spaceIndex = -1;
                charCounter = 0;
                wordCounter = 0;
                lineCounter = 1;
              } else {
                processedText = replaceAt(processedText, spaceIndex, "\n");
                lineCounter += 1;
              }
            }
          }
          spaceIndex = -1;
          charCounter = wordCounter;
        }
    }
  }
  return processedText;
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
  } = options;
  const previewContainer = document.getElementById(containerSelector);

  if (!previewContainer) return;

  const dialogs = text.split("\r").filter((element) => element !== "");

  dialogs.forEach((dialog, index) => {
    const boxElementId = `box-${index}`;

    const boxElement = document.createElement("div");
    boxElement.id = boxElementId;
    boxElement.classList.add("preview-box", ...boxClasses);
    const screenElement = document.createElement("div");
    screenElement.className = "screen";
    const textBoxElement = document.createElement("div");
    textBoxElement.className = "text-box";
    if (relativePositionWindow) {
      const { left, top, width, height, padding } = relativePositionWindow;
      textBoxElement.style.cssText = `margin-left: ${left}px; margin-top: ${top}px; width: ${width}px; height: ${height}px; padding: ${padding || 0}px`;
    }
    const infoBoxElement = document.createElement("div");
    infoBoxElement.className = "info-box";

    previewContainer.appendChild(boxElement);
    boxElement.appendChild(screenElement);
    screenElement.appendChild(textBoxElement);
    boxElement.appendChild(infoBoxElement);

    let lineIndex = 0;
    const lineBuffers: string[] = new Array(lineLimit).fill("");
    const charCounters: number[] = new Array(lineLimit).fill(0);
    const padCounters: number[] = new Array(lineLimit).fill(0);
    const unsupportedChars: string[] = [];

    for (let i = 0; i < dialog.length; i++) {
      const utf16char = dialog.charAt(i);
      const utf16int = utf16char.charCodeAt(0);
      if (charWidthMap[utf16char] > 0) {
        charCounters[lineIndex] += charWidthMap[utf16char];
        lineBuffers[lineIndex] +=
          `<div class="${fontClass} char char-${utf16int}"></div>`;
      } else if (utf16char === "\t") {
        charCounters[lineIndex] += 1;
        padCounters[lineIndex] += 1;
        lineBuffers[lineIndex] += '<div class="pad"></div>';
      } else if (utf16char === "\n") {
        lineIndex++;
      } else {
        unsupportedChars.push(utf16char);
      }
    }

    lineBuffers.forEach((lineBuffer) => {
      const lineElement = document.createElement("div");
      lineElement.innerHTML = lineBuffer;
      lineElement.className = "text-line";
      textBoxElement.appendChild(lineElement);
    });

    charCounters.forEach((count, i) => {
      const counterElement = document.createElement("div");
      counterElement.innerHTML = `
        <div class="${count > charLimit ? "redtext" : ""}">\
          Line ${i + 1}: ${count} pixel --- ${padCounters[i]} pixel --- ${charLimit - count} pixel --- ${[0, 1].includes(padCounters[i] - (charLimit - count)) ? "Y" : "N"}\
        </div>
      `;
      infoBoxElement.appendChild(counterElement);
    });

    if (unsupportedChars.length > 0) {
      const unsupportedCharsElement = document.createElement("div");
      unsupportedCharsElement.innerHTML = `<span class"redtext">Unsupported character(s): ${unsupportedChars.join()}</span>`;
      infoBoxElement.appendChild(unsupportedCharsElement);
    }
  });
}

export function renderPreview(
  containerId: string,
  text: string,
  config: string | Config
): void {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = "";
    const options =
      typeof config === "string" ? getConfig(config, text) : config;
    const charWidthMap = generateCharWidthMap(options.charWidthPairs);
    const processedText = processText(text, charWidthMap, options);
    renderHtml(containerId, processedText, charWidthMap, options);
  } else {
    console.error(`Missing container ${containerId}`);
  }
}
