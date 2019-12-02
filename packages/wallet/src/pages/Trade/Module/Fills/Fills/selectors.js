import { createSelector } from '@reduxjs/toolkit'
import {
  currentPairSelector,
  fillsSelector
} from '../../../../../reducers/tradeSlice'

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
