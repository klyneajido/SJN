import styles from '../assets/css/processes.module.css'
export default function Processes({ processes }) {
  return (
    <div className={styles.tableContainer}>
              <table>
        <thead>
          <tr>
            <th>Process</th>
            <th>Arrival Time</th>
            <th>Burst Time</th>
          </tr>
        </thead>
        <tbody>
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
