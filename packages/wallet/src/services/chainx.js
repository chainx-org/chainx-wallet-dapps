import ChainX from 'chainx.js'

let chainx = new ChainX('wss://w1.chainx.org.cn/ws')

export const setChainx = url => {
  chainx = new ChainX(url)
  return chainx
}

export const getChainx = () => chainx
