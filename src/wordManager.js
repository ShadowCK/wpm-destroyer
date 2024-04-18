import easyWordsText from './English100.txt';
import mediumWordsText from './English200.txt';
import hardWordsText from './English1000.txt';

import { Diffculty, EventType, GameState } from './enums.js';
import { genLineContent } from './utils.js';
import settings from './settings.js';
import events from './events.js';

const getWords = (text) => text.split(/\r?\n/);

const WordList = {
  [Diffculty.easy]: getWords(easyWordsText),
  [Diffculty.medium]: getWords(mediumWordsText),
  [Diffculty.hard]: getWords(hardWordsText),
};

const currentLines = [];

let WPM = 0;
let correctInputs = [];
let correctLineInputs = [];
let userInput = '';

const currentWordList = (difficulty) => WordList[difficulty];

const calculateWPM = () => {
  const now = Date.now();
  correctInputs = correctInputs.filter((input) => now - input.time < settings.WPMTrackerDuration);
  if (correctInputs.length === 0) {
    WPM = 0;
    events.emit(EventType.updateWPM, WPM);
    return;
  }
  const timeTilFirstInput = now - correctInputs[0].time;
  const minutesElapsed = timeTilFirstInput / 60000;
  WPM = correctInputs.length / settings.charsPerWord / minutesElapsed;
  console.log(correctInputs.length, minutesElapsed);
  events.emit(EventType.updateWPM, WPM);
};

const genWord = (difficulty) => {
  const wordList = currentWordList(difficulty);
  return currentWordList(difficulty)[Math.floor(Math.random() * wordList.length)];
};

// Function to generate a line of words based on difficulty
const genWordsForLine = (difficulty) => {
  const words = [];
  for (let i = 0; i < settings.wordsPerLine; i += 1) {
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

const addChar = (char, difficulty) => {
  const line1Content = genLineContent(getLine(1));
  const index = userInput.length;
  if (userInput === line1Content) {
    // Proceed to next line
    correctLineInputs = [];
    userInput = '';
    currentLines.shift();
    addLine(difficulty);
    return;
  }
  userInput += char;
  if (userInput.length > line1Content.length) {
    return;
  }
  if (char === line1Content[index]) {
    if (correctLineInputs.findIndex((input) => input.index === userInput.length) === -1) {
      correctLineInputs.push({ index: userInput.length });
      correctInputs.push({ time: Date.now() });
    }
  }
};

const setUserInput = (input) => {
  userInput = input;
};

const reset = () => {
  correctInputs = [];
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
  calculateWPM,
};
