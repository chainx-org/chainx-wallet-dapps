import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { configureStore } from 'redux-starter-kit'
import { Provider } from 'react-redux'
import rootReducer from './reducers'
import { createGlobalStyle } from 'styled-components'
import { getChainx, setChainx } from './services/chainx'
import throttle from 'lodash.throttle'
import { setAccount, setExtensionAccounts } from './reducers/addressSlice'

const GlobalStyle = createGlobalStyle`
html {
  height: 100%;
}

body {
  margin: 0 auto;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #F0F1F2;
  overflow-x: auto;

  #root {
    display: flex;
    flex-direction: column;
    height: 100%;

    & > div.wrapper {
      display: flex;
      flex: 1;
      overflow-y: auto;

      & > div {
        &:not(.staking) {
          padding: 16px 16px 0;
          margin: 0 auto;
          min-width: 1280px;
          max-width: 1440px;
        }
      }
    }
  }
}

h6, p {
  margin: 0;
}

ul, li {
  list-style: none;
  padding: 0;
  margin: 0;
}
`

function loadState() {
  try {
    const serializedState = localStorage.getItem('state')
    if (serializedState === null) {
      return undefined
    }
    return JSON.parse(serializedState)
  } catch (err) {
    return undefined
  }
}

function saveState(state) {
  const serializedState = JSON.stringify(state)
  localStorage.setItem('state', serializedState)
}

const persistedState = loadState()
export const store = configureStore({
  reducer: rootReducer,
  preloadedState: persistedState || {}
})

store.subscribe(
  throttle(() => {
    const address = store.getState().address
    saveState({ address })
  }, 1000)
)

window.onload = () => {
  if (!window.chainxProvider) {
    return
  }

  window.chainxProvider.enable().then(account => {
    store.dispatch(setExtensionAccounts([account]))
  })

  window.chainxProvider.listenAccountChange(({ to }) => {
    store.dispatch(setExtensionAccounts([to]))
    const address = store.getState().address
    if (address.isFromExtension) {
      store.dispatch(
        setAccount({
          name: to.name,
          address: to.address,
          isFromExtension: true
        })
      )
    }
  })

  window.chainxProvider.getCurrentNode().then(node => {
    setChainx(node.url)
  })
}

getChainx()
  .isRpcReady()
  .then(() => {
    ReactDOM.render(
      <React.Fragment>
        <GlobalStyle />
        <Provider store={store}>
          <GlobalStyle />
          <App />
        </Provider>
      </React.Fragment>,
      document.getElementById('root')
    )
  })

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
