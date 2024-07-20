import React from 'react';
import './App.scss';
import Navbar from './components/Navbar/Navbar';
import {Routes, Route} from 'react-router-dom'
import Home from './components/Home/Home';
function App() {
  return (
  <>
    <Navbar />
    <div className='navbar-space'></div>
    <Routes >
      <Route path='/' Component={Home}></Route>
    </Routes>
  </>
  );
}

export default App;
