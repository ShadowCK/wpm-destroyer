import { EventType } from './enums.js';
import events from './events.js';
import { updateLines, clearLines } from './htmlHelper.js';

const registerEvents = () => {
  events.on(EventType.startGame, (eventData) => {
    if (eventData.isCancelled) {
      return;
    }
    $('#start-button').hide();
    $('#exit-button').show();
    updateLines();
  });

  events.on(EventType.finishGame, (eventData) => {
    if (eventData.isCancelled) {
      return;
    }
    $('#exit-button').hide();
    $('#start-button').show();
    clearLines();
  });

  events.on(EventType.typeChar, () => {
    updateLines();
  });

  $('#start-button').click(() => events.emit(EventType.startGame, { isCancelled: false }));
  $('#exit-button').click(() => events.emit(EventType.finishGame, { isCancelled: false }));
  $(window).on('keydown', (event) => {
    events.emit(EventType.userInput, event);
  });
};

export default registerEvents;
