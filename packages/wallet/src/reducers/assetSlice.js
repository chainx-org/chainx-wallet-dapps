import { createSlice } from '@reduxjs/toolkit'
import { getChainx } from '../services/chainx'
import { camelCaseKey } from './util'

const emptyAsset = {
  details: {
    Free: 0,
    ReservedCurrency: 0,
    ReservedDexFuture: 0,
    ReservedDexSpot: 0,
    ReservedStaking: 0,
    ReservedStakingRevocation: 0,
    ReservedWithdrawal: 0
  }
}

const assetSlice = createSlice({
  name: 'asset',
  initialState: {
    assetsInfo: [],
    assets: []
  },
  reducers: {
    setInfo: {
      reducer(state, action) {
        state.assetsInfo = action.payload
      }
    },
    setAssets: {
      reducer(state, action) {
        state.assets = action.payload
      }
    }
  }
})

export const fetchAccountAssets = address => async dispatch => {
  const chainx = getChainx()
  await chainx.isRpcReady()
  const { asset } = chainx

  const { data } = await asset.getAssetsByAccount(address, 0, 100)
  ;['PCX', 'BTC', 'L-BTC', 'SDOT'].forEach(token => {
    if (!data.find(asset => asset.name === token)) {
      data.push({
        name: token,
        ...emptyAsset
      })
    }
  })

  const assets = data.map(item => {
    return { name: item.name, details: camelCaseKey(item.details) }
  })

  dispatch(setAssets(assets))
}

export const fetchAssetsInfo = () => async dispatch => {
  const chainx = getChainx()
  await chainx.isRpcReady()
  const { asset } = chainx

  const resp = await asset.getAssets(0, 100)
  const assetsInfo = resp.data.map(item => {
    const details = camelCaseKey(item.details)
    const limitProps = camelCaseKey(item.limitProps)

    return { ...item, details, limitProps }
  })

  dispatch(setInfo(assetsInfo))
}

export const { setInfo, setAssets } = assetSlice.actions

export default assetSlice.reducer
