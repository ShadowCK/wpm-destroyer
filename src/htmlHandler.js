import { EventType } from './enums.js';
import events from './events.js';
import { updateLines, clearLines, updateWPMInfo } from './htmlHelper.js';
import settings from './settings.js';

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

  events.on(EventType.updateWPM, (WPM) => {
    updateWPMInfo(WPM);
  });

  $('#start-button').click(() => events.emit(EventType.startGame, { isCancelled: false }));
  $('#exit-button').click(() => events.emit(EventType.finishGame, { isCancelled: false }));
  $(window).on('keydown', (event) => {
    events.emit(EventType.userInput, event);
  });
  $('#slider-target-wpm').slider({
    min: 30,
    max: 60,
    start: settings.targetWPM,
    step: 1,
    smooth: true,
    onChange: (value) => {
      settings.targetWPM = value;
    },
  });
  $('#slider-words-per-line').slider({
    min: 5,
    max: 20,
    start: settings.wordsPerLine,
    step: 1,
    smooth: true,
    onChange: (value) => {
      settings.wordsPerLine = value;
    },
  });
};

export default registerEvents;
