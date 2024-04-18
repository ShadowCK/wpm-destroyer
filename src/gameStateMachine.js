import _ from 'lodash';
import { GameState, Diffculty, EventType } from './enums.js';
import events from './events.js';
import { addChar, backspace, clearLines, genLine } from './wordManager.js';

let currentState = GameState.initial;
let currentDifficulty = Diffculty.easy;

const getState = () => currentState;

const getDifficulty = () => currentDifficulty;

const startGame = (eventData) => {
  if (currentState !== GameState.finished && currentState !== GameState.initial) {
    console.error('Invalid game state to start game', currentState);
    if (eventData) {
      eventData.isCancelled = true;
    }
    return;
  }
  currentDifficulty = Diffculty.easy;
  currentState = GameState.playing;
  _.times(3, () => genLine(currentDifficulty));
  console.log('Starting game');
};

const finishGame = (eventData) => {
  if (currentState !== GameState.playing) {
    console.error('Invalid game state to finish game', currentState);
    if (eventData) {
      eventData.isCancelled = true;
    }
    return;
  }
  currentState = GameState.finished;
  clearLines();
  console.log('Finishing game');
};

const registerEvents = () => {
  events.on(EventType.startGame, startGame);
  events.on(EventType.finishGame, finishGame);
  events.on(EventType.userInput, (event) => {
    if (currentState !== GameState.playing) {
      return;
    }
    // Check if it's a valid key
    if (event.which !== 8 && event.which < 65 && event.which > 90 && event.which !== 32) {
      return;
    }
    // Backspace
    if (event.which === 8) {
      backspace();
    }
    // Space or letter
    else {
      addChar(event.key);
    }
    // Tell HTML to update
    events.emit(EventType.typeChar);
  });
};

window.getState = getState;

export { getState, getDifficulty, registerEvents };
