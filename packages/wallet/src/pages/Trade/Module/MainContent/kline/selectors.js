import { createSelector } from '@reduxjs/toolkit'
import {
  klineTypeSelector,
  candlesSelector
} from '../../../../../reducers/klineSlice'
import { currentPairSelector } from '../../../../../reducers/tradeSlice'
import { toPrecision } from '../../../../../utils'

function normalizePrice(price, precision, unitPrecision) {
  return Number(
    Number(toPrecision(price, precision)).toFixed(precision - unitPrecision)
  )
}

const normalizedCandlesSelector = createSelector(
  candlesSelector,
  currentPairSelector,
  (candles = [], pair) => {
    if (!pair) {
      return []
    }
    const { precision, unitPrecision } = pair
    const assetPrecision = pair && pair.assets === 'PCX' ? 8 : 3
    return candles.map(candle => ({
      ...candle,
      open: normalizePrice(candle.open, precision, unitPrecision),
      high: normalizePrice(candle.high, precision, unitPrecision),
      low: normalizePrice(candle.low, precision, unitPrecision),
      close: normalizePrice(candle.close, precision, unitPrecision),
      volume: toPrecision(candle.volume, assetPrecision, false),
      date: candle.time * 1000
    }))
  }
)

export const typeCandlesSelector = createSelector(
  normalizedCandlesSelector,
  klineTypeSelector,
  (candles = [], type) => {
    const result = []

    candles.forEach((candle, index) => {
      if (index <= 0) {
        result.push(candle)
        return
      }

      const last = result[result.length - 1]
      let t = last.time + type
      while (t < candle.time) {
        const close = last.close
        result.push({
          time: t,
          date: t * 1000,
          open: close,
          low: close,
          high: close,
          close: close,
          volume: 0
        })

        t += type
      }

      result.push(candle)
    })

    return result
  }
)
