import { AIMode, EventType, GameState } from './enums.js';
import events from './events.js';
import settings from './settings.js';
import { getState } from './gameStateMachine.js';

let aiState = AIMode.stable; // Default AI state

const switchState = (data) => {
  const { WPM, accuracy, consistency, withinThresholdPercentage } = data;

  if (getState() !== GameState.playing) {
    return; // Only adjust AI state if the game is in playing state
  }

  // Decide the AI mode based on performance metrics and settings
  if (WPM > settings.targetWPM + settings.WPMThreshold) {
    // If the player's WPM is significantly higher than the target and consistent, make the game harder
    if (
      consistency < settings.highConsistencyThreshold &&
      withinThresholdPercentage < settings.withinThresholdPercentage
    ) {
      aiState = AIMode.aggressive;
    } else {
      aiState = AIMode.stable; // Otherwise, maintain stable if they are within the consistency range
    }
  } else if (
    WPM < settings.targetWPM - settings.WPMThreshold ||
    accuracy < settings.accuracyThreshold
  ) {
    // If the player's WPM is below target or their accuracy is low, switch to helping mode
    aiState = AIMode.helping;
  } else {
    // Default to stable if none of the extreme conditions are met
    aiState = AIMode.stable;
  }

  console.log(
    `AI State changed to: ${aiState} with ${withinThresholdPercentage}% within threshold`,
  );
};

const registerEvents = () => {
  events.on(EventType.updatePerformanceMetrics, (data) => {
    switchState(data);
  });
};

export { registerEvents };
