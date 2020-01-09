import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import rootReducer from './reducers'
import { setChainx } from './services/chainx'
import {
  extensionAccountSelector,
  isExtensionSelector,
  setAccount,
  setExtensionAccounts
} from './reducers/addressSlice'
import SnackGallery from './SnackGallery'
import { mainNetDemoAccount, testNetDemoAccount } from './utils/constants'
import GlobalStyle from './GlobalStyle'
import { connectExtension } from './connector'

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

function setExtensionAccount(network) {
  const state = store.getState()

  const isExtension = isExtensionSelector(state)
  if (!isExtension) {
    return
  }

  const account = extensionAccountSelector(state)
  const demoAccount =
    network === 'testnet' ? testNetDemoAccount : mainNetDemoAccount

  // 原来是插件账户，但是现在插件里无账户，则用体验账户
  store.dispatch(
    setAccount(
      account
        ? {
            name: account.name,
            address: account.address,
            isFromExtension: true
          }
        : demoAccount
    )
  )
}

window.onload = async () => {
  const state = store.getState()
  let network = state.settings.network

  const { url } = store.getState().node
  if (!window.chainxProvider) {
    await setChainx(url)
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

  await connectExtension()
  setExtensionAccount(network)

  nodeResolve()
}

const render = () => {
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
