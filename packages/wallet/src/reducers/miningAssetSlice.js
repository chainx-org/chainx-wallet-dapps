import { createSelector, createSlice } from '@reduxjs/toolkit'
import { getChainx, getChainxPromised } from '../services/chainx'

const miningAssetSlice = createSlice({
  name: 'miningAsset',
  initialState: {
    assets: [],
    interestMap: {},
    accountMiningLedger: {},
    claimRestrictionOf: {}
  },
  reducers: {
    setAssets(state, { payload }) {
      state.assets = payload
    },
    setInterestMap(state, { payload }) {
      state.interestMap = payload
    },
    setAccountMiningLedger(state, { payload }) {
      state.accountMiningLedger = payload
    },
    setClaimRestrictionOf(state, { payload: { assetId, restrictions } }) {
      state.claimRestrictionOf = {
        ...state.claimRestrictionOf,
        [assetId]: restrictions
      }
    }
  }
})

export const {
  setAssets,
  setInterestMap,
  setAccountMiningLedger,
  setClaimRestrictionOf
} = miningAssetSlice.actions

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

  dispatch(setAccountMiningLedger(ledger.toJSON()))
}

export const fetchClaimRestrictionOf = assetId => async dispatch => {
  const api = await getChainxPromised()
  const restriction = await api.query.xMiningAsset.claimRestrictionOf(assetId)
  dispatch(
    setClaimRestrictionOf({ assetId, restrictions: restriction.toJSON() })
  )
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

export const accountMiningLedgerSelector = state =>
  state.miningAsset.accountMiningLedger
export const claimRestrictionOfSelector = state =>
  state.miningAsset.claimRestrictionOf

export default miningAssetSlice.reducer
