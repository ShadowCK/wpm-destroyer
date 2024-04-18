import easyWordsText from './English100.txt';
import mediumWordsText from './English200.txt';
import hardWordsText from './English1000.txt';

import { Diffculty } from './enums.js';
import { genLineContent } from './htmlHelper.js';
import { getDifficulty } from './gameStateMachine.js';

const getWords = (text) => text.split(/\r?\n/);

const WordList = {
  [Diffculty.easy]: getWords(easyWordsText),
  [Diffculty.medium]: getWords(mediumWordsText),
  [Diffculty.hard]: getWords(hardWordsText),
};

const currentLines = [];

let userInput = '';

const currentWordList = (difficulty) => WordList[difficulty];

const genWord = (difficulty) => {
  const wordList = currentWordList(difficulty);
  return currentWordList(difficulty)[Math.floor(Math.random() * wordList.length)];
};

// Function to generate a line of words based on difficulty
const genWordsForLine = (difficulty) => {
  const words = [];
  for (let i = 0; i < 10; i += 1) {
    words.push(genWord(difficulty));
  }
  return words;
};

const addLine = (difficulty) => {
  const words = genWordsForLine(difficulty);
  currentLines.push(words);
};

const clearLines = () => {
  currentLines.length = 0;
};

const getLine = (num) => {
  if (num < 1 || num > 3) {
    throw new Error('Invalid line number');
  }
  return currentLines[num - 1];
};

const backspace = () => {
  userInput = userInput.substring(0, userInput.length - 1);
};

const addChar = (char) => {
  if (userInput === genLineContent(1)) {
    // Proceed to next line
    userInput = '';
    currentLines.shift();
    addLine(getDifficulty());
    return;
  }
  userInput += char;
  console.log(userInput);
};

const setUserInput = (input) => {
  userInput = input;
};

const reset = () => {
  userInput = '';
  clearLines();
};

const getUserInput = () => userInput;

export {
  genWordsForLine,
  addLine,
  currentWordList,
  clearLines,
  getLine,
  backspace,
  addChar,
  getUserInput,
  setUserInput,
  reset,
};
