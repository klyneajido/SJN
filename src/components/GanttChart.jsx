import React, { useState, useEffect } from "react";
import styles from "../assets/css/ganttChart.module.css";

export default function GanttChart({
  processes,
  ganttChartData,
  setGanttChartData,
}) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [queue, setQueue] = useState([]);
  const [completedProcesses, setCompletedProcesses] = useState([]);

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

  useEffect(() => {
    if (isSimulating) {
      const timer = setInterval(() => {
        setCurrentTime((prevTime) => {
          const nextTime = prevTime + 1;
          if (nextTime > ganttChartData[ganttChartData.length - 1].end) {
            clearInterval(timer);
            setIsSimulating(false);
          }
          return nextTime;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isSimulating, ganttChartData]);

  useEffect(() => {
    if (isSimulating) {
      updateQueue();
      updateCompletedProcesses();
    }
  }, [currentTime, isSimulating]);

  const updateQueue = () => {
    const arrivingProcesses = processes.filter(
      (p) => p.arrivalTime === currentTime
    );
    setQueue((prevQueue) => [...prevQueue, ...arrivingProcesses]);
  };

  const updateCompletedProcesses = () => {
    const newCompletedProcesses = ganttChartData.filter(
      (item) => item.end === currentTime && item.label !== 'X'
    );
    setCompletedProcesses((prev) => [...prev, ...newCompletedProcesses]);
    setQueue((prevQueue) =>
      prevQueue.filter(
        (p) => !newCompletedProcesses.some((cp) => cp.label === `P${p.process}`)
      )
    );
  };

  const handleSimulate = () => {
    setIsSimulating(true);
    setCurrentTime(0);
    setQueue([]);
    setCompletedProcesses([]);
  };

  const QueueChart = () => (
    <div className={styles.queueChart}>
      <h3>Queue</h3>
      <ul>
        {queue.map((process, index) => (
          <li key={index} className={styles.queueItem}>
            P{process.process}
          </li>
        ))}
      </ul>
    </div>
  );

  const GanttChartSVG = ({ data }) => {
    const cellWidth = 50;
    const cellHeight = 40;
    const totalTime = data[data.length - 1].end;
    const margin = { left: 25, right: 25 };
    const svgWidth = (totalTime + 1) * cellWidth;
    const borderRadius = 10;

    return (
      <div className={styles.svgContainer}>
        <svg width={svgWidth} height={cellHeight * 2}>
          <g transform={`translate(${margin.left}, 0)`}>
            {data.map((item, index) => (
              <g key={index}>
                <rect
                  x={item.start * cellWidth}
                  y={0}
                  width={(item.end - item.start) * cellWidth}
                  height={cellHeight}
                  rx={borderRadius}
                  ry={borderRadius}
                  className={
                    item.label === "X" ? styles.idleCell : styles.processCell
                  }
                  style={{
                    fillOpacity: isSimulating && currentTime >= item.start ? 1 : 0.3,
                  }}
                />
                <text
                  x={
                    item.start * cellWidth +
                    ((item.end - item.start) * cellWidth) / 2
                  }
                  y={cellHeight / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={styles.cellText}
                >
                  {item.label}
                </text>
              </g>
            ))}
            {isSimulating && (
              <line
                x1={currentTime * cellWidth}
                y1={0}
                x2={currentTime * cellWidth}
                y2={cellHeight}
                stroke="red"
                strokeWidth="2"
              />
            )}
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
          <button onClick={handleSimulate} className={styles.simulateBtn} disabled={isSimulating || ganttChartData.length === 0}>
            {isSimulating ? "Simulating..." : "Simulate"}
          </button>
        </div>
      </div>

      {ganttChartData.length > 0 && (
        <div className={styles.ganttChartContainer}>
          <GanttChartSVG data={ganttChartData} />
        </div>
      )}

      {isSimulating && (
        <div className={styles.simulationContainer}>
          <div className={styles.timeDisplay}>Current Time: {currentTime}</div>
          <QueueChart />
          <div className={styles.completedProcesses}>
            <h3>Completed Processes</h3>
            <ul>
              {completedProcesses.map((process, index) => (
                <li key={index} className={styles.completedItem}>
                  {process.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}