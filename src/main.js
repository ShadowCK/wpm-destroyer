import { registerEvents as registerGameEvents } from './gameStateMachine.js';
import registerHTMLEvents from './htmlHandler.js';
import { registerEvents as registerAIEvents } from './adversarial.js';
import registerStatsticEvents from './statistics.js';

$(document).ready(() => {
  registerGameEvents();
  registerAIEvents();
  registerHTMLEvents();
  registerStatsticEvents();
});
