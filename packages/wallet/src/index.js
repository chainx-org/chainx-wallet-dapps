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
import initStore, { defaultMainNetNode, defaultTestNetNode } from './store'
import { connectSigner, disconnectSigner } from './services/signer'
import { isTestNetSelector } from './reducers/settingsSlice'
import { setNode, urlSelector } from './reducers/nodeSlice'
import { setOpenSignerDownloadDialog } from './reducers/runStatusSlice'

export let store

let nodeResolve
const nodePromise = new Promise(resolve => {
  nodeResolve = resolve
})

export async function setDemoAccount(store) {
  const state = store.getState()

  const isTestNet = isTestNetSelector(state)

  store.dispatch(setNode(isTestNet ? defaultTestNetNode : defaultMainNetNode))
  const url = urlSelector(state)
  await setChainx(url)

  store.dispatch(
    setAccount(
      isTestNet ? testNetDemoAccount.account : mainNetDemoAccount.account
    )
  )
}

function getParameterByName(name, url) {
  if (!url) url = window.location.href
  name = name.replace(/[[\]]/g, '\\$&')
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

function checkAndOpenSignerDownloadDialog() {
  if (getParameterByName('open-signer-downloader') === '1') {
    store.dispatch(setOpenSignerDownloadDialog(true))
  }
}

store = initStore()
window.onload = async () => {
  checkAndOpenSignerDownloadDialog()

  const state = store.getState()

  const isDemo = isDemoSelector(state)
  const isExtension = isExtensionSelector(state)
  const isSigner = isSignerSelector(state)

  if (isDemo || (isExtension && !window.chainxProvider)) {
    await setDemoAccount(store)

    nodeResolve()
    return
  }

  if (isExtension) {
    try {
      await connectExtension()
    } catch (e) {
      await setDemoAccount(store)
    }
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
