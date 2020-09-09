import { createSelector } from '@reduxjs/toolkit'
import { xbtcPrecisionSelector } from '../../../selectors/assets'
import { xbtcAssetSelector } from '../selectors'
import { xbtcIdSelector } from '@reducers/assetSlice'
import {
  accountMiningLedgerSelector,
  claimRestrictionOfSelector
} from '@reducers/miningAssetSlice'
import _ from 'lodash'
import { blockNumberSelector } from '@reducers/chainSlice'

export const xbtcFreeSelector = createSelector(
  xbtcPrecisionSelector,
  xbtcAssetSelector,
  (precision, asset) => {
    return precision !== null && asset
      ? { free: asset.details.free, precision }
      : {}
  }
)

export const xbtcClaimRestrictions = createSelector(
  xbtcIdSelector,
  claimRestrictionOfSelector,
  (id, restrictions) => {
    if (!id || _.isEmpty(restrictions)) {
      return null
    }

    return restrictions[id]
  }
)

export const btcLedgerSelector = createSelector(
  xbtcIdSelector,
  accountMiningLedgerSelector,
  (id, ledger) => {
    return (ledger || {})[id]
  }
)

export const btcNextClaimSelector = createSelector(
  btcLedgerSelector,
  xbtcClaimRestrictions,
  (ledger, restrictions) => {
    return (ledger?.lastClaim || 0) + (restrictions?.frequencyLimit || 0)
  }
)

export const reachClaimHeightSelector = createSelector(
  btcNextClaimSelector,
  blockNumberSelector,
  (nextClaim, blockNumber) => {
    return blockNumber >= nextClaim
  }
)

// 距离下次claim的block数
export const nextClaimDistanceSelector = createSelector(
  btcNextClaimSelector,
  blockNumberSelector,
  (nextClaim, blockNumber) => {
    return blockNumber >= nextClaim ? 0 : nextClaim - blockNumber
  }
)
