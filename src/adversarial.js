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
let aiActionTimer = null;

const applyAIBehavior = () => {
  // If there is already a pending action, do not schedule another one
  if (aiActionTimer) {
    return;
  }

  aiActionTimer = setTimeout(() => {
    // Perform actions based on the current state
    if (aiState === AIMode.aggressive) {
      setDifficulty(Diffculty.hard); // Increase game difficulty
      const aggressiveActions = [addComplexWords, randomizeWords, addExtraSpaces];
      const aggressiveAction =
        aggressiveActions[Math.floor(Math.random() * aggressiveActions.length)];
      aggressiveAction(); // Execute one random aggressive action
    } else if (aiState === AIMode.helping) {
      setDifficulty(Diffculty.easy); // Decrease game difficulty
      const helpingActions = [simplifyWords, provideHints, giveImmediateFeedback];
      const helpingAction = helpingActions[Math.floor(Math.random() * helpingActions.length)];
      helpingAction(); // Execute one random helping action
    } else if (aiState === AIMode.stable) {
      setDifficulty(Diffculty.medium);
    } else {
      console.error(`Unknown AI state: ${aiState}`);
    }

    // After action is executed, clear the timer and reset aiActionTimer to allow new actions
    aiActionTimer = null;
    console.log(`AI Action executed: ${aiState}`);
  }, settings.minAIActionDelay + Math.random() * (settings.maxAIActionDelay - settings.minAIActionDelay));
};

const switchState = (data) => {
  // Do not apply AI behavior in practice mode
  if (settings.practiceMode) {
    return;
  }

  const { WPM, accuracy, consistency, withinThresholdPercentage } = data;

  if (getState() !== GameState.playing) {
    return; // Only adjust AI state if the game is in playing state
  }

  if (
    WPM > settings.targetWPM + settings.WPMThreshold &&
    consistency < settings.highConsistencyThreshold &&
    withinThresholdPercentage < settings.withinThresholdPercentage
  ) {
    aiState = AIMode.aggressive;
  } else if (
    WPM < settings.targetWPM - settings.WPMThreshold ||
    accuracy < settings.accuracyThreshold
  ) {
    aiState = AIMode.helping;
  } else {
    aiState = AIMode.stable;
  }

  // console.log(`AI State changed to: ${aiState}`);
  applyAIBehavior();
};

const registerEvents = () => {
  events.on(EventType.updatePerformanceMetrics, (data) => {
    switchState(data);
  });
};

export { registerEvents };
