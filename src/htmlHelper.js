import { getLine, getUserInput } from './wordManager.js';
import { genLineContent } from './utils.js';
import settings from './settings.js';

const genLineHTML = (line, start = 0, end = line.length) => {
  let html = '';
  for (let i = start; i < end; i += 1) {
    if (line[i] === ' ') {
      html += `<span class="ui text" style="opacity:0">_</span>`;
    } else {
      html += `<span class="ui text">${line[i]}</span>`;
    }
  }
  return html;
};

const getLine1HTML = () => {
  const userInput = getUserInput();
  const line1 = genLineContent(getLine(1));
  let html = '';
  const shorter = Math.min(userInput.length, line1.length);
  const longer = Math.max(userInput.length, line1.length);
  for (let i = 0; i < shorter; i += 1) {
    const color = userInput[i] === line1[i] ? 'green' : 'red';
    html += `<span class="ui text ${color}">${line1[i] === ' ' ? '_' : line1[i]}</span>`;
  }
  if (userInput.length <= line1.length) {
    return html + genLineHTML(line1, shorter, longer);
  }
  // Display extra user input characters in red
  for (let i = shorter; i < longer; i += 1) {
    const char = userInput[i];
    html += `<span class="ui text red">${char === ' ' ? '_' : char}</span>`;
  }
  return html;
};

const updatePerformanceInfo = ({
  WPM,
  consistency,
  accuracy,
  difficulty,
  withinThresholdPercentage,
  aiMode,
}) => {
  $('#target-wpm').text(settings.targetWPM);
  $('#current-wpm').text(WPM.toFixed(2));
  $('#accuracy').text(`${accuracy.toFixed(2)}%`);
  $('#consistency').text(`${consistency.toFixed(2)}%`);
  $('#difficulty').text(difficulty);
  $('#ai-mode').text(aiMode);
  $('#within-threshold').text(`${withinThresholdPercentage.toFixed(2)}%`);
};

const updateLines = () => {
  $('#line1').html(getLine1HTML());
  $('#line2').html(genLineHTML(genLineContent(getLine(2))));
  $('#line3').html(genLineHTML(genLineContent(getLine(3))));
};

const clearLines = () => {
  $('#line1, #line2, #line3').text(`Let's start!`);
};

export { updateLines, clearLines, genLineContent, updatePerformanceInfo };
