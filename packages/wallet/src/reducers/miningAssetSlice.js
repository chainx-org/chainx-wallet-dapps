import { createSelector, createSlice } from '@reduxjs/toolkit'
import { getChainx } from '../services/chainx'

const miningAssetSlice = createSlice({
  name: 'miningAsset',
  initialState: {
    assets: [],
    interestMap: {}
  },
  reducers: {
    setAssets(state, { payload }) {
      state.assets = payload
    },
    setInterestMap(state, { payload }) {
      state.interestMap = payload
    }
  }
})

export const { setAssets, setInterestMap } = miningAssetSlice.actions

export const fetchMiningAssets = () => async dispatch => {
  const api = getChainx()
  const assets = await api.rpc.xminingasset.getMiningAssets()
  dispatch(setAssets(assets.toJSON()))
}

export const fetchInterestByAccount = address => async dispatch => {
  const api = getChainx()
  const interestMap = await api.rpc.xminingasset.getDividendByAccount(address)
  dispatch(setInterestMap(interestMap.toJSON()))
}

export const fetchAccountMinerLedger = address => async dispatch => {
  const api = getChainx()
  const ledger = await api.rpc.xminingasset.getMinerLedgerByAccount(address)

  console.log('ledger', ledger)
}

export const miningAssetSelector = state => state.miningAsset.assets
export const interestMapSelector = state => state.miningAsset.interestMap

export const xbtcInterestSelector = createSelector(
  miningAssetSelector,
  interestMapSelector,
  (assets, map) => {
    return map[1] || '0'
  }
)

export default miningAssetSlice.reducer
