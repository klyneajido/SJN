// GanttChart.js
import React, { useState } from "react";
import styles from "../assets/css/ganttChart.module.css";
import GanttChartControls from "./GanttChartControls";
import GanttChartSVG from "./GanttChartSVG";
import StepByStepGuide from "./StepByStepGuide";
import Computations from "./Computations";

const GanttChart = ({ processes, ganttChartData, setGanttChartData, showSteps, setShowSteps, steps, setSteps }) => {

  function generateGanttChart() {
    let currentTime = 0;
    let queue = [];
    let chartData = [];
    let stepInstructions = [];
    let remainingProcesses = [...processes].sort(
      (a, b) => a.arrivalTime - b.arrivalTime
    );

    // Initial step
    stepInstructions.push({
      time: currentTime,
      action: "Initial state",
      queue: [],
      remainingProcesses: remainingProcesses.map(p => `P${p.process}`),
      chartState: [],
      ganttSequence: []
    });

    if (remainingProcesses.length > 0 && remainingProcesses[0].arrivalTime > 0) {
      chartData.push({
        label: "X",
        start: currentTime,
        end: remainingProcesses[0].arrivalTime,
      });
      stepInstructions.push({
        time: currentTime,
        action: `CPU is idle until time ${remainingProcesses[0].arrivalTime}`,
        queue: [],
        remainingProcesses: remainingProcesses.map(p => `P${p.process}`),
        chartState: [...chartData],
        ganttSequence: ["X"] // Add idle time to sequence
      });
      currentTime = remainingProcesses[0].arrivalTime;
    }

    while (remainingProcesses.length > 0 || queue.length > 0) {
      // Add newly arrived processes to queue
      while (
        remainingProcesses.length > 0 &&
        remainingProcesses[0].arrivalTime <= currentTime
      ) {
        const arrivedProcess = remainingProcesses.shift();
        queue.push(arrivedProcess);
        stepInstructions.push({
          time: currentTime,
          action: `P${arrivedProcess.process} arrives and joins the queue`,
          queue: queue.map(p => `P${p.process}`),
          remainingProcesses: remainingProcesses.map(p => `P${p.process}`),
          chartState: [...chartData],
          ganttSequence: chartData.map(item => item.label)
        });
      }

      if (queue.length > 0) {
        // Sort queue by burst time (SJF)
        queue.sort((a, b) => a.burstTime - b.burstTime);
        const nextProcess = queue.shift();

        if (currentTime < nextProcess.arrivalTime) {
          chartData.push({
            label: "X",
            start: currentTime,
            end: nextProcess.arrivalTime,
          });
          stepInstructions.push({
            time: currentTime,
            action: `CPU is idle until time ${nextProcess.arrivalTime}`,
            queue: queue.map(p => `P${p.process}`),
            remainingProcesses: remainingProcesses.map(p => `P${p.process}`),
            chartState: [...chartData],
            ganttSequence: chartData.map(item => item.label)
          });
          currentTime = nextProcess.arrivalTime;
        }

        chartData.push({
          label: `P${nextProcess.process}`,
          start: currentTime,
          end: currentTime + nextProcess.burstTime,
        });
        
        stepInstructions.push({
          time: currentTime,
          action: `Execute P${nextProcess.process} for ${nextProcess.burstTime} time units`,
          queue: queue.map(p => `P${p.process}`),
          remainingProcesses: remainingProcesses.map(p => `P${p.process}`),
          chartState: [...chartData],
          ganttSequence: [...chartData.map(item => item.label)]
        });
        
        currentTime += nextProcess.burstTime;
      } else {
        const nextArrival = remainingProcesses[0]?.arrivalTime;
        if (nextArrival !== undefined) {
          chartData.push({
            label: "X",
            start: currentTime,
            end: nextArrival,
          });
          stepInstructions.push({
            time: currentTime,
            action: `CPU is idle until next arrival at time ${nextArrival}`,
            queue: [],
            remainingProcesses: remainingProcesses.map(p => `P${p.process}`),
            chartState: [...chartData],
            ganttSequence: chartData.map(item => item.label)
          });
          currentTime = nextArrival;
        } else {
          break;
        }
      }
    }
    stepInstructions.push({
      time: currentTime,
      action: "All processes completed",
      queue: [],
      remainingProcesses: [],
      chartState: [...chartData],
      ganttSequence: chartData.map(item => item.label)
    });

    setSteps(stepInstructions);
    setGanttChartData(chartData);
  }
  

  return (
    <div className={styles.mainContainer}>
      <GanttChartControls 
        onGenerate={generateGanttChart} 
      />
      <div className={styles.titleContainer}>
        <h2>Gantt Chart</h2>
        <button 
        onClick={() => setShowSteps(!showSteps)} 
        className={styles.stepsBtn}
        disabled={steps.length === 0}
      >
        {showSteps ? "Hide Steps" : "Show Steps"}
      </button>
      </div>
      <br />
      {ganttChartData.length > 0 && <GanttChartSVG data={ganttChartData} />}
      {showSteps && <StepByStepGuide steps={steps} />}
      <Computations processes={processes} ganttChartData={ganttChartData} />
      <br />
    </div>
  );
};

export default GanttChart;
