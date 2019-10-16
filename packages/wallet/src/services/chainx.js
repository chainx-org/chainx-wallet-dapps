import ChainX from 'chainx.js'

let chainx = null

export const setChainx = url => {
  chainx = new ChainX(url)
  return chainx
}

export const getChainx = () => chainx
