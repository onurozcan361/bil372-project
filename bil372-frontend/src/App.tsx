import React from 'react';
import logo from './logo.svg';
import './App.css';
import { AppBar, Tab } from '@mui/material';
import { Page } from './Page';

function App() {
  return (
    <div className="App">
      <AppBar position="static" sx={{ alignItems: 'start' }}>
        Okul Yonetim Sistemi
      </AppBar>
      <Page />
    </div>
  );
}

export default App;
