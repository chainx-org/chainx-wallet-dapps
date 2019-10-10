import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom'
import Header from './pages/Header'
import Footer from './pages/Footer'
import AssetManagement from './pages/AssetManagement'
import CrossChainMining from './pages/CrossChainMining'
import Staking from './pages/Staking'
import chainx from './services/chainx'
import { setHead } from './reducers/chainSlice'
import { useDispatch } from 'react-redux'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    const subscriber = chainx.chain.subscribeNewHead().subscribe(head => {
      dispatch(setHead(head))
    })

    return subscriber.unsubscribe
  }, [dispatch])

  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/" component={AssetManagement} />
        <Route exact path="/mining" component={CrossChainMining} />
        <Route exact path="/staking" component={Staking} />
        <Redirect to="/" />
      </Switch>
      <Footer />
    </Router>
  )
}

export default App
