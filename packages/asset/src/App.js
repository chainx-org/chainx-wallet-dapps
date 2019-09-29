import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Header from './pages/Header'
import AssetManagement from './pages/AssetManagement'

function App() {
  return (
    <Router>
      <Header />
      <AssetManagement />
    </Router>
  )
}

export default App
