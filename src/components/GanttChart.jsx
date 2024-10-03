import { useState } from "react";
import styles from "../assets/css/ganttChart.module.css";

export default function GanttChart({
  processes,
  ganttChartData,
  setGanttChartData,
}) {
  function generateGanttChart() {
    let currentTime = 0;
    let queue = [];
    let chartData = [];

    const sortedByArrival = [...processes].sort(
      (a, b) => a.arrivalTime - b.arrivalTime
    );

    // Check if the first process arrives after time 0 (Initial Idle Time)
    if (sortedByArrival.length > 0 && sortedByArrival[0].arrivalTime > 0) {
      chartData.push({
        label: "X",
        start: currentTime,
        end: sortedByArrival[0].arrivalTime,
      });
      currentTime = sortedByArrival[0].arrivalTime;
    }

    while (sortedByArrival.length > 0 || queue.length > 0) {
      // Add arriving processes to the queue
      while (
        sortedByArrival.length > 0 &&
        sortedByArrival[0].arrivalTime <= currentTime
      ) {
        queue.push(sortedByArrival.shift());
      }

      if (queue.length > 0) {
        // Sort the queue by burst time (for Shortest Job Next)
        queue.sort((a, b) => a.burstTime - b.burstTime);
        const nextProcess = queue.shift();

        // Handle Idle Time between processes if needed
        if (currentTime < nextProcess.arrivalTime) {
          chartData.push({
            label: "X",
            start: currentTime,
            end: nextProcess.arrivalTime,
          });
          currentTime = nextProcess.arrivalTime;
        }

        // Add the next process to the Gantt chart
        chartData.push({
          label: `P${nextProcess.process}`,
          start: currentTime,
          end: currentTime + nextProcess.burstTime,
        });
        currentTime += nextProcess.burstTime;
      } else {
        // If no process is ready, increment the time (i.e., idle state)
        const nextArrival = sortedByArrival[0].arrivalTime;
        chartData.push({
          label: "X",
          start: currentTime,
          end: nextArrival,
        });
        currentTime = nextArrival;
      }
    }

    setGanttChartData(chartData);
  }

  const GanttChartSVG = ({ data }) => {
    const cellWidth = 50;
    const cellHeight = 40;
    const totalTime = data[data.length - 1].end;
    const margin = { left: 25, right: 25 };
    const svgWidth = (totalTime + 1) * cellWidth + margin.left + margin.right;


    return (
      <div className={styles.svgContainer}>
        <svg width={svgWidth} height={cellHeight * 2}>
          <g transform={`translate(${margin.left}, 0)`}>
            {/* Process/Idle row */}
            {data.map((item, index) => (
              <g key={index}>
                <rect
                  x={item.start * cellWidth}
                  y={0}
                  width={(item.end - item.start) * cellWidth}
                  height={cellHeight}
                  className={item.label === 'X' ? styles.idleCell : styles.processCell}
                />
                <text
                  x={item.start * cellWidth + ((item.end - item.start) * cellWidth / 2)}
                  y={cellHeight / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={styles.cellText}
                >
                  {item.label}
                </text>
              </g>
            ))}

            {/* Timeline row */}
            {Array.from({ length: totalTime + 1 }).map((_, index) => (
              <g key={index}>
                <line
                  x1={index * cellWidth}
                  y1={cellHeight}
                  x2={index * cellWidth}
                  y2={cellHeight * 2}
                  className={styles.timelineLine}
                />
                <text
                  x={index * cellWidth}
                  y={cellHeight * 1.5}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={styles.timelineText}
                >
                  {index}
                </text>
              </g>
            ))}
          </g>
        </svg>
      </div>
    );
  };

  return (
    <div className={styles.mainContainer}>
      <button onClick={generateGanttChart} className={styles.generateBtn}>
        Generate Gantt Chart
      </button>
      <div className={styles.titleContainer}>
        <h2>Gantt Chart</h2>
        <div className={styles.buttonContainer}>
          <button className={styles.simulateBtn}>Simulate</button>
        </div>
      </div>

      {ganttChartData.length > 0 && (
        <div className={styles.ganttChartContainer}>
          <GanttChartSVG data={ganttChartData} />
        </div>
      )}
    </div>
  );
}