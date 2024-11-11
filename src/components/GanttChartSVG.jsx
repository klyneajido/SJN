// GanttChartSVG.js
import React, { useRef } from 'react';
import styles from "../assets/css/ganttChart.module.css";

const GanttChartSVG = ({ data }) => {
  const containerRef = useRef(null);
  const cellWidth = 30;
  const cellHeight = 40;
  const totalTime = data[data.length - 1].end;
  const margin = { left: 25, right: 25 };
  const svgWidth = (totalTime + 1) * cellWidth;
  const borderRadius = 10;

  return (
    <div
      className={styles.svgContainer}
      ref={containerRef}
      style={{ overflowX: "auto", width: "900px" }}
    >
      <svg width={svgWidth} height={cellHeight * 2}>
        <g transform={`translate(${margin.left}, 0)`}>
          {data.map((item, index) => (
            <g key={index}>
              <rect
                x={item.start * cellWidth}
                y={0}
                width={(item.end - item.start) * cellWidth}
                height={cellHeight}
                rx={borderRadius}
                ry={borderRadius}
                className={item.label === "X" ? styles.idleCell : styles.processCell}
              />
              <text
                x={item.start * cellWidth + ((item.end - item.start) * cellWidth) / 2}
                y={cellHeight / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                className={styles.cellText}
              >
                {item.label}
              </text>
            </g>
          ))}
          {Array.from({ length: totalTime + 1 }).map((_, index) => (
            <g key={index}>
              <line
                x1={index * cellWidth}
                y1={cellHeight}
                x2={index * cellWidth}
                y2={cellHeight * 2}
                className={styles.timelineLine}
              />
              <text
                x={index * cellWidth}
                y={cellHeight * 1.5}
                textAnchor="middle"
                dominantBaseline="middle"
                className={styles.timelineText}
              >
                {index}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};

export default GanttChartSVG;
