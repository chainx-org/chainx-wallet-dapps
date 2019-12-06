import { createSelector } from '@reduxjs/toolkit'
import {
  currentPairSelector,
  fillsSelector
} from '../../../reducers/tradeSlice'
import { assetsInfoSelector } from '../../selectors/assets'
import { toPrecision } from '../../../utils'
import { xbtcFreeSelector } from '../../AssetManagement/Assets/XbtcCard/selectors'
import { pcxFreeSelector } from '../../AssetManagement/PcxCard/selectors'
import { sdotFreeSelector } from '../../AssetManagement/Assets/selectors'

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

    const fill = fills[0]
    const { precision, unitPrecision } = pair || {
      precision: 0,
      unitPrecision: 0
    }

    return Number(toPrecision(fill.price, pair.precision)).toFixed(
      precision - unitPrecision
    )
  }
)

export const pairCurrencyFreeSelector = createSelector(
  currentPairSelector,
  xbtcFreeSelector,
  pcxFreeSelector,
  sdotFreeSelector,
  (pair, xbtc, pcx, sdot) => {
    if (!pair) {
      return null
    }

    if (pair.currency === 'BTC') {
      return xbtc
    } else if (pair.currency === 'SDOT') {
      return sdot
    } else {
      return pcx
    }
  }
)

export const pairAssetFreeSelector = createSelector(
  currentPairSelector,
  xbtcFreeSelector,
  pcxFreeSelector,
  sdotFreeSelector,
  (pair, xbtc, pcx, sdot) => {
    if (!pair) {
      return null
    }

    if (pair.assets === 'BTC') {
      return xbtc
    } else if (pair.assets === 'SDOT') {
      return sdot
    } else {
      return pcx
    }
  }
)

export const pairCurrencySelector = createSelector(
  currentPairSelector,
  pair => (pair ? pair.currency : null)
)
export const pairAssetSelector = createSelector(
  currentPairSelector,
  pair => (pair ? pair.assets : null)
)
export const pairShowPrecisionSelector = createSelector(
  currentPairSelector,
  pair => {
    if (!pair) {
      return null
    }

    return pair.precision - pair.unitPrecision
  }
)

export const pairPrecisionSelector = createSelector(
  currentPairSelector,
  pair => {
    return pair ? pair.precision : null
  }
)

export const pairAssetPrecision = createSelector(
  pairAssetFreeSelector,
  free => {
    if (!free) {
      return 0
    }

    return free.precision
  }
)

export const pairCurrencyPrecision = createSelector(
  pairCurrencyFreeSelector,
  free => {
    return free ? free.precision : 0
  }
)

export const maxBuyPriceSelector = createSelector(
  currentPairSelector,
  pair => {
    return pair ? pair.maximumBid : 0
  }
)

export const minSellPriceSelector = createSelector(
  currentPairSelector,
  pair => {
    return pair ? pair.minimumOffer : 0
  }
)
