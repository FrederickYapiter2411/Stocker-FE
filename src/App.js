import React from 'react';
import InventoryManager from './components/InventoryManager';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>Stocker - Manajemen Stok Barang V2</h1>
        <p>Sistem untuk mengelola inventaris barang</p>
      </header>
      <InventoryManager />
    </div>
  );
}

export default App;