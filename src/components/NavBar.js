import React from 'react';
import styles from '../styles/NavBar.module.css';

function Navbar({ theme, toggleTheme }) {
  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <span className={styles.shield}>🛡️</span>
        <span className={styles.logo}>SignalSafe</span>
      </div>
      <div className={styles.center}>
        <span className={styles.tagline}>
          Detecting exploitation before harm occurs
        </span>
      </div>
      <div className={styles.right}>
        <button className={styles.themeToggle} onClick={toggleTheme}>
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;