// GanttChartControls.js
import React from 'react';
import styles from "../assets/css/ganttChart.module.css";

const GanttChartControls = ({ onGenerate}) => {
    return (
      <div className={styles.buttonContainer}>
        <button
          onClick={() => {
            onGenerate();
          }}
          className={styles.generateBtn}
        >
          Generate Gantt Chart
        </button>
      </div>
    );
  };
  

export default GanttChartControls;
