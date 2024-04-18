import easyWordsText from './English100.txt';
import mediumWordsText from './English200.txt';
import hardWordsText from './English1000.txt';

import { Diffculty, EventType, GameState } from './enums.js';
import { genLineContent } from './utils.js';
import settings from './settings.js';
import events from './events.js';
import { getDifficulty } from './gameStateMachine.js';

const getWords = (text) => text.split(/\r?\n/);

const WordList = {
  [Diffculty.easy]: getWords(easyWordsText),
  [Diffculty.medium]: getWords(mediumWordsText),
  [Diffculty.hard]: getWords(hardWordsText),
};

// Time when player started typing, not started game
let startTime = null;

const currentLines = [];
let userInput = '';

let WPM = 0;
let correctInputs = [];
let correctLineInputs = [];

let consistencyTracker = [];
const getConsitency = () => {
  const mean =
    consistencyTracker.reduce((acc, data) => acc + data.WPM, 0) / consistencyTracker.length;
  const standardDeviation = Math.sqrt(
    consistencyTracker.map((data) => (data.WPM - mean) ** 2).reduce((acc, val) => acc + val, 0) /
      consistencyTracker.length,
  );
  // coefficient of variation in percentage, smaller is better
  const cv = (standardDeviation / mean) * 100;
  return cv || 0;
};

// Accuracy
let correctChars = 0;
let totalChars = 0;
const getAccuracy = () => (correctChars / totalChars) * 100 || 0;

const currentWordList = (difficulty) => WordList[difficulty];

const calcWithinThresholdPercentage = () => {
  const withinThresholdCount = consistencyTracker.filter((data) => {
    const { WPM: recordedWPM } = data;
    return (
      recordedWPM < settings.targetWPM + settings.WPMThreshold &&
      recordedWPM > settings.targetWPM - settings.WPMThreshold
    );
  }).length;
  return (withinThresholdCount / consistencyTracker.length) * 100 || 0; // Return as percentage
};

const calculatePerformance = () => {
  const now = Date.now();
  correctInputs = correctInputs.filter((input) => now - input.time < settings.WPMTrackerDuration);
  consistencyTracker = consistencyTracker.filter(
    (data) => now - data.time < settings.consistencyTrackerDuration,
  );
  if (correctInputs.length === 0) {
    WPM = 0;
  } else {
    const timeTilFirstInput = now - correctInputs[0].time;
    const minutesElapsed = timeTilFirstInput / 60000;
    WPM = correctInputs.length / settings.charsPerWord / minutesElapsed;
  }
  if (
    now - startTime > settings.consistencyTrackerTimeHolder &&
    totalChars > settings.consistencyTrackerCharHolder
  ) {
    consistencyTracker.push({ WPM, time: now });
  }
  events.emit(EventType.updatePerformanceMetrics, {
    WPM,
    accuracy: getAccuracy(),
    consistency: getConsitency(),
    difficulty: getDifficulty(),
    withinThresholdPercentage: calcWithinThresholdPercentage(),
  });
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
  if (!startTime) {
    startTime = Date.now();
  }
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
  // Correct input
  if (char === line1Content[index]) {
    // Check if we already have a correct input at this index
    // Don't count repeated correct inputs into WPM.
    if (correctLineInputs.findIndex((input) => input.index === userInput.length) === -1) {
      correctLineInputs.push({ index: userInput.length });
      correctInputs.push({ time: Date.now() });
    }
    // However, count repeated correct inputs into accuracy
    correctChars += 1;
  }
  // Any input, correct, incorrect, or repeated
  totalChars += 1;
};

const setUserInput = (input) => {
  userInput = input;
};

const reset = () => {
  startTime = null;
  WPM = 0;
  correctChars = 0;
  totalChars = 0;
  consistencyTracker = [];
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
  calculatePerformance,
  getAccuracy,
  getConsitency,
  calcWithinThresholdPercentage,
};
