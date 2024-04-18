import { getLine } from './wordManager.js';

const genLineContent = (num) => getLine(num).join(' ');

const updateLines = () => {
  $('#line1').text(genLineContent(1));
  $('#line2').text(genLineContent(2));
  $('#line3').text(genLineContent(3));
};

const clearLines = () => {
  $('#line1, #line2, #line3').text('');
};

export { updateLines, clearLines };
