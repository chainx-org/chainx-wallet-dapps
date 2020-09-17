import { createSelector, createSlice } from '@reduxjs/toolkit'
import { getChainx } from '../services/chainx'
import { camelCaseKey } from './util'
import BigNumber from 'bignumber.js'
import { setSS58Format } from '@polkadot/keyring'

const emptyAsset = {
  Locked: '0',
  ReservedDexSpot: '0',
  ReservedWithdrawal: '0',
  ReservedXRC20: '0',
  Usable: '0'
}

const assetSlice = createSlice({
  name: 'asset',
  initialState: {
    nativeTokenInfo: {
      ss58Format: 42,
      tokenDecimals: 8,
      tokenSymbol: 'PCX'
    },
    nativeAsset: {
      free: '0',
      reserved: '0',
      miscFrozen: '0',
      feeFrozen: '0'
    },
    locks: {
      Bonded: '0',
      BondedWithdrawal: '0'
    },
    dexReserves: '0',
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
    },
    setNativeAsset(state, action) {
      state.nativeAsset = action.payload
    },
    setNativeTokenInfo(state, action) {
      state.nativeTokenInfo = action.payload
    },
    setLocks(state, { payload: { Bonded = '0', BondedWithdrawal = '0' } }) {
      state.locks = { Bonded, BondedWithdrawal }
    },
    setDexReserves(state, { payload }) {
      state.dexReserves = payload
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

export const fetchChainx2NativeAssetInfo = () => async dispatch => {
  const api = getChainx()
  const systemProperties = await api.rpc.system.properties()
  const properties = systemProperties.toJSON()
  setSS58Format(properties.ss58Format)
  dispatch(setNativeTokenInfo(properties))
}

export const fetchLocks = address => async dispatch => {
  const api = getChainx()
  const locks = await api.query.xStaking.locks(address)
  dispatch(setLocks(locks.toJSON()))
}

export const fetchDexReserves = address => async dispatch => {
  const api = getChainx()
  const reserve = await api.query.xSpot.nativeReserves(address)
  dispatch(setDexReserves(reserve.toString()))
}

export const fetchChainx2NativeAsset = address => async dispatch => {
  const api = getChainx()
  const asset = await api.query.system.account(address)
  let nativeAsset = {}
  for (let [key, value] of asset.data.entries()) {
    nativeAsset[key] = value.toString()
  }

  dispatch(setNativeAsset(nativeAsset))
}

export const {
  setInfo,
  setAssets,
  setNativeAsset,
  setNativeTokenInfo,
  setLocks,
  setDexReserves
} = assetSlice.actions

export const assetsInfoSelector = state => state.assets.assetsInfo
export const assetsSelector = state => state.assets.assets

export const normalizedAssetsSelector = createSelector(
  assetsSelector,
  assetsInfoSelector,
  (assets, infoArr) => {
    return infoArr.map(
      ({ id, info: { token, decimals: precision, chain } }) => {
        const target = assets.find(a => a.id === id)
        const details = target ? target.details : emptyAsset

        const total = Object.values(details).reduce(
          (sum, value) => sum + parseInt(value),
          0
        )

        return {
          id,
          total,
          details: camelCaseKey(details),
          token,
          precision,
          chain
        }
      }
    )
  }
)

export const xbtcSelector = createSelector(normalizedAssetsSelector, assets => {
  return assets.find(asset => asset.token === 'XBTC')
})
export const xbtcFreeSelector = createSelector(xbtcSelector, xbtc => {
  return xbtc?.details?.usable
})
export const xbtcPrecisionSelector = createSelector(xbtcSelector, xbtc => {
  return xbtc?.precision
})
export const xbtcIdSelector = createSelector(xbtcSelector, xbtc => xbtc?.id)

export const pcxAssetSelector = state => state.assets.nativeAsset
export const pcxFreeSelector = createSelector(
  pcxAssetSelector,
  ({ free, miscFrozen, feeFrozen }) => {
    return new BigNumber(free).minus(feeFrozen).toString()
  }
)
export const pcxTotalSelector = createSelector(
  pcxAssetSelector,
  ({ free, reserved }) => {
    return new BigNumber(free).plus(reserved).toString()
  }
)
export const pcxPrecisionSelector = state =>
  state.assets.nativeTokenInfo.tokenDecimals

export const pcxInfoSelector = createSelector(assetsInfoSelector, infoArr => {
  return infoArr.find(({ info }) => info.token === 'PCX') || {}
})

export const dexReserveSelector = state => state.assets.dexReserves
export const locksSelector = state => state.assets.locks

export default assetSlice.reducer
