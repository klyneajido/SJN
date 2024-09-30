import { useState } from "react";
import Processes from "./Processes";
import GanttChart from "./GanttChart";
import CustomAlert from "./CustomAlert";
import styles from "../assets/css/home.module.css";
export default function Home() {
  const [processes, setProcesses] = useState([]);
  const [arrivalTime, setArrivalTime] = useState("");
  const [burstTime, setBurstTime] = useState("");
  const [ganttChartData, setGanttChartData] = useState([]);
  const [isAlertOpen, setAlertOpen] = useState(false);
  

  function handleAddProcess() {
    event.preventDefault();
    const arrivalTimes = arrivalTime.split(" ").map(Number);
    const burstTimes = burstTime.split(" ").map(Number);

    if (arrivalTimes.length !== burstTimes.length) {
      alert(
        "Arrival Times and Burst Times should have the same number of values"
      );
      return;
    }
    if (arrivalTimes.some(isNaN) || burstTimes.some(isNaN)) {
      alert("Please enter valid numbers for Arrival and Burst Times.");
      return;
    }
    const newProcesses = arrivalTimes.map((arrivalTime, index) => ({
      process: processes.length + index + 1,
      arrivalTime: Number(arrivalTime),
      burstTime: Number(burstTimes[index]),
    }));

    setProcesses([...processes, ...newProcesses]);
    setArrivalTime("");
    setBurstTime("");
  }
  function handleArrivalTimeChange(e) {
    setArrivalTime(e.target.value);
  }

  function handleBurstTimeChange(e) {
    setBurstTime(e.target.value);
  }

  function handleClearTable() {
    setAlertOpen(true);
  }

  const handleClearTableConfirmClear = () => {
    setProcesses([]); 
    setGanttChartData([]);
  };

  const handleClearTableCloseAlert = () => {
    setAlertOpen(false); 
  };

  const alertButtons = [
    { text: "Yes", onPress: handleClearTableConfirmClear },
    { text: "No", onPress: handleClearTableCloseAlert },
  ];
  return (
    <div className={styles.mainContainer}>
      <h2 className={styles.title}>Shortest Job Next!</h2>

      <form>
        <div className={styles.inputContainer}>
          <p>
            <label>Arrival Time: </label>{" "}
            <input
              className="at"
              type="text"
              placeholder="e.g. 1 2 3 ..."
              value={arrivalTime}
              onChange={(e) => handleArrivalTimeChange(e)}
            />
          </p>

          <p>
            <label>Burst Time: </label>
            <input
              className="bt"
              type="text"
              placeholder="e.g. 1 2 3 ..."
              value={burstTime}
              onChange={(e) => handleBurstTimeChange(e)}
            />
          </p>
        </div>
        <button className={styles.addProcessBtn} onClick={handleAddProcess}>
          Add Processes
        </button>
      </form>
      <Processes processes={processes} handleClearTable={handleClearTable}/>
      <GanttChart processes={processes} ganttChartData={ganttChartData} setGanttChartData={setGanttChartData}/>

      {isAlertOpen && (
        <CustomAlert
          title="Clear Table?"
          message="Clearing the Process Table will also clear the Gantt Chart."
          buttons={alertButtons}
          onClose={handleClearTableCloseAlert}
        />
      )}
    </div>
  );
}
