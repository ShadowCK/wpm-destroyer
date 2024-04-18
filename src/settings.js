const settings = {
  wordsPerLine: 10,
  targetWPM: 40,
  charsPerWord: 5, // Used for calculating WPM, not for actual word length - "Standard word"
  // We currently don't want the tracker to lose data, because the metric will be unrepresentative and inaccurate
  // For AI to get more fine-tuned behavior, instead, we should add another WPM tracker within a short time
  WPMTrackerDuration: Infinity, // tracks correct inputs
  practiceMode: false,
  WPMThreshold: 5,
  // We currently don't want the tracker to lose data, because the metric will be unrepresentative and inaccurate
  // For AI to get more fine-tuned behavior, instead, we should add another WPM tracker within a short time
  consistencyTrackerDuration: Infinity,
  consistencyTrackerTimeHolder: 2000,
  consistencyTrackerCharHolder: 10,
  highConsistencyThreshold: 20, // 20% CV considered high consistency
  accuracyThreshold: 85, // 85% accuracy is considered acceptable
  withinThresholdPercentage: 75, // 75% of WPM records within target range considered stable
  minAIActionDelay: 2000,
  maxAIActionDelay: 6000,
};

export default settings;
