import React, { useEffect, useState } from "react";
import styles from "../assets/css/simulation.module.css";
  

const Simulation = ({
  processes,
  ganttChartData,
  isSimulating,
  setIsSimulating,
  queue,
  setQueue,
  currentTime,
  setCurrentTime,
}) => {
  const [showQueueTable, setShowQueueTable] = useState(true);
  const [simulationEnded, setSimulationEnded] = useState(false); // State to track if simulation has ended

  useEffect(() => {
    let timer;
    if (isSimulating) {
      timer = setInterval(() => {
        setCurrentTime((prevTime) => {
          const nextTime = prevTime + 1;
          // Stop simulation when the current time exceeds the last gantt chart entry
          if (nextTime > ganttChartData[ganttChartData.length - 1].end) {
            clearInterval(timer);
            setIsSimulating(false);
            setSimulationEnded(true); // Mark the simulation as ended
            return prevTime; // Return the previous time to prevent unnecessary state update
          }
          return nextTime;
        });
      }, 1000);

      return () => clearInterval(timer); // Cleanup the interval when the component is unmounted or isSimulating changes
    }
  }, [isSimulating, ganttChartData, setCurrentTime]);

  useEffect(() => {
    if (isSimulating) {
      updateQueue();
    }
  }, [currentTime, isSimulating, ganttChartData, queue, setQueue]); // Now `currentTime` and `ganttChartData` are part of the dependency array

  const updateQueue = () => {
    const arrivingProcesses = processes.filter(
      (p) => p.arrivalTime === currentTime
    );

    // Only add arriving processes if they are new to the queue
    const newQueue = [...queue, ...arrivingProcesses.filter(p => !queue.some(q => q.process === p.process))];

    const updatedQueue = newQueue.map((p) => {
      const isProcessCompleted = ganttChartData.some(
        (item) => item.end === currentTime && item.label === `P${p.process}`
      );
      return {
        ...p,
        completed: p.completed || isProcessCompleted, // Keep process completed if it's marked done
      };
    });

    setQueue(updatedQueue);
  };

  const QueueTable = () => (
    <div className={`${styles.queueTableContainer} ${showQueueTable ? '' : styles.hidden}`}>
      <div className={styles.queueTableHeader}>
        <h3>Queue</h3>
      </div>
      <table className={styles.queueTable}>
        <tbody>
          <tr>
            {queue.map((process, index) => (
              <td
                key={index}
                className={process.completed ? styles.completedProcess : ""}
              >
                P{process.process}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <div className={styles.simulationContainer}>
      <div className={styles.header}>
        <h2>Gantt Chart Simulation</h2>
        <div className={styles.timeDisplay}>Current Time: {currentTime}</div>
      </div>
      <div className={styles.chartContainer}>
        <QueueTable />
      </div>
      {simulationEnded && (
        <div className={styles.simulationEndedMessage}>
          Simulation has ended.
        </div>
      )}
    </div>
  );
};

export default Simulation;
