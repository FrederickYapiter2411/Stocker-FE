import React from 'react';
import InventoryManager from './components/InventoryManager';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>Manajemen Stok Barang</h1>
        <p>Sistem untuk mengelola inventaris barang</p>
      </header>
      <InventoryManager />
    </div>
  );
}

export default App;