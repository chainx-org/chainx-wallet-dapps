import { ApiPromise, WsProvider } from '@chainx-v2/api'

let api = null
let provider = null

export const setChainx = async url => {
  const wsProvider = new WsProvider(url)
  api = new ApiPromise({ provider: wsProvider })

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
