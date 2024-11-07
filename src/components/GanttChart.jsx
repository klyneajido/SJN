import React, { useState, useEffect, useRef } from "react";
import styles from "../assets/css/ganttChart.module.css";
import Simulation from "./Simulation";
import Computations from "./Computations";

const GanttChart = ({ processes, ganttChartData, setGanttChartData }) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [queue, setQueue] = useState([]);
  const [completedProcesses, setCompletedProcesses] = useState([]);

  // Function to generate the Gantt chart based on the processes
  function generateGanttChart() {
    let currentTime = 0;
    let queue = [];
    let chartData = [];

    const sortedByArrival = [...processes].sort(
      (a, b) => a.arrivalTime - b.arrivalTime
    );

    if (sortedByArrival.length > 0 && sortedByArrival[0].arrivalTime > 0) {
      chartData.push({
        label: "X",
        start: currentTime,
        end: sortedByArrival[0].arrivalTime,
      });
      currentTime = sortedByArrival[0].arrivalTime;
    }

    while (sortedByArrival.length > 0 || queue.length > 0) {
      while (
        sortedByArrival.length > 0 &&
        sortedByArrival[0].arrivalTime <= currentTime
      ) {
        queue.push(sortedByArrival.shift());
      }

      if (queue.length > 0) {
        queue.sort((a, b) => a.burstTime - b.burstTime);
        const nextProcess = queue.shift();

        if (currentTime < nextProcess.arrivalTime) {
          chartData.push({
            label: "X",
            start: currentTime,
            end: nextProcess.arrivalTime,
          });
          currentTime = nextProcess.arrivalTime;
        }

        chartData.push({
          label: `P${nextProcess.process}`,
          start: currentTime,
          end: currentTime + nextProcess.burstTime,
        });
        currentTime += nextProcess.burstTime;
      } else {
        const nextArrival = sortedByArrival[0]?.arrivalTime;
        if (nextArrival !== undefined) {
          chartData.push({
            label: "X",
            start: currentTime,
            end: nextArrival,
          });
          currentTime = nextArrival;
        } else {
          break;
        }
      }
    }

    setGanttChartData(chartData);
  }

  useEffect(() => {
    if (isSimulating) {
      const timer = setInterval(() => {
        setCurrentTime((prevTime) => {
          const nextTime = prevTime + 1;
          
          // Check if next time exceeds the last process's end time in ganttChartData
          if (nextTime > ganttChartData[ganttChartData.length - 1].end) {
            clearInterval(timer); // Stop the simulation by clearing the interval
            setIsSimulating(false); // Mark simulation as ended
            return prevTime; // Return previous time without incrementing it further
          }
  
          return nextTime; // Increment time as usual if simulation continues
        });
      }, 800); // Adjusted timing for the simulation interval
  
      return () => clearInterval(timer); // Cleanup the interval on component unmount
    }
  }, [isSimulating, ganttChartData]);
  
  

  useEffect(() => {
    if (isSimulating) {
      updateQueue();
      updateCompletedProcesses();
    }
  }, [currentTime, isSimulating]);

  // Update queue and completed processes
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

    if (newCompletedProcesses.length > 0) {
      setCompletedProcesses((prev) => [...prev, ...newCompletedProcesses]);
    }

    setQueue((prevQueue) =>
      prevQueue.map((p) => {
        const completedProcess = newCompletedProcesses.find(
          (cp) => cp.label === `P${p.process}`
        );
        if (completedProcess) {
          return { ...p, completed: true };
        }
        return p;
      })
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
          <li
            key={index}
            className={`${styles.queueItem} ${
              process.completed ? styles.completedProcess : ""
            }`}
          >
            P{process.process}
          </li>
        ))}
      </ul>
    </div>
  );
  const GanttChartSVG = ({ data, currentTime }) => {
    const containerRef = useRef(null); // Reference to the scrollable container
    const cellWidth = 30;
    const cellHeight = 40;
    const totalTime = data[data.length - 1].end;
    const margin = { left: 25, right: 25 };
    const svgWidth = (totalTime + 1) * cellWidth;
    const borderRadius = 10;
    const [scrollPosition, setScrollPosition] = useState(0); // Track scroll position state

    const smoothScroll = () => {
      if (containerRef.current) {
        const targetScrollPos =
          currentTime * cellWidth - containerRef.current.offsetWidth / 2;
        const maxScroll = svgWidth - containerRef.current.offsetWidth;
        const finalScrollPos = Math.min(
          Math.max(targetScrollPos, 0),
          maxScroll
        );

        // Only set scroll position if it has changed, to avoid unnecessary reflows
        if (scrollPosition !== finalScrollPos) {
          setScrollPosition(finalScrollPos); // Update scroll position only when needed
        }
      }
    };

    useEffect(() => {
      if (currentTime !== 0) {
        // Request smooth scroll at the next animation frame
        requestAnimationFrame(smoothScroll);
      }
    }, [currentTime, scrollPosition]); // Update scroll position when currentTime changes

    useEffect(() => {
      // Apply the scroll position when it's updated
      if (containerRef.current && scrollPosition !== 0) {
        containerRef.current.scrollTo({
          left: scrollPosition,
          behavior: "smooth", // Ensure smooth scrolling
        });
      }
    }, [scrollPosition]); // Only apply scroll when the position is updated

    return (
      <div
        className={styles.svgContainer}
        ref={containerRef}
        style={{
          overflowX: isSimulating ? "hidden" : "auto",
          width:"900px" // Conditionally hide or show scrollbar
        }}
      >
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
                  style={{ fillOpacity: currentTime >= item.start ? 1 : 0.3 }}
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
            {currentTime !== 0 && (
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
        <div>
          {/* <button
            onClick={handleSimulate}
            className={styles.simulateBtn}
            disabled={isSimulating || ganttChartData.length === 0}
          >
            {isSimulating ? "Simulating..." : "Simulate"}
          </button> */}
        </div>
      </div>
<br></br>
      {ganttChartData.length > 0 && (
        <GanttChartSVG data={ganttChartData} currentTime={currentTime} />
      )}
<br></br>
      {isSimulating && (
        <Simulation
          currentTime={currentTime}
          queue={queue}
          completedProcesses={completedProcesses}
          setIsSimulating={setIsSimulating}
        />
      )}

      {completedProcesses.length > 0 && !isSimulating && (
        <Simulation
          currentTime={currentTime}
          queue={queue}
          completedProcesses={completedProcesses}
          setIsSimulating={setIsSimulating}
        />
      )}
      <Computations processes={processes} ganttChartData={ganttChartData} />
    </div>
  );
};

export default GanttChart;
