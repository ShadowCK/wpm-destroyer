import { Diffculty } from './enums.js';
import { currentLines, genWord } from './wordManager.js';

const addComplexWords = () => {
  if (currentLines.length > 0) {
    // replace some words with complex words
    const lineIndex = Math.floor(Math.random() * currentLines.length);
    const wordIndex = Math.floor(Math.random() * currentLines[lineIndex].length);
    // Generate a hard word to replace
    currentLines[lineIndex][wordIndex] = genWord(Diffculty.hard);
    console.log('Adding complex and obscure vocabulary to challenge the player.');
  }
};

const randomizeWords = () => {
  if (currentLines.length > 0 && currentLines[0].length > 1) {
    const idx1 = Math.floor(Math.random() * currentLines[0].length);
    let idx2 = Math.floor(Math.random() * currentLines[0].length);
    while (idx1 === idx2) {
      // Ensure not the same index
      idx2 = Math.floor(Math.random() * currentLines[0].length);
    }
    // Swap words
    [currentLines[0][idx1], currentLines[0][idx2]] = [currentLines[0][idx2], currentLines[0][idx1]];
    console.log('Randomizing words order or replacing them to increase difficulty.');
  }
};

const addExtraSpaces = () => {
  currentLines.forEach((line, index) => {
    // Randomly add extra spaces after words
    currentLines[index] = line.map((word) => word + (Math.random() < 0.5 ? '  ' : ''));
  });
  console.log("Adding extra spaces randomly to test player's attention to spacing.");
};

const simplifyWords = () => {
  if (currentLines.length > 0) {
    const lineIndex = Math.floor(Math.random() * currentLines.length);
    const wordIndex = Math.floor(Math.random() * currentLines[lineIndex].length);
    // Generate a simple word to replace
    currentLines[lineIndex][wordIndex] = genWord(Diffculty.easy);
    console.log("Providing simpler vocabulary to increase player's success.");
  }
};
const provideHints = () => {
  // TODO: unimplemented, hints are likely useless? Maybe display the first letter very large in some place
  // console.log('Offering first letter hints to assist the player.');
};

const giveImmediateFeedback = () => {
  // TODO: unimplemented, probably not give feedback, but fix errors for player
};

export {
  addComplexWords,
  randomizeWords,
  addExtraSpaces,
  simplifyWords,
  provideHints,
  giveImmediateFeedback,
};
