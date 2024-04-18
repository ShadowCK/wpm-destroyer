import easyWordsText from './English100.txt';
import mediumWordsText from './English200.txt';
import hardWordsText from './English1000.txt';

import { Diffculty } from './enums.js';

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

const genLine = (difficulty) => {
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
  userInput += char;
};

export { genWordsForLine, genLine, currentWordList, clearLines, getLine, backspace, addChar };
