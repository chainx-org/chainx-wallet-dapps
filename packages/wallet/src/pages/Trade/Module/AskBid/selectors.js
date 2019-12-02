import { createSelector } from '@reduxjs/toolkit'
import { asksSelector } from '../../../../reducers/tradeSlice'

export const normalizedAsksSelector = createSelector(
  asksSelector,
  asks => {
    return [...asks]
      .reduce((result, ask) => {
        const len = result.length
        if (len <= 0) {
          return [
            {
              ...ask,
              sumAmount: ask.amount
            }
          ]
        }

        const sumAmount = result[len - 1].sumAmount + ask.amount
        return [
          ...result,
          {
            ...ask,
            sumAmount
          }
        ]
      }, [])
      .reverse()
  }
)
