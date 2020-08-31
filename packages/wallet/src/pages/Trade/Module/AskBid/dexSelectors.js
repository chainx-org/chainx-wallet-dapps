import { createSelector } from '@reduxjs/toolkit'
import {
  currentPairSelector,
  latestPriceSelector,
  pricePrecisionSelector
} from '@reducers/dexSlice'
import { assetsInfoSelector } from '@pages/selectors/assets'
import { toPrecision } from '../../../../utils'

export const asksSelectors = state => state.dex.depth.asks
export const bidsSelector = state => state.dex.depth.bids

export const currentPairAssetPrecisionSelector = createSelector(
  currentPairSelector,
  assetsInfoSelector,
  (pair = {}, assetsInfo) => {
    if (!pair) {
      return 0
    }

    const { baseCurrency } = pair
    if (baseCurrency === 0) {
      return 8
    }

    return assetsInfo.find(asset => String(asset.id) === String(baseCurrency))
      ?.info?.decimals
  }
)

export const pairPipPrecisionSelector = createSelector(
  currentPairSelector,
  pair => {
    if (!pair) {
      return 0
    }

    return pair.pipDecimals
  }
)

export const pairPrecisionSelector = createSelector(
  currentPairSelector,
  pair => {
    if (!pair) {
      return 0
    }

    return pair.pipDecimals - pair.tickDecimals
  }
)

export const showPriceSelector = createSelector(
  latestPriceSelector,
  pairPipPrecisionSelector,
  pricePrecisionSelector,
  (price, pip, precision) => {
    return Number(toPrecision(price, pip)).toFixed(precision)
  }
)

export const normalizedAsksSelector = createSelector(asksSelectors, asks => {
  return [...asks]
    .reduce((result, [amount, price]) => {
      const len = result.length
      result.push({
        amount,
        price,
        sumAmount: len <= 0 ? amount : result[len - 1].sum + amount
      })

      return result
    }, [])
    .reverse()
})

export const normalizedBidsSelector = createSelector(bidsSelector, bids => {})
