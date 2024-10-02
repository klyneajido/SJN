
import styles from '../assets/css/simulateButton.module.css'
export default function SimulateButton(){
    return (
        <div className={styles.buttonContainer}>
            <button className={styles.simulateBtn}>Simulate</button>
        </div>
    );
}