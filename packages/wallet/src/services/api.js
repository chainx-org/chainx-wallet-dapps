export const mainNetApi = 'https://api.chainx.org.cn/'
export const testNetApi = 'https://testnet.api.chainx.org.cn/'
export const mainNetExplorer = 'https://scan-v2.chainx.org/'
export const testNetExplorer = 'https://testnet.scan.chainx.org.cn/'
export const btcTestNetHost = 'https://live.blockcypher.com/btc-testnet/'
export const btcMainNetHost = 'https://live.blockcypher.com/btc/'
export const testNetDefaultNodeUrl = 'wss://testnet.w1.chainx.org.cn/ws'
export const mainNetDefaultNodeUrl = 'wss://w1.chainx.org/ws'

export const mainNetApiV2 = 'https://api-v2.chainx.org/'

let api = mainNetApi

export const setApi = url => {
  api = url
}

export const getApi = () => api
