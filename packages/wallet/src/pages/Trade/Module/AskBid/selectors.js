import { createSelector } from '@reduxjs/toolkit'
import { asksSelector, bidsSelector } from '../../../../reducers/tradeSlice'

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

export const normalizedBidsSelector = createSelector(
  bidsSelector,
  bids => {
    let result = []

    ;[...bids].forEach((bid, index) => {
      if (index <= 0) {
        result.push({
          ...bid,
          sumAmount: bid.amount
        })

        return
      }

      const sumAmount = result[index - 1].sumAmount + bid.amount
      result.push({
        ...bid,
        sumAmount
      })
    })

    return result
  }
)
