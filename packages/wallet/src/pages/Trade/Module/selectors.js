import { createSelector } from '@reduxjs/toolkit'
import { currentPairSelector } from '../../../reducers/tradeSlice'
import { assetsInfoSelector } from '../../selectors/assets'

export const currentPairAssetInfo = createSelector(
  currentPairSelector,
  assetsInfoSelector,
  (pair, assetsInfo) => {
    if (!pair) {
      return null
    }

    const assets = pair.assets
    return assetsInfo.find(asset => asset.name === assets)
  }
)
