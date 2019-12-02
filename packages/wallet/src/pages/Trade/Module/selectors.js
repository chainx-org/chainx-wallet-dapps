import { createSelector } from '@reduxjs/toolkit'
import {
  currentPairSelector,
  fillsSelector
} from '../../../reducers/tradeSlice'
import { assetsInfoSelector } from '../../selectors/assets'
import { toPrecision } from '../../../utils'

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

export const currentFillsSelector = createSelector(
  currentPairSelector,
  fillsSelector,
  (currentPair, fills) => {
    return fills[(currentPair || {}).id] || []
  }
)

export const normalizedCurrentFillsSelector = createSelector(
  currentFillsSelector,
  fills => {
    return [...fills]
      .reverse()
      .map((fill, index, arr) => {
        const fragment = arr.slice(0, index + 1)

        const arise = fragment.reduce((arise, item, idx, arr) => {
          if (idx <= 0) {
            return arise
          }

          if (arise && item.price < arr[idx - 1].price) {
            return false
          } else if (!arise && item.price > arr[idx - 1].price) {
            return true
          }

          return arise
        }, true)

        return { ...fill, arise }
      })
      .reverse()
  }
)

export const currentShowPriceSelector = createSelector(
  currentPairSelector,
  normalizedCurrentFillsSelector,
  (pair, fills) => {
    if (!fills || fills.length <= 0) {
      return null
    }

    const fill = fills[fills.length - 1]
    const { precision, unitPrecision } = pair || {
      precision: 0,
      unitPrecision: 0
    }

    return Number(toPrecision(fill.price, pair.precision)).toFixed(
      precision - unitPrecision
    )
  }
)
