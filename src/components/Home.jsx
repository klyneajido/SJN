import { useState } from "react";
import Processes from "./Processes";
import GanttChart from "./GanttChart";
import CustomAlert from "./CustomAlert";
import styles from "../assets/css/home.module.css";
export default function Home() {
  const [processes, setProcesses] = useState([]);
  // sample arrivl time: "2 8 14 20 26"
  const [arrivalTime, setArrivalTime] = useState("");
  // sample burst time: "5 2 6 3 4"
  const [burstTime, setBurstTime] = useState(""); 
  const [ganttChartData, setGanttChartData] = useState([]);
  const [showSteps, setShowSteps] = useState(false);
  const [steps, setSteps] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [processToDelete, setProcessToDelete] = useState(null);
  const [processToEdit, setProcessToEdit] = useState(null);
  const [editValues, setEditValues] = useState({
    arrivalTime: "",
    burstTime: "",
  });

  function validateProcessValues(arrivalTime, burstTime) {
    // Check if the values are valid numbers
    if (isNaN(arrivalTime) || isNaN(burstTime)) {
      showAlert("Please enter valid numbers for Arrival and Burst Times.");
      return false;
    }
  
    // Check if values are non-negative
    if (arrivalTime < 0 || burstTime < 0) {
      showAlert("Arrival Time and Burst Time must be non-negative numbers.");
      return false;
    }
  
    // Check if burst time is not zero
    if (burstTime === 0) {
      showAlert("Burst Time must be greater than zero.");
      return false;
    }
  
    return true;
  }
  
  function showAlert(message) {
    setAlertOpen(true);
    setAlertMessage(message);
  }

  function handleAddProcess(event) {
    event.preventDefault();
  
    // Split the arrival and burst times, then filter out any empty strings
    const arrivalTimes = arrivalTime.split(" ").filter(Boolean).map(Number);
    const burstTimes = burstTime.split(" ").filter(Boolean).map(Number);
  
    if (arrivalTimes.length !== burstTimes.length) {
      showAlert("Arrival Times and Burst Times should have the same number of values");
      return;
    }
  
    // Validate each arrival time and burst time
    for (let i = 0; i < arrivalTimes.length; i++) {
      if (!validateProcessValues(arrivalTimes[i], burstTimes[i])) {
        return;
      }
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
    setSteps([])
    setShowSteps(false)
    setAlertOpen(false);
  };

  const handleClearTableCloseAlert = () => {
    setAlertOpen(false);
  };

  const handleDeleteProcess = (process) => {
    setProcessToDelete(process);
    setDeleteAlertOpen(true);
  };

  const handleDeleteConfirm = () => {
    const updatedProcesses = processes
      .filter((p) => p.process !== processToDelete.process)
      .map((p, index) => ({
        ...p,
        process: index + 1,
      }));

    setProcesses(updatedProcesses);
    setDeleteAlertOpen(false);
    setProcessToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteAlertOpen(false);
    setProcessToDelete(null);
  };

  const handleEditProcess = (process) => {
    setProcessToEdit(process);
    setEditValues({
      arrivalTime: process.arrivalTime.toString(),
      burstTime: process.burstTime.toString(),
    });
    setEditModalOpen(true);
  };

  const handleEditInputChange = (field, value) => {
    setEditValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditConfirm = () => {
    const newArrivalTime = Number(editValues.arrivalTime);
    const newBurstTime = Number(editValues.burstTime);

    if (!validateProcessValues(newArrivalTime, newBurstTime)) {
      return;
    }

    const updatedProcesses = processes.map((p) =>
      p.process === processToEdit.process
        ? {
            ...p,
            arrivalTime: newArrivalTime,
            burstTime: newBurstTime,
          }
        : p
    );
    setGanttChartData([]);
    setProcesses(updatedProcesses);
    handleEditCancel();
  };

  const handleEditCancel = () => {
    setEditModalOpen(false);
    setProcessToEdit(null);
    setEditValues({ arrivalTime: "", burstTime: "" });
  };

  const clearTableButtons = [
    { text: "Yes", onPress: handleClearTableConfirmClear },
    { text: "No", onPress: handleClearTableCloseAlert },
  ];

  const deleteProcessButtons = [
    { text: "Yes", onPress: handleDeleteConfirm },
    { text: "No", onPress: handleDeleteCancel },
  ];

  return (
    <div className={styles.mainContainer}>
      <h2 className={styles.title}>Shortest Job Next!</h2>
      <div className={styles.contentContainer}>
        <div className={styles.leftContainer}>
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

          <Processes
            processes={processes}
            handleClearTable={handleClearTable}
            handleDeleteProcess={handleDeleteProcess}
            handleEditProcess={handleEditProcess}
          />
        </div>

        <div className={styles.rightContainer}>
          <GanttChart
            processes={processes}
            ganttChartData={ganttChartData}
            setGanttChartData={setGanttChartData}
            showSteps={showSteps}
            steps={steps}
            setShowSteps={setShowSteps}
            setSteps={setSteps}
          />
        </div>
      </div>

      
    {isAlertOpen && (
      <CustomAlert
        title="Alert"
        message={alertMessage}
        buttons={[{ text: "OK", onPress: () => setAlertOpen(false) }]}
        onClose={() => setAlertOpen(false)}
      />
    )}

      {isDeleteAlertOpen && (
        <CustomAlert
          title="Delete Process?"
          message={`Are you sure you want to delete Process ${processToDelete?.process}?`}
          buttons={deleteProcessButtons}
          onClose={handleDeleteCancel}
        />
      )}

      {isEditModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Edit Process {processToEdit?.process}</h3>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.inputGroup}>
                <label>Arrival Time:</label>
                <input
                  type="number"
                  value={editValues.arrivalTime}
                  onChange={(e) =>
                    handleEditInputChange("arrivalTime", e.target.value)
                  }
                  min="0"
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Burst Time:</label>
                <input
                  type="number"
                  value={editValues.burstTime}
                  onChange={(e) =>
                    handleEditInputChange("burstTime", e.target.value)
                  }
                  min="1"
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.updateBtn} onClick={handleEditConfirm}>
                Update
              </button>
              <button className={styles.cancelBtn} onClick={handleEditCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
