import { createSelector } from '@reduxjs/toolkit'
import { pairsSelector } from '../../../../../reducers/tradeSlice'

export const currenciesSelector = createSelector(
  pairsSelector,
  pairs => {
    return pairs.map(pair => pair.currency)
  }
)
