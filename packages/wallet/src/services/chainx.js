const { ApiPromise, WsProvider } = require('@chainx-v2/api')

let api = null
let provider = null

export const setChainx = async url => {
  console.log('url', url)
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
