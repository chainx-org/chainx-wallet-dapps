import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './reducers'
import { mainNetDemoAccount, testNetDemoAccount } from './utils/constants'

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

function migrateState(state) {
  const { address } = state
  if (address && !address.version) {
    state.address = {
      version: 1,
      account: {
        address: address.address,
        name: address.name,
        isFromExtension: address.isFromExtension
      }
    }
  }

  if (!state.node) {
    state.node = defaultNode
  }

  if (!state.address) {
    state.address =
      state.settings && state.settings.network === 'testnet'
        ? testNetDemoAccount
        : mainNetDemoAccount
  }

  return state
}

const defaultNode = {
  name: 'w1.cn',
  url: 'wss://w1.chainx.org.cn/ws'
}

export default function initStore() {
  const persistedState = loadState()
  const normalizedState = migrateState(persistedState)

  const store = configureStore({
    reducer: rootReducer,
    preloadedState: normalizedState || {}
  })

  store.subscribe(() => {
    const { address, node, settings } = store.getState()
    saveState({ address, node, settings })
  })

  return store
}
