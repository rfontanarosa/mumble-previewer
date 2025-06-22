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
    previewContainer.appendChild(boxElement);
    boxElement.appendChild(screenElement);
    boxElement.appendChild(infoBoxElement);
    boxElement.appendChild(warningBoxElement);

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

    const table = document.createElement("table");
    table.innerHTML = `
      <thead>\
        <th style="width: 12%;">#</th>\
        <th style="width: 22%;">Used</th>\
        <th style="width: 22%;">Available</th>\
        <th style="width: 22%;">Padding</th>\
        <th style="width: 22%;">Centered</th>\
      </thead>
    `;

    const tableBody = document.createElement("tbody");

    charCounters.forEach((count, i) => {
      const textExceedsCharacterLimit = count > charLimit;
      tableBody.innerHTML += `
        <tr>\
          <td>${i + 1}</td>\
          <td>${count}px</td>\
          <td class="${textExceedsCharacterLimit ? "text-danger" : ""}">${charLimit - count}px</td>\
          <td>${padCounters[i]}px</td>\
          <td>${[0, 1].includes(padCounters[i] - (charLimit - count)) ? "Y" : "N"}</td>\
        </tr>
      `;

      if (textExceedsCharacterLimit) {
        warningBoxElement.innerHTML += `<div class="text-danger">Line ${i + 1} exceeds character limit</div>`;
      }
    });
    table.appendChild(tableBody);
    infoBoxElement.appendChild(table);

    if (unsupportedChars.length > 0) {
      warningBoxElement.innerHTML += `<div class="text-danger">Unsupported character(s): ${unsupportedChars.join()}</div>`;
    }

    warningBoxElement.style.display = warningBoxElement.hasChildNodes() ? '' : 'none';
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
