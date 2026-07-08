import React, { useState } from 'react';
import Navbar from './components/NavBar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import './App.css';

function App(){
  const [started, setStarted] = useState(false);
  return (
    <div className='app'>
      <Navbar/>
      {!started ? (
        <Home onGetStarted={() => setStarted(true)}/>
      ): (
        <Dashboard/>
      )}
    </div>
  );
}
export default App;