// CustomAlert.jsx
import React from 'react';
import styles from '../assets/css/customAlert.module.css';

const CustomAlert = ({ title, message, buttons, onClose }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div>
          {buttons.map((button, index) => (
            <button key={index} onClick={() => { button.onPress(); onClose(); }}>
              {button.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;