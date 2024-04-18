import _ from 'lodash';
import { GameState, Diffculty, EventType } from './enums.js';
import events from './events.js';
import { addChar, addLine, backspace, calculatePerformance, reset } from './wordManager.js';

let currentState = GameState.initial;
let currentDifficulty = Diffculty.medium;

const getState = () => currentState;

const getDifficulty = () => currentDifficulty;

const setDifficulty = (difficulty) => {
  currentDifficulty = difficulty;
};

const startGame = (eventData) => {
  if (currentState !== GameState.finished && currentState !== GameState.initial) {
    console.error('Invalid game state to start game', currentState);
    if (eventData) {
      eventData.isCancelled = true;
    }
    return;
  }
  reset();
  currentDifficulty = Diffculty.medium;
  currentState = GameState.playing;
  _.times(3, () => addLine(currentDifficulty));
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
  reset();
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
    if (event.which !== 8 && (event.which < 65 || event.which > 90) && event.which !== 32) {
      return;
    }
    // Backspace
    if (event.which === 8) {
      backspace();
    }
    // Space or letter
    else {
      addChar(event.key, currentDifficulty);
    }
    // Tell HTML to update
    events.emit(EventType.typeChar);
  });
  setInterval(calculatePerformance, 5);
};

window.getState = getState;

export { getState, getDifficulty, registerEvents, setDifficulty };
