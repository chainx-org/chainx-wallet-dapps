import ChainX from 'chainx.js'

let chainx = null

export const setChainx = async url => {
  chainx = new ChainX(url)
  await chainx.isRpcReady()
  return chainx
}

export const getChainx = () => chainx
