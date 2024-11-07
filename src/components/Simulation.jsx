import React, { useEffect, useState } from "react";
import styles from "../assets/css/ganttChart.module.css";

export default function Simulation({
  processes,
  ganttChartData,
  isSimulating,
  setIsSimulating,
  queue,
  setQueue,
  completedProcesses,
  setCompletedProcesses,
}) {
  const [currentTime, setCurrentTime] = useState(0);

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
      (item) => item.end === currentTime && item.label !== "X"
    );
    setCompletedProcesses((prev) => [...prev, ...newCompletedProcesses]);
    setQueue((prevQueue) =>
      prevQueue.filter(
        (p) => !newCompletedProcesses.some((cp) => cp.label === `P${p.process}`)
      )
    );
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

  return (
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
  );
}
