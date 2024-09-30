import styles from '../assets/css/processes.module.css'
export default function Processes({ processes }) {
  function calculateSJN() {
    const sortedProcesses = [...processes].sort(
      (a, b) => a.burstTime - b.burstTime
    );
    console.log("Sorted Processes:", sortedProcesses);
    return sortedProcesses;
  }

  return (
    <div className={styles.processContainer}>
      <h2>Processes: </h2>
      <div className={styles.tableContainer}>
        {processes.map((process, index) => (
          <div key={index} className={styles.process}>
            <p>Arrival Time: {process.arrivalTime}</p>
            <p>Process {process.process}</p>
            <p>Burst Time: {process.burstTime}</p>
          </div>
        ))}
      </div>
      <button className="calculateBtn" onClick={calculateSJN}>
        Calculate
      </button>
    </div>
  );
}
