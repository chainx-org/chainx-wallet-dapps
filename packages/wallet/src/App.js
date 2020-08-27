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
import { getChainx } from './services/chainx'
import { setHead } from './reducers/chainSlice'
import { useDispatch, useSelector } from 'react-redux'
import { addressSelector } from './reducers/addressSlice'
import { Loading } from './components'
import { loadingSelector } from './reducers/runStatusSlice'
import { addSnack, generateId, typeEnum } from './reducers/snackSlice'
import $t from './locale'
import {
  fetchAccountAssets,
  fetchAssetsInfo,
  fetchChainx2NativeAsset
} from './reducers/assetSlice'
import { fetchMiningAssets } from '@reducers/miningAssetSlice'
import { fetchValidators } from '@reducers/validatorSlice'
import Staking from '@pages/Staking'
import { fetchLocks } from '@reducers/assetSlice'
import Trade from '@pages/Trade'

const isChrome =
  /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)

function getChromeVersion() {
  const raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)

  return raw ? parseInt(raw[2], 10) : false
}

function App() {
  const address = useSelector(addressSelector)
  const dispatch = useDispatch()
  const loading = useSelector(loadingSelector)

  useEffect(() => {
    dispatch(fetchAssetsInfo())
    dispatch(fetchMiningAssets())
    dispatch(fetchValidators())
  }, [dispatch])

  useEffect(() => {
    // dispatch(fetchAccountAssets(address))
    // dispatch(fetchPseduNominationRecords(address))
    // dispatch(fetchBondingDuration())

    dispatch(fetchAccountAssets(address))
    dispatch(fetchLocks(address))
    dispatch(fetchChainx2NativeAsset(address))

    const api = getChainx()
    let unsubscribeNewHead = null
    api.rpc.chain
      .subscribeNewHeads(header => {
        dispatch(setHead(header.number.toNumber()))
      })
      .then(result => (unsubscribeNewHead = result))

    return () => {
      if (unsubscribeNewHead) {
        unsubscribeNewHead()
      }
    }
  }, [dispatch, address])

  // useEffect(() => {
  //   dispatch(fetchIntentions(true))
  //   dispatch(fetchNominationRecords(address))
  // }, [dispatch, address, isTestNet])

  useEffect(() => {
    if (isChrome && getChromeVersion() >= 80) {
      return
    }

    const id = generateId()
    const type = typeEnum.ERROR
    const title = $t('COMMON_INVALID_BROWSER_TITLE')
    const message = $t('COMMON_INVALID_BROWSER_MSG')
    dispatch(addSnack({ id, type, title, message }))
  }, [dispatch])

  return (
    <Router>
      <Header />
      <div className="wrapper">
        <Switch>
          <Route exact path="/" component={AssetManagement} />
          {/*<Route exact path="/mining" component={CrossChainMining} />*/}
          <Route exact path="/staking" component={Staking} />
          {/*<Route exact path="/trust" component={Trust} />*/}
          <Route exact path="/trade" component={Trade} />
          {/*<Route exact path="/contract" component={Contract} />*/}
          {/*<Route exact path="/txs" component={HistoryTransactions} />*/}
          {/*<Route exact path="/contract/code" component={ContractCode} />*/}
          {/*<Route exact path="/oddeven" component={OddEven} />*/}
          <Redirect to="/" />
        </Switch>
      </div>
      <Footer />
      {loading ? <Loading /> : null}
    </Router>
  )
}

export default App
