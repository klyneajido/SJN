import styles from "../assets/css/processes.module.css";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { faDeleteLeft } from "@fortawesome/free-solid-svg-icons/faDeleteLeft";

export default function Processes({ 
  processes, 
  handleClearTable, 
  handleDeleteProcess,
  handleEditProcess 
}) {
  const isScrollable = processes.length > 10;
  
  const renderTooltip = (text) => (props) => (
    <Tooltip
      id="button-tooltip"
      {...props}
      className={styles.actionBtnsTooltip}
    >
      {text}
    </Tooltip>
  );

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
            <th>Action</th>
          </tr>
        </thead>
        <tbody className={isScrollable ? styles.scrollableTbody : ""}>
          {processes.map((process) => (
            <tr key={process.process}>
              <td>P{process.process}</td>
              <td>{process.arrivalTime}</td>
              <td>{process.burstTime}</td>
              <td>
                <div className={styles.actionBtnsHolder}>
                  <OverlayTrigger
                    placement="left"
                    overlay={renderTooltip("Edit")}
                  >
                    <button 
                      className={styles.actionBtns}
                      onClick={() => handleEditProcess(process)}
                    >
                      <FontAwesomeIcon icon={faEdit} className="mr-2" />
                    </button>
                  </OverlayTrigger>
                  <OverlayTrigger
                    placement="right"
                    overlay={renderTooltip("Delete")}
                  >
                    <button 
                      className={styles.actionBtns}
                      onClick={() => handleDeleteProcess(process)}
                    >
                      <FontAwesomeIcon icon={faDeleteLeft} />
                    </button>
                  </OverlayTrigger>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
