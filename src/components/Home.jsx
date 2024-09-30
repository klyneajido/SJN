import { useState } from "react";
import Processes from "./Processes";
import GanttChart from "./GanttChart";
import styles from "../assets/css/home.module.css";
export default function Home() {
  const [processes, setProcesses] = useState([]); // Initialize as an empty array
  const [arrivalTime, setArrivalTime] = useState(0);
  const [burstTime, setBurstTime] = useState(0);

  function handleAddProcess() {
    const newProcess = {
      process: processes.length + 1, 
      arrivalTime: Number(arrivalTime),
      burstTime: Number(burstTime)
    };

    const newProcesses = [...processes, newProcess];
    setProcesses(newProcesses);
    setArrivalTime(0);
    setBurstTime(0);
    console.log(newProcesses);
  }

  return (
    <div className={styles.mainContainer}>
      <h2>Shortest Job Next!</h2>
      <div className={styles.inputContainer}>
        <div className={styles.arrivalTime}>
          <label>
            Arrival Time:{" "}
            <input
              className="at"
              type="number"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(Number(e.target.value))}
            />
          </label>
        </div>
        <div className={styles.burstTime}>
          <label>
            Burst Time:{" "}
            <input
              className="bt"
              type="number"
              value={burstTime}
              onChange={(e) => setBurstTime(Number(e.target.value))}
            />
          </label>
        </div>
      </div>
      <button className={styles.addProcessBtn} onClick={handleAddProcess}>
        Add Process
      </button>
      <Processes processes={processes} />
      <GanttChart processes={processes} />
    </div>
  );
}
