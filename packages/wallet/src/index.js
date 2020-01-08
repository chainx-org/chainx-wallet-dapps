import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import rootReducer from './reducers'
import { getChainx, setChainx } from './services/chainx'
import { setAccount, setExtensionAccounts } from './reducers/addressSlice'
import { setNode } from './reducers/nodeSlice'
import SnackGallery from './SnackGallery'
import { setNetwork } from './reducers/settingsSlice'
import { mainNetApi, setApi, testNetApi } from './services/api'
import { mainNetDemoAccount, testNetDemoAccount } from './utils/constants'
import { isDemoAccount } from './selectors'
import GlobalStyle from './GlobalStyle'

function loadState() {
  try {
    const serializedState = localStorage.getItem('state')
    if (serializedState === null) {
      return {}
    }
    return JSON.parse(serializedState)
  } catch (err) {
    return {}
  }
}

function saveState(state) {
  const serializedState = JSON.stringify(state)
  localStorage.setItem('state', serializedState)
}

const persistedState = loadState()
if (!persistedState.address) {
  if (
    persistedState.settings &&
    persistedState.settings.network === 'testnet'
  ) {
    persistedState.address = testNetDemoAccount
  } else {
    persistedState.address = mainNetDemoAccount
  }
}

const defaultNode = {
  name: 'w1.cn',
  url: 'wss://w1.chainx.org.cn/ws'
}
if (!persistedState.node) {
  persistedState.node = defaultNode
}
export const store = configureStore({
  reducer: rootReducer,
  preloadedState: persistedState || {}
})

store.subscribe(() => {
  const { address, node, settings } = store.getState()

  saveState({ address, node, settings })
})

let nodeResolve
const nodePromise = new Promise(resolve => {
  nodeResolve = resolve
})

async function setExtensionAccount(network) {
  const state = store.getState()
  const nowAddress = state.address

  const account = await window.chainxProvider.enable()
  if (!account) {
    store.dispatch(setExtensionAccounts([]))
    if (!isDemoAccount(nowAddress.address, network)) {
      store.dispatch(
        setAccount(
          network === 'testnet' ? testNetDemoAccount : mainNetDemoAccount
        )
      )
    }
    return
  }

  store.dispatch(setExtensionAccounts([{ ...account, network }]))
  if (nowAddress.isFromExtension && nowAddress.address !== account.address) {
    store.dispatch(
      setAccount({
        name: account.name,
        address: account.address,
        isFromExtension: true
      })
    )
  }
}

async function setExtensionNode(nowUrl) {
  const node = await window.chainxProvider.getCurrentNode()
  if (nowUrl !== node.url) {
    store.dispatch(setNode(node))
    setChainx(node.url)
  } else {
    setChainx(nowUrl)
  }
}

window.onload = async () => {
  const state = store.getState()
  let network = state.settings.network

  const { url } = store.getState().node
  if (!window.chainxProvider) {
    setChainx(url)
    store.dispatch(setExtensionAccounts([]))
    store.dispatch(
      setAccount(
        network === 'testnet' ? testNetDemoAccount : mainNetDemoAccount
      )
    )

    nodeResolve()
    return
  }

  network = await window.chainxProvider.getNetwork()
  store.dispatch(setNetwork(network))
  setApi(network === 'testnet' ? testNetApi : mainNetApi)

  await setExtensionAccount(network)
  await setExtensionNode(url)
  nodeResolve()

  window.chainxProvider.listenNetworkChange(({ from, to }) => {
    store.dispatch(setNetwork(to))
    window.location.reload()
  })

  window.chainxProvider.listenAccountChange(({ to }) => {
    console.log('update extension accounts', [to])
    if (to) {
      store.dispatch(setExtensionAccounts([to]))
      store.dispatch(
        setAccount({
          name: to.name,
          address: to.address,
          isFromExtension: true
        })
      )
    }

    window.location.reload()
  })

  window.chainxProvider.listenNodeChange(({ to }) => {
    const { url } = store.getState().node
    if (url !== to.url) {
      store.dispatch(setNode(to))
      setTimeout(() => {
        window.location.reload()
      }, 0)
    }
  })
}

const render = async () => {
  await getChainx().isRpcReady()

  const loading = window.document.getElementById('loading')
  loading.parentNode.removeChild(loading)

  ReactDOM.render(
    <React.Fragment>
      <GlobalStyle />
      <Provider store={store}>
        <SnackGallery />
        <App />
      </Provider>
    </React.Fragment>,
    document.getElementById('root')
  )
}

nodePromise.then(render)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
