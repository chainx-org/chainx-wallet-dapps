import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { Provider } from 'react-redux'
import { setChainx } from './services/chainx'
import {
  isDemoSelector,
  isExtensionSelector,
  isSignerSelector,
  setAccount
} from './reducers/addressSlice'
import SnackGallery from './SnackGallery'
import { mainNetDemoAccount, testNetDemoAccount } from './utils/constants'
import GlobalStyle from './GlobalStyle'
import { connectExtension } from './connector'
import initStore from './store'
import { connectSigner, disconnectSigner } from './services/signer'

export let store

let nodeResolve
const nodePromise = new Promise(resolve => {
  nodeResolve = resolve
})

async function setDemoAccount(store) {
  const state = store.getState()
  let network = state.settings.network
  const { url } = store.getState().node

  await setChainx(url)
  store.dispatch(
    setAccount(
      network === 'testnet'
        ? testNetDemoAccount.account
        : mainNetDemoAccount.account
    )
  )
}

window.onload = async () => {
  store = initStore()
  const state = store.getState()

  console.log('state', state)
  const isDemo = isDemoSelector(state)
  const isExtension = isExtensionSelector(state)
  const isSigner = isSignerSelector(state)

  if (isDemo || (isExtension && !window.chainxProvider)) {
    await setDemoAccount(store)

    nodeResolve()
    return
  }

  if (isExtension) {
    await connectExtension()
  } else if (isSigner) {
    try {
      await connectSigner()
    } catch (e) {
      disconnectSigner()
      await setDemoAccount(store)
    }
  }

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
