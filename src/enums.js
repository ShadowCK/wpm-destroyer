const GameState = {
  initial: 'initial',
  playing: 'playing',
  finished: 'finished',
};

const Diffculty = {
  easy: 'easy',
  medium: 'medium',
  hard: 'hard',
};

const EventType = {
  startGame: 'startGame',
  finishGame: 'finishGame',
  userInput: 'userInput',
  typeChar: 'typeChar',
  updateWPM: 'updateWPM',
};

export { GameState, Diffculty, EventType };
