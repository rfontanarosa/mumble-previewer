import { Config, getConfig } from "./config";
import { generateCharWidthMap, replaceAt } from "./utils";

function processText(
  text: string,
  charWidthMap: { [key: string]: number },
  options: Config
): string {
  const { charLimit, lineLimit, replacer, autoParagraphBreak } = options;

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
        if (lineCounter > lineLimit) {
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
        if (autoParagraphBreak && charCounter > charLimit) {
          if (spaceIndex !== -1) {
            if (lineCounter >= lineLimit) {
              processedText = replaceAt(processedText, spaceIndex, "\r");
              lineCounter = 1;
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
  const dialogs = text.split("\r").filter((element) => element !== "");

  let ppp = "";
  if (relativePositionWindow) {
    const { left, top, width, height, padding } = relativePositionWindow;
    ppp = `margin-left: ${left}px; margin-top: ${top}px; width: ${width}px; height: ${height}px; padding: ${padding || 0}px`;
  }

  dialogs.forEach((dialog, index) => {
    const boxId = `box-${index}`;
    const boxTemplate = `
      <div class="preview-box ${boxClasses.join(" ")}" id="${boxId}">\
        <div class="screen">\
          <div class="text-box" style="background-color: #007; outline: 1px solid white; position: absolute; ${ppp}"></div>\
        </div>\
        <div class="info-box">\
          <div class="counter1"></div>\
          <div class="counter2"></div>\
          <div class="counter3"></div>\
          <div class="counter4"></div>\
          <div class="alert"></div>\
        </div>\
      </div>
    `;
    previewContainer!.innerHTML += boxTemplate;

    let lineIndex = 0;
    const lineBuffers = new Array(lineLimit).fill("");
    const charCounters = new Array(lineLimit).fill(0);
    const padCounters = new Array(lineLimit).fill(0);
    const unsupportedChars = [];

    for (let i = 0; i < dialog.length; i++) {
      const utf16char = dialog.charAt(i);
      const utf16int = utf16char.charCodeAt(0);
      if (charWidthMap[utf16char] > 0) {
        charCounters[lineIndex] += charWidthMap[utf16char];
        lineBuffers[lineIndex] +=
          `<div class="${fontClass} ${fontClass}-${utf16int} char-${utf16int}"></div>`;
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

    const lineCounters = charCounters.map(
      (count, i) => `
      <div class="${count > charLimit ? "redtext" : ""}">
        Line ${i + 1}: ${count} pixel --- ${padCounters[i]} pixel --- ${charLimit - count} pixel --- ${[0, 1].includes(padCounters[i] - (charLimit - count)) ? "Y" : "N"}
      </div>
    `
    );

    const boxElement = previewContainer?.querySelector(
      `#${containerSelector} #${boxId}`
    );
    if (boxElement) {
      lineBuffers.forEach((lineBuffer) => {
        const lineElement = document.createElement("div");
        lineElement.innerHTML = lineBuffer;
        lineElement.className = "text-line";
        boxElement.querySelector(".text-box")?.appendChild(lineElement);
      });
      boxElement.querySelector(".counter1")!.innerHTML = lineCounters[0];
      boxElement.querySelector(".counter2")!.innerHTML = lineCounters[1];
      boxElement.querySelector(".counter3")!.innerHTML = lineCounters[2];
      boxElement.querySelector(".counter4")!.innerHTML = lineCounters[3];
      boxElement.querySelector(".alert")!.innerHTML =
        unsupportedChars.length > 0
          ? `<span class"redtext">Unsupported character(s): ${unsupportedChars.join()}</span>`
          : "";
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
