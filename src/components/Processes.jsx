import styles from "../assets/css/processes.module.css";
export default function Processes({ processes, handleClearTable }) {
  const isScrollable = processes.length > 10;
  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableBtnContainer}>
        <button
          className={styles.clearProcessTableBtn}
          onClick={handleClearTable}
        >
          Clear Table
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Process</th>
            <th>Arrival Time</th>
            <th>Burst Time</th>
          </tr>
        </thead>
        <tbody className={isScrollable ? styles.scrollableTbody : ""}>
          {processes.map((process) => (
            <tr key={process.process}>
              <td>P{process.process}</td>
              <td>{process.arrivalTime}</td>
              <td>{process.burstTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
