import react from 'react';
import styles from '../styles/NavBar.module.css';

function Navbar(){
    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                SignalSafe
            </div>
            <div className={styles.tagline}>
                Detecting exploitation before harm occurs
            </div>
        </nav>
    );
}
export default Navbar;