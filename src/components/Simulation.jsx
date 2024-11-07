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
  const [userScrolled, setUserScrolled] = useState(false); // Track if the user has scrolled manually
  const [scrollTimeout, setScrollTimeout] = useState(null); // To store timeout ID for resuming simulation

  const handleScroll = () => {
    // Pause the simulation when user scrolls
    if (isSimulating) {
      setIsSimulating(false);
      setUserScrolled(true);

      // If there's already a timeout, clear it
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      // Set a timeout to resume simulation after a delay (e.g., 2 seconds)
      const timeoutId = setTimeout(() => {
        setIsSimulating(true);
        setUserScrolled(false);
      }, 2000); // Resume simulation after 2 seconds of no scrolling

      setScrollTimeout(timeoutId);
    }
  };
  useEffect(() => {
    if (isSimulating) {
      let timer;
      timer = setInterval(() => {
        setCurrentTime((prevTime) => {
          const nextTime = prevTime + 1;
          
          // Stop simulation when the current time exceeds the last gantt chart entry
          if (nextTime > ganttChartData[ganttChartData.length - 1].end) {
            clearInterval(timer); // Clear the interval to stop the simulation
            setIsSimulating(false); // Stop simulation
            setSimulationEnded(true); // Mark the simulation as ended
            return prevTime; // Return the previous time to prevent unnecessary increment
          }
  
          return nextTime; // Proceed to next time if the simulation is still running
        });
      }, 1000); // Increment time every second
  
      return () => clearInterval(timer); // Cleanup the interval when the component is unmounted or isSimulating changes
    }
  }, [isSimulating, ganttChartData, setCurrentTime, setIsSimulating]);
  
  

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
      // Check if process has started executing (appears in Gantt chart at currentTime)
      const isProcessInGantt = ganttChartData.some(
        (item) => item.start <= currentTime && item.label === `P${p.process}`
      );
      
      return {
        ...p,
        inProgress: p.inProgress || isProcessInGantt, // Only mark in progress if it starts executing
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
                className={process.inProgress ? styles.inProgressProcess : ""}
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
      <div className={styles.chartContainer} onScroll={handleScroll}>
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
