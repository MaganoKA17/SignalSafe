import React, { useState } from 'react';
import Navbar from './components/NavBar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  const [started, setStarted] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('signalsafe-theme') || 'dark';
  });

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('signalsafe-theme', next);
      return next;
    });
  };

  return (
    <div className="app" data-theme={theme}>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      {!started ? (
        <Home onGetStarted={() => setStarted(true)} />
      ) : (
        <Dashboard />
      )}
    </div>
  );
}

export default App;