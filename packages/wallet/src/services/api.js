export const mainNetApi = 'https://api.chainx.org/'
export const testNetApi = 'https://testnet.api.chainx.org.cn/'

let api = mainNetApi

export const setApi = url => {
  api = url
}

export const getApi = () => api
