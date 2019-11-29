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
import Trust from './pages/Trust'
import Trade from './pages/Trade'
import Contract from './pages/Contract/Home'
import ContractCode from './pages/Contract/Code'
import { getChainx } from './services/chainx'
import { setHead } from './reducers/chainSlice'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAccountAssets, fetchAssetsInfo } from './reducers/assetSlice'
import { addressSelector } from './reducers/addressSlice'
import { fetchPseduNominationRecords } from './reducers/intentionSlice'

function App() {
  const address = useSelector(addressSelector)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchAccountAssets(address))
    dispatch(fetchPseduNominationRecords(address))
    dispatch(fetchAssetsInfo())

    const subscriber = getChainx()
      .chain.subscribeNewHead()
      .subscribe(head => {
        dispatch(setHead(head))
      })

    return () => subscriber.unsubscribe()
  }, [dispatch, address])

  return (
    <Router>
      <Header />
      <div className="wrapper">
        <Switch>
          <Route exact path="/" component={AssetManagement} />
          <Route exact path="/mining" component={CrossChainMining} />
          <Route exact path="/staking" component={Staking} />
          <Route exact path="/trust" component={Trust} />
          <Route exact path="/trade" component={Trade} />
          <Route exact path="/contract" component={Contract} />
          <Route exact path="/contract/code" component={ContractCode} />
          <Redirect to="/" />
        </Switch>
      </div>
      <Footer />
    </Router>
  )
}

export default App
