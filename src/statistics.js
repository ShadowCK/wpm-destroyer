import Chart from 'chart.js/auto';
import { EventType, GameState } from './enums.js';
import events from './events.js';
import { getState } from './gameStateMachine.js';

const snapshots = [];

const collectData = (data) => {
  const time = new Date().toISOString().slice(11, 19); // Simplified time string, HH:MM:SS
  const { WPM, accuracy, consistency, withinThresholdPercentage } = data;
  snapshots.push({ time, WPM, accuracy, consistency, withinThresholdPercentage });
};

const registerEvents = () => {
  events.on(EventType.startGame, () => {
    snapshots.length = 0; // Reset data at the start of the game
  });

  events.on(EventType.updatePerformanceMetrics, (data) => {
    if (getState() === GameState.playing) {
      collectData(data);
    }
  });

  events.on(EventType.finishGame, () => {
    if (snapshots.length > 0) {
      // Show the modal first
      $('#metricsModal')
        .modal({
          onVisible: () => {
            // When the modal is fully visible
            const ctx = document.getElementById('metricsChart').getContext('2d');
            const chart = new Chart(ctx, {
              type: 'line',
              data: {
                labels: snapshots.map((s) => s.time), // Time as labels
                datasets: [
                  {
                    label: 'WPM',
                    data: snapshots.map((s) => s.WPM),
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                  },
                  {
                    label: 'Accuracy',
                    data: snapshots.map((s) => s.accuracy),
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                  },
                  {
                    label: 'Consistency',
                    data: snapshots.map((s) => s.consistency),
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                  },
                  {
                    label: 'Within Threshold %',
                    data: snapshots.map((s) => s.withinThresholdPercentage),
                    borderColor: 'rgb(153, 102, 255)',
                    backgroundColor: 'rgba(153, 102, 255, 0.5)',
                  },
                ],
              },
              options: {
                y: {
                  beginAtZero: true,
                  min: 0,
                  max: 200,
                },
                responsive: true, // Ensure the chart is responsive
                maintainAspectRatio: false, // Maintain aspect ratio of your choice
              },
            });
          },
        })
        .modal('show');
    }
  });
};

export default registerEvents;
