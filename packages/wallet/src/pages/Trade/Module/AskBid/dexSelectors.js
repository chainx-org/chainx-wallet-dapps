import { createSelector } from '@reduxjs/toolkit'
import {
  currentPairSelector,
  latestPriceSelector,
  pricePrecisionSelector
} from '@reducers/dexSlice'
import { bidsSelector, asksSelector } from '@reducers/tradeSlice'
import { assetsInfoSelector } from '@pages/selectors/assets'
import { safeAdd, toPrecision } from '../../../../utils'

//export const asksSelector = state => state.dex.depth.asks
//export const bidsSelector = state => state.dex.depth.bids

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

export const compare = property => {
  return function(a, b) {
    var value1 = a[property]
    var value2 = b[property]
    return value2 - value1
  }
}
export const normalizedAsksSelector = createSelector(asksSelector, asks => {
  return [...asks]
    .reduce((result, { price, amount }) => {
      const len = result.length
      result.push({
        price,
        amount,
        sumAmount:
          len <= 0 ? amount : safeAdd(result[len - 1].sumAmount, amount)
      })

      return result
    }, [])
    .sort(compare('price'))
})

export const normalizedBidsSelector = createSelector(bidsSelector, bids => {
  return [...bids]
    .reduce((result, { price, amount }) => {
      const len = result.length
      result.push({
        price,
        amount,
        sumAmount:
          len <= 0 ? amount : safeAdd(result[len - 1].sumAmount, amount)
      })
      return result
    }, [])
    .sort(compare('price'))
})
