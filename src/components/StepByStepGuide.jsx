import React from 'react';
import styles from "../assets/css/ganttChart.module.css";
import AnimeVoiceReader from './AnimeVoice';

const StepByStepGuide = ({ steps }) => {
  return (
    <div className={styles.stepsContainer}>
<div className={styles.titleContainer}>
<h3>Step-by-Step Solution</h3>
<AnimeVoiceReader steps={steps} />
</div>
      {steps.map((step, index) => (
        <div key={index} className={styles.stepItem}>
          <h4>Step {index + 1} (Time: {step.time})</h4>
          <p><strong>Action:</strong> {step.action}</p>
          <p><strong>Ready Queue:</strong> [{step.queue.join(', ')}]</p>
          {step.remainingProcesses.length > 0 && (
            <p><strong>Waiting to Arrive:</strong> [{step.remainingProcesses.join(', ')}]</p>
          )}
          <p><strong>Gantt Chart Sequence:</strong> [{step.ganttSequence.join(', ')}]</p>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default StepByStepGuide;
