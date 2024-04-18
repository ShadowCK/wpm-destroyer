import { getLine, getUserInput } from './wordManager.js';

const genLineContent = (num) => getLine(num).join(' ');

const getLine1HTML = () => {
  const userInput = getUserInput();
  const line1 = genLineContent(1);
  let html = '';
  const shorter = Math.min(userInput.length, line1.length);
  const longer = Math.max(userInput.length, line1.length);
  for (let i = 0; i < shorter; i += 1) {
    const color = userInput[i] === line1[i] ? 'green' : 'red';
    html += `<span class="ui text ${color}">${line1[i]}</span>`;
  }
  if (userInput.length <= line1.length) {
    return html + line1.slice(userInput.length);
  }
  // Display extra user input characters in red
  for (let i = shorter; i < longer; i += 1) {
    const char = userInput[i];
    html += `<span class="ui text red">${char === ' ' ? '_' : char}</span>`;
  }
  return html;
};

const updateLines = () => {
  $('#line1').html(getLine1HTML());
  $('#line2').text(genLineContent(2));
  $('#line3').text(genLineContent(3));
};

const clearLines = () => {
  $('#line1, #line2, #line3').text(`Let's start the game!`);
};

export { updateLines, clearLines, genLineContent };
