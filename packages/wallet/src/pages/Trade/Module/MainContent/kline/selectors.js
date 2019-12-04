import { createSelector } from '@reduxjs/toolkit'
import {
  klineDataSelector,
  klineTypeSelector
} from '../../../../../reducers/klineSlice'
import { currentPairSelector } from '../../../../../reducers/tradeSlice'
import { toPrecision } from '../../../../../utils'

function normalizePrice(price, precision, unitPrecision) {
  return Number(toPrecision(price, precision)).toFixed(
    precision - unitPrecision
  )
}

const normalizedCandlesSelector = createSelector(
  klineDataSelector,
  currentPairSelector,
  (candles = [], pair) => {
    if (!pair) {
      return []
    }
    const { precision, unitPrecision } = pair
    console.log('pair', pair)
    return candles.map(candle => ({
      ...candle,
      open: normalizePrice(candle.open, precision, unitPrecision),
      high: normalizePrice(candle.high, precision, unitPrecision),
      low: normalizePrice(candle.low, precision, unitPrecision),
      close: normalizePrice(candle.close, precision, unitPrecision)
    }))
  }
)

export const candlesSelector = createSelector(
  normalizedCandlesSelector,
  klineTypeSelector,
  (candles = [], type) => {
    const result = []

    candles.forEach(candle => {
      if (result.length <= 0) {
        result.push(candle)
        return
      }

      const last = result[result.length - 1]
      let t = result.time + type
      while (t < candle.time) {
        const close = last.close
        result.push({
          time: t,
          date: new Date(t * 1000),
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
