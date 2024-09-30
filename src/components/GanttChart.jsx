import { useState } from "react";

export default function GanttChart({ processes }) {
  const [ganttChart, setGanttChart] = useState([]);

  function generateGanttChart() {
    let currentTime = 0;
    let queue = [];
    let chart = [];

    // Sort by arrival time first
    const sortedByArrival = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);

    while (sortedByArrival.length > 0 || queue.length > 0) {
      // Add processes to queue based on current time
      while (sortedByArrival.length > 0 && sortedByArrival[0].arrivalTime <= currentTime) {
        queue.push(sortedByArrival.shift());
      }

      // Sort queue by burst time for Shortest Job Next
      if (queue.length > 0) {
        queue.sort((a, b) => a.burstTime - b.burstTime);
        const nextProcess = queue.shift(); // Get the process with the shortest burst time
        chart.push(nextProcess);
        currentTime += nextProcess.burstTime; // Increase current time by the process's burst time
      } else {
        currentTime++; // If no process is in queue, increase time by 1
      }
    }

    setGanttChart(chart);
  }

  return (
    <div className="ganttChartContainer">
      <h2>Gantt Chart</h2>
      <button onClick={generateGanttChart}>Generate Gantt Chart</button>
      <div className="gantt-chart">
        {ganttChart.map((p, index) => (
          <div key={index} className="gantt-bar">
            Process {p.process} (Burst: {p.burstTime})
          </div>
        ))}
      </div>
    </div>
  );
}
