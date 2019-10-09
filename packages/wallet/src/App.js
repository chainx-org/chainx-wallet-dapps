import React from 'react'
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom'
import Header from './pages/Header'
import AssetManagement from './pages/AssetManagement'
import CrossChainMining from './pages/CrossChainMining'
import Staking from './pages/Staking'

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/" component={AssetManagement} />
        <Route exact path="/mining" component={CrossChainMining} />
        <Route exact path="/staking" component={Staking} />
        <Redirect to="/" />
      </Switch>
    </Router>
  )
}

export default App
