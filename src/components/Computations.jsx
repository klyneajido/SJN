import styles from "../assets/css/computations.module.css";

export default function Computations({ processes, ganttChartData }) {
  // Calculate CPU Utilization
  const totalBurstTime = processes.reduce(
    (acc, process) => acc + process.burstTime,
    0
  );
  const totalTime = ganttChartData[ganttChartData.length - 1]?.end || 0;
  const cpuUtilization =
    totalTime > 0 ? ((totalBurstTime / totalTime) * 100).toFixed(2) : 0;

  // Calculate Throughput (THR)
  const completedProcessesCount = ganttChartData.filter(
    (item) => item.label !== "X"
  ).length;
  const throughput =
    totalTime > 0 ? (completedProcessesCount / totalTime).toFixed(2) : 0;

  // Calculate Total Turnaround Time (TTAT) and Total Waiting Time (TWT)
  let totalTurnaroundTime = 0;
  let totalWaitingTime = 0;

  // Prepare table data for Waiting Time (WT) and Turnaround Time (TAT) computation
  const tableData = processes.map((process) => {
    const completionTime = ganttChartData.find(
      (item) => item.label === `P${process.process}`
    )?.end;
    const startTime = ganttChartData.find(
      (item) => item.label === `P${process.process}`
    )?.start;

    let turnaroundTime = 0;
    let waitingTime = 0;

    // Response Time (RT) is the start time of the process
    const responseTime = startTime || 0; // If no start time, default to 0

    if (completionTime !== undefined && startTime !== undefined) {
      // Correct formulas for TAT and WT

      waitingTime = completionTime - process.arrivalTime; // WT = FT - AT - BT
      turnaroundTime = responseTime - process.arrivalTime; // TAT = FT - AT
    }

    totalTurnaroundTime += turnaroundTime;
    totalWaitingTime += waitingTime;

    return {
      process: `P${process.process}`,
      finishTime: completionTime,
      arrivalTime: process.arrivalTime,
      responseTime,
      waitingTime,
      turnaroundTime,
    };
  });

  // Calculate Average Waiting Time (AWT) and Average Turnaround Time (ATAT)
  const atat =
    processes.length > 0
      ? (totalTurnaroundTime / processes.length).toFixed(2)
      : "NaN";
  const awt =
    processes.length > 0
      ? (totalWaitingTime / processes.length).toFixed(2)
      : "NaN";

  return (
    <div>
      <br />
      <hr />
      <h1 className={styles.title}>Computations</h1>
      <p>
        <strong>CPU Utilization: </strong> {cpuUtilization}%
      </p>
      <p>
        <strong>Throughput (THR): </strong> {throughput}
      </p>
      <p>
        <strong>Average Waiting Time (AWT): </strong> {awt} ms
      </p>
      <p>
        <strong>Average Turnaround Time (ATAT): </strong> {atat} ms
      </p>
      <br />
      <h4>Waiting Time (WT) Computation</h4>
      <table>
        <thead>
          <tr>
            <th>Process</th>
            <th>Finish Time (FT)</th>
            <th>Arrival Time (AT)</th>
            <th>Waiting Time (WT)</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((data, index) => (
            <tr key={index}>
              <td>{data.process}</td>
              <td>{data.finishTime}</td>
              <td>{data.arrivalTime}</td>
              <td>{data.waitingTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <h4>Turnaround Time (TAT) Computation</h4>
      <table>
        <thead>
          <tr>
            <th>Process</th>
            <th>Response Time (RT)</th>
            <th>Arrival Time (AT)</th>
            <th>Turnaround Time (TAT)</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((data, index) => (
            <tr key={index}>
              <td>{data.process}</td>
              <td>{data.responseTime}</td>
              <td>{data.arrivalTime}</td>
              <td>{data.turnaroundTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
