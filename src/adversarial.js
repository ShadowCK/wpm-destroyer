// Our adversarial AI
import { AIMode, EventType, GameState } from './enums.js';
import events from './events.js';
import settings from './settings.js';
import { getState } from './gameStateMachine.js';

let state = AIMode.aggressive;

const switchState = (data) => {};

const registerEvents = () => {
  events.on(EventType.updatePerformanceMetrics, (data) => {
    const { WPM, accuracy, consistency } = data;
    switchState(data);
    if (getState() !== GameState.playing) {
      return;
    }
    if (WPM > settings.targetWPM - settings.WPMThreshold) {
      state = AIMode.aggressive;
    } else if (WPM < settings.targetWPM - 5) {
      state = AIMode.helping;
    }
  });
};

export { registerEvents };
