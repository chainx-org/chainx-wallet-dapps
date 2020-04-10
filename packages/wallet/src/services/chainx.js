import ChainX from 'chainx.js'

let chainx = null

export const setChainx = async url => {
  const preChainx = chainx

  chainx = new ChainX(url)
  await chainx.isRpcReady()

  if (preChainx) {
    preChainx.provider.websocket.close()
  }

  return chainx
}

export const getChainx = () => chainx
