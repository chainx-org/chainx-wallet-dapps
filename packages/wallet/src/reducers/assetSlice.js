import { createSelector, createSlice } from '@reduxjs/toolkit'
import { getChainx } from '../services/chainx'
import { camelCaseKey } from './util'

const emptyAsset = {
  Free: '0',
  Locked: '0',
  ReservedDexSpot: '0',
  ReservedWithdrawal: '0',
  ReservedXRC20: '0'
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
  const api = getChainx()
  const assets = await api.rpc.xassets.getAssetsByAccount(address)
  const json = assets.toJSON()
  const normalized = Object.keys(assets.toJSON()).map(id => {
    return {
      id,
      details: json[id]
    }
  })

  dispatch(setAssets(normalized))
}

export const fetchAssetsInfo = () => async dispatch => {
  const api = getChainx()
  const assets = await api.rpc.xassets.getAssets()
  const json = assets.toJSON()

  const normalized = Object.keys(json).map(id => {
    return {
      id,
      ...json[id]
    }
  })

  dispatch(setInfo(normalized))
}

export const { setInfo, setAssets } = assetSlice.actions

export const assetsInfoSelector = state => state.assets.assetsInfo
export const assetsSelector = state => state.assets.assets

export const normalizedAssetsSelector = createSelector(
  assetsSelector,
  assetsInfoSelector,
  (assets, infoArr) => {
    return infoArr.map(({ id, info: { token, precision } }) => {
      const target = assets.find(a => a.id === id)
      const details = target ? target.details : emptyAsset

      const total = Object.values(details).reduce(
        (sum, value) => sum + parseInt(value),
        0
      )

      return {
        total,
        details: camelCaseKey(details),
        token,
        precision
      }
    })
  }
)

export const pcxAssetSelector = createSelector(
  normalizedAssetsSelector,
  assets => {
    return assets.find(asset => asset.token === 'PCX')
  }
)

export const pcxFreeSelector = createSelector(pcxAssetSelector, asset => {
  const { details: { free } = {} } = asset || {}
  return free
})

export const pcxPrecisionSelector = createSelector(
  assetsInfoSelector,
  infoArr => {
    return infoArr
  }
)

export const pcxInfoSelector = createSelector(assetsInfoSelector, infoArr => {
  return infoArr.find(({ info }) => info.token === 'PCX') || {}
})

export default assetSlice.reducer
