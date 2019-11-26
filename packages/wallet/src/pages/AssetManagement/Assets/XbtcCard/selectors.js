import { createSelector } from '@reduxjs/toolkit'
import { xbtcPrecisionSelector } from '../../../selectors/assets'
import { xbtcAssetSelector } from '../selectors'

export const xbtcFreeSelector = createSelector(
  xbtcPrecisionSelector,
  xbtcAssetSelector,
  (precision, asset) => {
    return precision !== null && asset
      ? { free: asset.details.free, precision }
      : {}
  }
)
