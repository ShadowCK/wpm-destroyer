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
  updatePerformanceMetrics: 'updatePerformanceMetrics',
};

const AIMode = {
  aggressive: 'aggressive',
  stable: 'stable',
  helping: 'helping',
};

export { GameState, Diffculty, EventType, AIMode };
