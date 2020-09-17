import { ApiPromise, WsProvider } from '@polkadot/api'
import { options } from '@chainx-v2/api'
import types from './types'

let api = null
let provider = null

export const setChainx = async url => {
  const wsProvider = new WsProvider(url)
  api = new ApiPromise(options({ provider: wsProvider, types }))

  await api.isReady

  if (provider) {
    provider.disconnect()
  }
  provider = wsProvider

  return api
}

export const getChainx = () => api

export const getChainxPromised = async () => {
  await api.isReady
  return api
}
