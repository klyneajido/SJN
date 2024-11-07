import styles from "../assets/css/processes.module.css";
import React, { useState } from 'react';
export default function Processes({ processes, handleClearTable }) {
  const isScrollable = processes.length > 10;
  const [showButton, setShowButton] = useState(false);
  const handleMouseEnter = () => setShowButton(true);
  const handleMouseLeave = () => setShowButton(false);
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
            <tr key={process.id} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              {showButton && <button>Delete</button>}
              {showButton && <button>Edit</button>}
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

// TableComponent.js
// import React, { useState } from 'react';

// const TableComponent = () => {
//   const [showButton, setShowButton] = useState(false);

//   const handleMouseEnter = () => setShowButton(true);
//   const handleMouseLeave = () => setShowButton(false);

//   return (
//     <table>
//       <tbody>
//         {rows.map((row) => (
//           <tr key={row.id}>
//             <td onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
//               {row.data}
//               {showButton && <button>Hovered!</button>}
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };
