import { useState } from "react";
import { Chart } from "react-google-charts";
import styles from "../assets/css/ganttChart.module.css";
import SimulateButton from "./SimulateButton";
export default function GanttChart({ processes, ganttChartData, setGanttChartData }) {

  function generateGanttChart() {
    let currentTime = 0;
    let queue = [];
    let chartData = [];
  
    const sortedByArrival = [...processes].sort(
      (a, b) => a.arrivalTime - b.arrivalTime
    );
  
    // Check if the first process arrives after time 0 (Initial Idle Time)
    if (sortedByArrival.length > 0 && sortedByArrival[0].arrivalTime > 0) {
      chartData.push([
        "Process",
        "Idle",
        getDate(currentTime),
        getDate(sortedByArrival[0].arrivalTime),
      ]);
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
          chartData.push([
            "Process",
            "Idle",
            getDate(currentTime),
            getDate(nextProcess.arrivalTime),
          ]);
          currentTime = nextProcess.arrivalTime;
        }
  
        // Add the next process to the Gantt chart
        chartData.push([
          "Process",
          `P${nextProcess.process}`,
          getDate(currentTime),
          getDate(currentTime + nextProcess.burstTime),
        ]);
        currentTime += nextProcess.burstTime;
      } else {
        // If no process is ready, increment the time (i.e., idle state)
        const nextArrival = sortedByArrival[0].arrivalTime;
        chartData.push([
          "Process",
          "Idle",
          getDate(currentTime),
          getDate(nextArrival),
        ]);
        currentTime = nextArrival;
      }
    }
  
    console.log("Generated Gantt Chart Data:", chartData); // Debugging line
    setGanttChartData(chartData);
  }
  
  // Helper function to generate Date object from seconds (as needed by Google Charts)
  function getDate(seconds) {
    const baseDate = new Date(0); // Epoch time
    return new Date(baseDate.setSeconds(baseDate.getSeconds() + seconds));
  }

  // Chart options
  const options = {
    timeline: {
      showRowLabels: false,
      avoidOverlappingGridLines: false,
    },
  };

  // Data for Google Charts
  const chartData = [
    [
      { type: "string", id: "Gantt Chart" },
      { type: "string", id: "Process" },
      { type: "date", id: "Start" },
      { type: "date", id: "End" },
    ],
    ...ganttChartData,
  ];

  return (
    <div className={styles.mainContainer}>
      <button onClick={generateGanttChart} className={styles.generateBtn}>Generate Gantt Chart</button>
      <div className={styles.titleContainer}>
      <h2>Gantt Chart</h2>
      <SimulateButton/>
      </div>

      {ganttChartData.length > 0 && (
       <div  className={styles.ganttChartContainer}>
         <Chart
          chartType="Timeline"
          data={chartData}
          options={options}
          className={styles.ganttChart}
        
        />
       </div>
      )}
    </div>
  );
}
