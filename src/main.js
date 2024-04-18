import { registerEvents as registerGameEvents } from './gameStateMachine.js';
import registerHTMLEvents from './htmlHandler.js';

$(document).ready(() => {
  registerGameEvents();
  registerHTMLEvents();
});
