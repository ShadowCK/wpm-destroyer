import { AIMode, Diffculty, EventType, GameState } from './enums.js';
import events from './events.js';
import { getState, setDifficulty } from './gameStateMachine.js';
import settings from './settings.js';
import {
  addComplexWords,
  randomizeWords,
  addExtraSpaces,
  simplifyWords,
  provideHints,
  giveImmediateFeedback,
} from './gameActions.js';

let aiState = AIMode.stable; // Default AI state

const applyAIBehavior = () => {
  switch (aiState) {
    case AIMode.aggressive:
      setDifficulty(Diffculty.hard); // Increase game difficulty
      addComplexWords(); // Introduce complex and obscure vocabulary
      randomizeWords(); // Swap words or replace them with new ones
      break;
    case AIMode.helping:
      setDifficulty(Diffculty.easy); // Decrease game difficulty
      simplifyWords(); // Provide simpler words to increase player's success feeling
      provideHints(); // Offer first letter hints when the player hesitates
      giveImmediateFeedback(); // Provide immediate feedback on errors with correct options
      break;
    case AIMode.stable:
      setDifficulty(Diffculty.medium);
      // Maintain natural game flow, no intervention needed
      break;
    default:
      break;
  }
};

const switchState = (data) => {
  const { WPM, accuracy, consistency, withinThresholdPercentage } = data;

  if (getState() !== GameState.playing) {
    return; // Only adjust AI state if the game is in playing state
  }

  // Using all performance metrics to adjust AI state
  if (
    WPM > settings.targetWPM + settings.WPMThreshold &&
    consistency < settings.highConsistencyThreshold
  ) {
    if (withinThresholdPercentage < settings.withinThresholdPercentage) {
      aiState = AIMode.aggressive;
    } else {
      aiState = AIMode.stable;
    }
  } else if (
    WPM < settings.targetWPM - settings.WPMThreshold ||
    accuracy < settings.accuracyThreshold
  ) {
    aiState = AIMode.helping;
  } else {
    aiState = AIMode.stable;
  }

  console.log(`AI State changed to: ${aiState}`);
  applyAIBehavior();
};

const registerEvents = () => {
  events.on(EventType.updatePerformanceMetrics, (data) => {
    switchState(data);
  });
};

export { registerEvents };
